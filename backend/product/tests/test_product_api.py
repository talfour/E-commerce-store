"""Tests for product APIs."""
from decimal import Decimal

from core.models import Brand, Category, Product
from django.test import TestCase
from django.urls import reverse
from product.serializers import BrandSerializer, CategorySerializer, ProductSerializer
from rest_framework import status
from rest_framework.test import APIClient

PRODUCTS_URL = reverse("product-list")
CATEGORIES_URL = reverse("category-list")
BRANDS_URL = reverse("brand-list")


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
        "product-detail",
        args=[
            product_id,
        ],
    )


def detail_category_url(category_id):
    """Create and return a category detail URL."""
    return reverse(
        "category-detail",
        args=[
            category_id,
        ],
    )


class PublicProductAPITests(TestCase):
    """Test unauthenticated API requests."""

    def setUp(self):
        self.client = APIClient()

    def test_auth_not_required(self):
        """Test auth is not required to call API."""
        res = self.client.get(PRODUCTS_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_retrive_products(self):
        create_product()
        create_product()

        res = self.client.get(PRODUCTS_URL)

        products = Product.objects.all().order_by("-id")
        serializer = ProductSerializer(products, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_get_product_detail(self):
        """Test get product detail."""
        product = create_product()

        url = detail_product_url(product.id)
        res = self.client.get(url)

        serializer = ProductSerializer(product)
        self.assertEqual(res.data, serializer.data)


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
            'id': category.id,
            'name': category.name,
            'products': [dict(product) for product in CategorySerializer(category).data['products']],
            'children': []
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
