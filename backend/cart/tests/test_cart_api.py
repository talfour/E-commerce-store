from core.models import Brand, Category, Product
from django.test import TestCase
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APIClient

CART_URL_LIST = reverse("cart-list")
CART_URL_LIST_DATA = reverse("cart-get_cart_data")


class CartViewTests(TestCase):
    """Test the features of shopping cart."""

    def setUp(self):
        self.client = APIClient()
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

    def test_cart_get_urls(self):
        """Test that cart URLs are working"""
        response = self.client.get(CART_URL_LIST)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        response = self.client.get(CART_URL_LIST_DATA)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, dict)

    def test_add_items_to_cart(self):
        """Test that items added to the cart are successful."""
        response = self.client.get(CART_URL_LIST_DATA)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, dict)
        self.assertEqual(len(response.data["cart_items"]), 0)

        self.client.post(reverse("cart-add", args=[self.product1.id]), {"quantity": 1})
        self.client.post(reverse("cart-add", args=[self.product2.id]), {"quantity": 2})

        response = self.client.get(CART_URL_LIST_DATA)
        self.assertEqual(
            len(response.data), 4
        )  # response contain discount and coupon as well
        self.assertEqual(response.data["cart_items"][0]["name"], self.product1.name)

    def test_remove_item_from_cart(self):
        """Test that item is removed from cart successful."""
        self.client.post(reverse("cart-add", args=[self.product1.id]), {"quantity": 1})
        self.client.post(reverse("cart-add", args=[self.product2.id]), {"quantity": 10})
        response = self.client.get(CART_URL_LIST_DATA)
        self.assertEqual(len(response.data["cart_items"]), 2)

        url = reverse("cart-remove", args=[self.product1.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        new_response = self.client.get(CART_URL_LIST_DATA)
        self.assertEqual(len(new_response.data["cart_items"]), 1)
