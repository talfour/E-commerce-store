"""Tests for models."""
from decimal import Decimal

from core.models import Brand, Category, Order, OrderItem, Product, ProductImages
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase


class UserModelTests(TestCase):
    """Test models."""

    def test_create_user_with_email_successful(self):
        """Test creating a user with an email is successful."""
        email = "test@example.com"
        password = "test123!pass"
        user = get_user_model().objects.create_user(
            email=email,
            password=password,
        )

        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))

    def test_new_user_email_normalized(self):
        """Test email is normalized for new users."""
        sample_emails = [
            ["test1@EXAMPLE.com", "test1@example.com"],
            ["Test2@Example.com", "Test2@example.com"],
            ["TEST3@EXAMPLE.COM", "TEST3@example.com"],
            ["test4@example.COM", "test4@example.com"],
        ]

        for email, expected in sample_emails:
            user = get_user_model().objects.create_user(email, "sample123!")
            self.assertEqual(user.email, expected)

    def test_new_user_without_email_raises_error(self):
        """Test that creating a user without an email raises a ValueError."""
        with self.assertRaises(ValueError):
            get_user_model().objects.create_user("", "test123")

    def test_create_superuser(self):
        """Test creating a superuser."""
        user = get_user_model().objects.create_superuser(
            email="testsuper@exaple.com",
            password="test123",
        )
        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_staff)


class OrderItemModelTest(TestCase):
    def setUp(self):
        # Set up non-modified objects used by all test methods
        order = Order.objects.create(
            first_name="Test",
            last_name="User",
            email="test@example.com",
            address="123",
            postal_code="12345",
            city="Test",
        )
        brand = Brand.objects.create(name="Apple")
        category = Category.objects.create(name="Electronics")
        product = Product.objects.create(
            name="Test Product", price=10.00, brand=brand, category=category
        )
        self.order_item = OrderItem.objects.create(
            order=order, product=product, price=10.00, quantity=2
        )

    def test_get_cost(self):
        cost = self.order_item.get_cost()
        self.assertEqual(cost, self.order_item.price * self.order_item.quantity)


class ProductModelTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            "test@example.com", "testpass123"
        )
        self.category = Category.objects.create(name="Test")
        self.brand = Brand.objects.create(name="Test brand")

    def test_create_product(self):
        """Test creating a product is successful."""
        product = Product.objects.create(
            name="Test",
            category=self.category,
            brand=self.brand,
            price=Decimal("15.50"),
        )

        self.assertEqual(str(product), product.name)


class ProductImagesTestCase(TestCase):
    def setUp(self):
        self.brand = Brand.objects.create(name="Sample Brand")
        self.category = Category.objects.create(name="Sample Category")
        self.product = Product.objects.create(
            name="Example Product",
            brand=self.brand,
            category=self.category,
            price=Decimal("2.5"),
        )
        self.image = SimpleUploadedFile(
            "example.jpg", b"file_content", content_type="image/jpeg"
        )

    def test_product_image_creation(self):
        image = ProductImages.objects.create(product=self.product, image=self.image)
        self.assertEqual(image.product, self.product)

    def test_related_name(self):
        image = ProductImages.objects.create(product=self.product, image=self.image)
        self.assertIn(image, self.product.images.all())
