from core import models
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _


@admin.register(models.Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name"]


@admin.register(models.Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ["name"]


class ProductImagesInline(admin.TabularInline):
    model = models.ProductImages


@admin.register(models.Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "price", "available", "created", "updated"]
    list_filter = ["available", "created", "updated"]
    list_editable = ["price", "available"]
    inlines = [ProductImagesInline]


@admin.register(models.Review)
class ReviewAdmin(admin.ModelAdmin):
    model = models.Review
    list_display = ["product", "rating", "user"]
    list_filter = ["product"]


class OrderItemInline(admin.TabularInline):
    model = models.OrderItem
    raw_id_fields = ["product"]


@admin.register(models.Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "first_name",
        "last_name",
        "email",
        "address",
        "post_code",
        "city",
        "paid",
        "created",
        "updated",
    ]
    list_filter = ["paid", "created", "updated"]
    inlines = [OrderItemInline]
    search_fields = ["id", "email"]


@admin.register(models.UserAddress)
class UserAddressAdmin(admin.ModelAdmin):
    list_display = [
        "user",
        "first_name",
        "last_name",
        "address",
        "address2",
        "post_code",
        "city",
    ]


@admin.register(models.User)
class UserAdmin(BaseUserAdmin):
    """Define the admin pages for users."""

    ordering = ["id"]
    list_display = [
        "email",
    ]
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                )
            },
        ),
        (_("Important dates"), {"fields": ("last_login",)}),
    )
    readonly_fields = [
        "last_login",
    ]
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "password1",
                    "password2",
                    "is_active",
                    "is_staff",
                    "is_superuser",
                ),
            },
        ),
    )


@admin.register(models.Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ["code", "valid_from", "valid_to", "discount", "active"]
    list_filter = ["active", "valid_from", "valid_to"]
    search_fields = ["code"]
