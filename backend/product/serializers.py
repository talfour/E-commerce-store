from core import models
from rest_framework import serializers


class BrandSerializer(serializers.ModelSerializer):
    """Serializer for the Brand model."""

    class Meta:
        model = models.Brand
        fields = [
            "name",
        ]


class ProductImagesSerializer(serializers.ModelSerializer):
    """Serializer for Product model."""

    class Meta:
        model = models.ProductImages
        fields = [
            "id",
            "image",
        ]


class ProductSerializer(serializers.ModelSerializer):
    """Serializer for Product model."""

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
    """Serializer for Category model that contains products."""

    products = ProductSerializer(many=True)

    class Meta:
        model = models.Category
        fields = ["id", "name", "products"]


class CategoryAndChildSerializer(serializers.ModelSerializer):
    """Serializer for Category model that is listing child categories."""
    children = serializers.SerializerMethodField()

    class Meta:
        model = models.Category
        fields = ["id", "name", "children"]

    def get_children(self, instance):
        children = models.Category.objects.filter(parent=instance)
        serializer = CategoryAndChildSerializer(children, many=True)
        return serializer.data
