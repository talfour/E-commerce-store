from django.shortcuts import get_object_or_404

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from drf_spectacular.utils import extend_schema

from core import models
from .serializers import CategorySerializer, BrandSerializer, ProductSerializer


class CategoryViewSet(viewsets.ViewSet):
    """Simple Viewset for viewing categories."""

    permission_classes = [
        AllowAny,
    ]

    serializer_class = CategorySerializer()

    @extend_schema(responses=CategorySerializer)
    def list(self, request):
        queryset = models.Category.objects.all()
        serializer = CategorySerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        try:
            category = models.Category.objects.get(pk=pk)
        except models.Category.DoesNotExist:
            return Response({"detail": "Category not found"}, status=404)
        serializer = CategorySerializer(category)
        category_data = serializer.data

        products = models.Product.objects.filter(category=category)
        product_serializer = ProductSerializer(
            products, many=True, context={"request": request}
        )
        category_data["products"] = product_serializer.data
        return Response(category_data)


class BrandViewSet(viewsets.ViewSet):
    """Simple Viewset for viewing brands."""

    permission_classes = [
        AllowAny,
    ]


    @extend_schema(responses=BrandSerializer)
    def list(self, request):
        queryset = models.Brand.objects.all()
        serializer = BrandSerializer(queryset, many=True)
        return Response(serializer.data)


class ProductViewSet(viewsets.ViewSet):
    """Simple Viewset for viewing all products."""

    permission_classes = [
        AllowAny,
    ]

    @extend_schema(responses=ProductSerializer)
    def list(self, request):
        queryset = models.Product.objects.all()
        serializer = ProductSerializer(
            queryset, many=True, context={"request": request}
        )
        return Response(serializer.data)

    @extend_schema(responses=ProductSerializer)
    def retrieve(self, request, pk=None):
        queryset = models.Product.objects.all()
        product = get_object_or_404(queryset, pk=pk)
        serializer = ProductSerializer(product, context={"request": request})
        return Response(serializer.data)
