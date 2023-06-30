from decimal import Decimal

from core.models import Product
from django.conf import settings
from django.http import HttpRequest


class Cart(object):
    def __init__(self, request: HttpRequest):
        """Shopping Cart Initialization"""
        self.session = request.session
        cart = self.session.get(settings.CART_SESSION_ID)
        if not cart:
            # Saves empty shopping cart in session
            cart = self.session[settings.CART_SESSION_ID] = {}
        self.cart = cart

    def __iter__(self):
        """Iterate through the elements of cart and pull products from database"""
        product_ids = self.cart.keys()
        products = Product.objects.filter(id__in=product_ids)

        cart = self.cart.copy()
        for product in products:
            cart[str(product.id)]["product"] = product
        for item in cart.values():
            item["id"] = item["product"].id
            item["price"] = Decimal(item["price"])
            item["total_price"] = item["price"] * item["quantity"]
            yield item

    def __len__(self):
        """Count all elements in shopping cart"""
        return sum(item["quantity"] for item in self.cart.values())

    def add(self, product, quantity: int = 1, update_quantity: bool = False):
        """Add product to cart or change quantity"""
        product_id = str(product.id)
        if product_id not in self.cart:
            self.cart[product_id] = {"quantity": 0, "price": str(product.price)}
        if update_quantity:
            self.cart[product_id]["quantity"] = int(quantity)
        else:
            self.cart[product_id]["quantity"] += int(quantity)
        self.save()

    def save(self):
        # Set session as modified to make sure it saves
        self.session.modified = True

    def remove(self, product):
        """Remove product from cart."""
        product_id = str(product.id)
        if product_id in self.cart:
            del self.cart[product_id]
            self.save()

    def get_total_price(self):
        """Get total price for items in cart."""
        total_price = sum(
            Decimal(item["price"]) * item["quantity"] for item in self.cart.values()
        )
        return total_price

    def clear(self):
        """Clear content of cart."""
        self.cart = {}
        del self.session[settings.CART_SESSION_ID]
        self.save()
