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


class ReviewSerializer(serializers.ModelSerializer):
    """Serializer for Review model."""

    product_id = serializers.IntegerField()

    class Meta:
        model = models.Review
        fields = ["comment", "rating", "product_id"]


class ProductSerializer(serializers.ModelSerializer):
    """Serializer for Product model."""

    reviews = serializers.SerializerMethodField(read_only=True)
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
            "reviews",
            "rating",
            "num_reviews",
        ]

    def get_reviews(self, obj):
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data


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
