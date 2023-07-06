from core import models
from django.db.models import Q
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .serializers import (
    BrandSerializer,
    CategoryAndChildSerializer,
    CategorySerializer,
    ProductSerializer,
)


class CategoryViewSet(viewsets.ViewSet):
    """
    Simple Viewset for viewing categories.
    """

    permission_classes = [AllowAny]
    serializer_class = CategorySerializer()

    @extend_schema(responses=CategorySerializer)
    def list(self, request):
        queryset = models.Category.objects.all()
        serializer = CategorySerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        category = get_object_or_404(models.Category, pk=pk)
        serializer = CategorySerializer(category)
        category_data = serializer.data

        child_categories = models.Category.objects.filter(parent=category)
        child_category_serializer = CategorySerializer(
            child_categories, many=True, context={"request": request}
        )
        category_data["children"] = child_category_serializer.data

        products = models.Product.objects.filter(category=category)
        product_serializer = ProductSerializer(
            products, many=True, context={"request": request}
        )
        category_data["products"] = product_serializer.data
        return Response(category_data)


class CategoryChildrenView(viewsets.ViewSet):
    """
    Viewset for listing unique categories that are under parent.
    """

    permission_classes = [AllowAny]

    def list(self, request):
        queryset = models.Category.objects.all()
        serialized_data = CategoryAndChildSerializer(queryset, many=True).data

        # Create a set to store the already displayed category IDs
        displayed_categories = set()

        # Filter out duplicate categories
        filtered_data = []
        for category in serialized_data:
            if category["id"] not in displayed_categories:
                filtered_data.append(category)
                displayed_categories.add(category["id"])

                # Add child categories to the displayed set
                for child_category in category.get("children", []):
                    displayed_categories.add(child_category["id"])

        return Response(filtered_data)


class BrandViewSet(viewsets.ViewSet):
    """
    Simple Viewset for viewing brands.
    """

    permission_classes = [AllowAny]

    @extend_schema(responses=BrandSerializer)
    def list(self, request):
        queryset = models.Brand.objects.all()
        serializer = BrandSerializer(queryset, many=True)
        return Response(serializer.data)


class ProductViewSet(viewsets.ViewSet):
    """
    Simple Viewset for viewing all products.
    """

    permission_classes = [AllowAny]

    @extend_schema(responses=ProductSerializer)
    def list(self, request):
        search_query = request.query_params.get("search", None)
        queryset = models.Product.objects.prefetch_related("brand").all()

        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query) | Q(description__icontains=search_query)
            )
        serializer = ProductSerializer(
            queryset, many=True, context={"request": request}
        )
        return Response(serializer.data)

    @extend_schema(responses=ProductSerializer)
    def retrieve(self, request, pk=None):
        product = get_object_or_404(models.Product, pk=pk)
        serializer = ProductSerializer(product, context={"request": request})
        return Response(serializer.data)
