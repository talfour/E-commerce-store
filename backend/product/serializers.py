from core import models
from rest_framework import serializers


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Brand
        fields = [
            "name",
        ]


class ProductImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ProductImages
        fields = [
            "id",
            "image",
        ]


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImagesSerializer(many=True)
    brand = BrandSerializer()

    class Meta:
        model = models.Product
        fields = [
            "id",
            "name",
            "description",
            "brand",
            "category",
            "price",
            "available",
            "created",
            "updated",
            "images",
        ]


class CategorySerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True)

    class Meta:
        model = models.Category
        fields = ["id", "name", "products"]
