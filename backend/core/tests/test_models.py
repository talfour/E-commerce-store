"""Tests for models."""
import os
import shutil
import tempfile
from decimal import Decimal

from core.models import (
    Brand,
    Category,
    Order,
    OrderItem,
    Product,
    ProductImages,
    UserAddress,
)
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

    def test_new_user_shipping_address_added_successful(self):
        """Test that creating a new shipping address is successful."""
        user = get_user_model().objects.create_user(
            email="test@example.com",
            password="testpass123",
        )
        address = UserAddress.objects.create(
            user=user,
            first_name="Test Name",
            last_name="Test Last Name",
            address="Address 123",
            city="City",
            post_code="XX-XXX",
        )
        self.assertEqual(address.user, user)
        self.assertEqual(str(address), address.user.email)

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
            post_code="12345",
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
        self.temp_dir = tempfile.mkdtemp()
        self.image = SimpleUploadedFile(
            "thenounproject.svg", b"file_content", content_type="image/svg+xml"
        )

    def tearDown(self):
        shutil.rmtree(self.temp_dir)

    def test_product_image_creation(self):
        image_path = os.path.join(self.temp_dir, "thenounproject.svg")
        with open(image_path, "wb") as f:
            f.write(b"file_content")
        image = ProductImages.objects.create(product=self.product, image=image_path)
        self.assertEqual(image.product, self.product)

    def test_related_name(self):
        image_path = os.path.join(self.temp_dir, "thenounproject.svg")
        with open(image_path, "wb") as f:
            f.write(b"file_content")

        image = ProductImages.objects.create(product=self.product, image=image_path)
        self.assertIn(image, self.product.images.all())
