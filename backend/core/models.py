"""Database models."""


import os
import uuid
from datetime import date
from decimal import Decimal

from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.core.mail import send_mail
from django.db import models
from django.db.models import Sum
from django.dispatch import receiver
from django_rest_passwordreset.signals import reset_password_token_created
from mptt.models import MPTTModel, TreeForeignKey


class Category(MPTTModel):
    """Model for product category"""

    name = models.CharField(max_length=125, verbose_name="Product Category")
    parent = TreeForeignKey("self", on_delete=models.PROTECT, null=True, blank=True)

    class MPTTMeta:
        order_insertion_by = ["name"]

    def __str__(self):
        return self.name


class Brand(models.Model):
    """Model for product brand"""

    name = models.CharField(max_length=125)

    class Meta:
        ordering = ("-name",)

    def __str__(self):
        return self.name


class Product(models.Model):
    """Model representing Product"""

    name = models.CharField(max_length=125)
    description = models.TextField(blank=True)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    category = TreeForeignKey(
        "Category",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="products",
    )
    price = models.DecimalField(max_digits=10, decimal_places=2)
    rating = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    num_reviews = models.IntegerField(null=True, blank=True, default=0)
    available = models.BooleanField(default=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-id",)

    def __str__(self):
        return self.name

    def get_image_url(self, request):
        """Get first image"""
        if self.images.exists():
            return request.build_absolute_uri(self.images.first().image.url)


def upload_image(instance, filename):
    """Generate a UUID for the image filename."""

    ext = filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    today = date.today().strftime("%Y/%m/%d")
    return os.path.join("products", today, filename)


class ProductImages(models.Model):
    """Model representing product images"""

    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to=upload_image, blank=True)


class Order(models.Model):
    """Model representing order details"""

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField()
    address = models.CharField(max_length=250)
    post_code = models.CharField(max_length=20)
    city = models.CharField(max_length=100)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    paid = models.BooleanField(default=False)
    user = models.ForeignKey("User", on_delete=models.DO_NOTHING, null=True, blank=True)

    class Meta:
        ordering = ("-created",)

    def __str__(self):
        return "Order {}".format(self.id)

    def get_total_cost(self):
        total_cost = self.items.aggregate(total_cost=Sum("cost"))["total_cost"]
        if total_cost != 0:
            total_cost = "{:0.2f}".format(total_cost)
        return total_cost or Decimal(0)


class OrderItem(models.Model):
    """Model representing items in order."""

    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(
        Product, related_name="order_items", on_delete=models.CASCADE
    )
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    cost = models.DecimalField(max_digits=10, decimal_places=2, blank=True)

    def __str__(self):
        return "{}".format(self.id)

    def save(self, *args, **kwargs):
        self.cost = Decimal(self.price) * self.quantity
        super().save(*args, **kwargs)


class UserManager(BaseUserManager):
    """Manager for users."""

    def create_user(self, email, password=None, **extra_field):
        """Create, save and return a new user."""
        if not email:
            raise ValueError("User must have an email address.")
        user = self.model(email=self.normalize_email(email), **extra_field)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password):
        """Create, save and return a new superuser"""
        user = self.create_user(email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save()

        return user


class User(AbstractBaseUser, PermissionsMixin):
    """Model representing user in the system."""

    email = models.EmailField(max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"


@receiver(reset_password_token_created)
def password_reset_token_created(
    sender, instance, reset_password_token, *args, **kwargs
):
    """Function that reset password for User model."""
    email_plaintext_message = "127.0.0.1:3000/profile/reset-password/?token={}".format(
        reset_password_token.key
    )
    send_mail(
        "Reset hasła na stronie VapeMate",
        email_plaintext_message,
        "noreply@example.com",
        [reset_password_token.user.email],
    )


class UserAddress(models.Model):
    """Model representing user address."""

    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    address2 = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=100)
    post_code = models.CharField(max_length=6)

    def __str__(self):
        return str(self.user)


class Review(models.Model):
    """Model representing product review."""

    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    rating = models.IntegerField(null=True, blank=True, default=0)
    comment = models.TextField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.rating)
