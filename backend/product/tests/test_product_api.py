"""Tests for product APIs."""
from decimal import Decimal

from core.models import Brand, Category, Order, Product, Review
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from product.pagination import CustomLimitOffsetPagination
from product.recommender import Recommender
from product.serializers import BrandSerializer, CategorySerializer, ProductSerializer
from product.views import ProductViewSet
from rest_framework import status
from rest_framework.test import APIClient

PRODUCTS_URL = reverse("products-list")
CATEGORIES_URL = reverse("categories-list")
BRANDS_URL = reverse("brands-list")
REVIEWS_URL = reverse("reviews-list")


def create_category(**params):
    """Create and return a sample category."""
    defaults = {"name": "Test category"}
    defaults.update(params)
    category = Category.objects.create(**defaults)
    return category


def create_brand(**params):
    """Create and return a sample brand."""
    defaults = {"name": "Sample brand"}
    defaults.update(params)
    brand = Brand.objects.create(**defaults)
    return brand


def create_product(**params):
    """Create and return a sample product."""
    category = create_category()
    brand = create_brand()
    defaults = {
        "name": "Sample product.",
        "price": Decimal("20.5"),
        "category": category,
        "brand": brand,
        "description": "Test description",
    }
    defaults.update(params)

    product = Product.objects.create(**defaults)
    return product


def detail_product_url(product_id):
    """Create and return a product detail URL."""
    return reverse(
        "products-detail",
        args=[
            product_id,
        ],
    )


def detail_category_url(category_id):
    """Create and return a category detail URL."""
    return reverse(
        "categories-detail",
        args=[
            category_id,
        ],
    )


class PublicProductAPITests(TestCase):
    """Test unauthenticated API requests."""

    view = ProductViewSet

    def setUp(self):
        self.client = APIClient()

    def test_auth_not_required(self):
        """Test auth is not required to call API."""
        res = self.client.get(PRODUCTS_URL, {"limit": "50"})
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_retrieve_product(self):
        product = create_product()
        url = detail_product_url(product.id)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        serializer = ProductSerializer(product)
        self.assertEqual(response.data, serializer.data)

    def test_get_product_detail(self):
        """Test get product detail."""
        product = create_product()

        url = detail_product_url(product.id)
        res = self.client.get(url)

        serializer = ProductSerializer(product)
        self.assertEqual(res.data, serializer.data)

    def test_pagination(self):
        """Test for product pagination."""
        self.view.pagination_class = CustomLimitOffsetPagination
        response = self.client.get(PRODUCTS_URL, {"limit": 50})
        self.assertEqual(response.status_code, 200)
        self.assertIn("results", response.data)
        self.assertIn("count", response.data)
        self.assertIn("next", response.data)
        self.assertIn("previous", response.data)

    def test_search(self):
        """Test search functionality"""
        product = create_product(name="Test product")
        product2 = create_product(name="I am hidden", description="I am hidden")
        response = self.client.get(PRODUCTS_URL, {"search": "test", "limit": 50})
        self.assertEqual(response.data["count"], 1)
        results = response.data["results"]
        result = results[0]
        self.assertEqual(result["name"], product.name)
        self.assertNotEqual(result["name"], product2.name)

    def test_search_pagination(self):
        """Test search and pagination together"""
        response = self.client.get(PRODUCTS_URL, {"search": "query", "limit": 50})
        self.assertEqual(response.status_code, 200)
        self.assertIn("results", response.data)
        self.assertIn("count", response.data)
        self.assertIn("next", response.data)
        self.assertIn("previous", response.data)


class RecommendedProductTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.product = create_product()
        self.recommender = Recommender()

    def test_get_recommended_products(self):
        """Test to verify if the API endpoint returns recommended products based on the products purchased."""
        product = create_product()
        self.recommender.products_bought([self.product, product])
        url = reverse("recommended-products-detail", args=[self.product.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], product.id)

    def test_get_recommended_products_with_invalid_product_id(self):
        """Test to verify if the API endpoint handles the case of an invalid product ID."""
        url = reverse("recommended-products-detail", args=["123"])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class PublicCategoryAPITests(TestCase):
    """Test unauthenticated API requests."""

    def setUp(self):
        self.client = APIClient()

    def test_auth_not_required(self):
        """Test auth is not required to call API."""
        res = self.client.get(CATEGORIES_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_retrieve_categories(self):
        create_category()
        create_category(name="Another category")

        res = self.client.get(CATEGORIES_URL)

        categories = Category.objects.all().order_by("-id")
        serializer = CategorySerializer(categories, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_get_category_detail(self):
        """Test get category detail."""
        category = create_category()
        create_product(category=category)

        url = detail_category_url(category.id)
        res = self.client.get(url)

        expected_data = {
            "id": category.id,
            "name": category.name,
            "products": [
                dict(product)
                for product in CategorySerializer(category).data["products"]
            ],
            "children": [],
        }
        self.assertEqual(res.data, expected_data)


class PublicBrandAPITests(TestCase):
    """Test unauthenticated API requests."""

    def setUp(self):
        self.client = APIClient()

    def test_auth_not_required(self):
        """Test auth is not required to call API."""
        res = self.client.get(BRANDS_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_retrive_brands(self):
        create_brand()
        create_brand(name="Another brand")

        res = self.client.get(BRANDS_URL)

        brands = Brand.objects.all().order_by("-name")
        serializer = BrandSerializer(brands, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)


class PrivateReviewAPITests(TestCase):
    """Test authenticated API requests."""

    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            email="test@example.com", password="testpass123"
        )
        self.second_user = get_user_model().objects.create_user(
            email="test1@example.com", password="testpass123!"
        )
        self.client.force_authenticate(user=self.user)

    def test_create_review(self):
        """Test creating product review."""
        product = create_product()
        order = Order.objects.create(user=self.user, paid=True)
        order.items.create(product=product, price=10.0, quantity=1)

        data = {"product_id": product.id, "rating": 4, "comment": "Great product!"}

        response = self.client.post(REVIEWS_URL, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        review = Review.objects.first()
        self.assertEqual(review.user, self.user)
        self.assertEqual(review.product, product)

        product.refresh_from_db()
        self.assertEqual(product.num_reviews, 1)
        self.assertEqual(product.rating, 4)

    def test_avg_rating_reviews(self):
        """Test average rating for product"""
        product = create_product()
        order = Order.objects.create(user=self.user, paid=True)
        order.items.create(product=product, price=10.0, quantity=1)

        data = {"product_id": product.id, "rating": 1, "comment": "Great product!"}

        response = self.client.post(REVIEWS_URL, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.client.force_authenticate(user=self.second_user)
        data2 = {"product_id": product.id, "rating": 5, "comment": "Not working"}
        res = self.client.post(REVIEWS_URL, data2)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        product.refresh_from_db()
        reviews = product.review_set.all()
        total = 0
        for i in reviews:
            total += i.rating
        rating = total / len(reviews)
        self.assertEqual(product.num_reviews, 2)
        self.assertEqual(product.rating, rating)

    def test_create_review_already_reviewed(self):
        """Test that user is not allowed to review product again."""
        product = create_product()
        Review.objects.create(
            user=self.user, product=product, rating=4, comment="Good stuff"
        )

        data = {"product_id": product.id, "rating": 5, "comment": "Amazing product"}

        response = self.client.post(REVIEWS_URL, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {"detail": "Product already reviewed"})

    def test_create_review_not_in_paid_order(self):
        """Test that user is unable to review product if order was not paid."""
        product = create_product()
        data = {
            "product_id": product.id,
            "rating": 5,
            "comment": "Amazing product!",
        }

        response = self.client.post(REVIEWS_URL, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data,
            {"detail": "Order must be paid to leave a review."},
        )

    def test_create_review_invalid_rating(self):
        """Test that review must contain valid rating."""
        product = create_product()
        order = Order.objects.create(user=self.user, paid=True)
        order.items.create(product=product, price=10.0, quantity=1)

        data = {
            "product_id": product.id,
            "rating": 0,
            "comment": "Invalid rating",
        }

        response = self.client.post(REVIEWS_URL, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data,
            {"detail": "Please select a rating."},
        )
