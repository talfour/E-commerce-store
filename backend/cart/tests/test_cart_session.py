from decimal import Decimal

from cart.cart import Cart
from core.models import Brand, Category, Product
from django.contrib.sessions.middleware import SessionMiddleware
from django.test import TestCase
from django.test.client import RequestFactory


class CartTestCase(TestCase):
    """Test the features of shopping cart stored in session."""

    def setUp(self):
        self.factory = RequestFactory()
        self.request = self.factory.get("/")
        self.session_middleware = SessionMiddleware(lambda request: None)
        self.session_middleware.process_request(self.request)
        self.request.session.save()
        category = Category.objects.create(name="Test category")
        brand = Brand.objects.create(name="Test brand")
        self.product1 = Product.objects.create(
            name="Product 1",
            category=category,
            brand=brand,
            description="Product 1 desc",
            price=10.0,
            available=True,
        )
        self.product2 = Product.objects.create(
            name="Product 2",
            category=category,
            brand=brand,
            description="Product 2 desc",
            price=20.0,
            available=True,
        )

    def test_cart_initialization(self):
        """Test that checks if cart was initialized."""
        cart = Cart(self.request)
        self.assertIsInstance(cart.cart, dict)

    def test_cart_iteration(self):
        """Test iterate the cart object."""
        cart = Cart(self.request)
        cart.add(self.product1, quantity=2)
        for item in cart:
            self.assertEqual(item["product"], self.product1)
            self.assertEqual(item["quantity"], 2)
            self.assertEqual(item["price"], Decimal(self.product1.price))
            self.assertEqual(item["total_price"], Decimal("20.0"))

    def test_cart_length(self):
        """Test that checks if cart length is correct."""
        cart = Cart(self.request)
        cart.add(self.product1, quantity=2)
        self.assertEqual(len(cart), 2)

    def test_cart_add(self):
        """Test item add successfully."""
        cart = Cart(self.request)
        cart.add(self.product1, quantity=2)
        self.assertEqual(cart.cart[str(self.product1.id)]["quantity"], 2)
        cart.add(self.product1, quantity=3)
        self.assertEqual(cart.cart[str(self.product1.id)]["quantity"], 5)

    def test_cart_remove(self):
        """Test item removed from cart successfully."""
        cart = Cart(self.request)
        cart.add(self.product1, quantity=2)
        self.assertIn(str(self.product1.id), cart.cart)
        cart.remove(self.product1)
        self.assertNotIn(str(self.product1.id), cart.cart)

    def test_cart_get_total_price(self):
        """Test check if total prices is correct after adding objects to cart."""
        cart = Cart(self.request)
        cart.add(self.product1, quantity=2)
        cart.add(self.product2, quantity=3)
        self.assertEqual(cart.get_total_price(), Decimal("80.0"))

    def test_cart_clear(self):
        """Test clearing cart."""
        cart = Cart(self.request)
        cart.add(self.product1, quantity=2)
        self.assertIn(str(self.product1.id), cart.cart)
        cart.clear()
        self.assertNotIn(str(self.product1.id), cart.cart)
