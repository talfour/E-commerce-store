from django.shortcuts import get_object_or_404

from rest_framework import viewsets
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from core import models
from .serializers import CategorySerializer, BrandSerializer, ProductSerializer


class CategoryViewSet(viewsets.ViewSet):
    """Simple Viewset for viewing categories."""

    queryset = models.Category.objects.all()
    serializer_class = CategorySerializer()

    @extend_schema(responses=CategorySerializer)
    def list(self, request):
        serializer = CategorySerializer(self.queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        try:
            category = models.Category.objects.get(pk=pk)
        except models.Category.DoesNotExist:
            return Response({"detail": "Category not found"}, status=404)
        serializer = CategorySerializer(category)
        category_data = serializer.data

        products = models.Product.objects.filter(category=category)
        product_serializer = ProductSerializer(products, many=True)
        category_data['products'] = product_serializer.data
        return Response(category_data)


class BrandViewSet(viewsets.ViewSet):
    """Simple Viewset for viewing brands."""

    queryset = models.Brand.objects.all()

    @extend_schema(responses=BrandSerializer)
    def list(self, request):
        serializer = BrandSerializer(self.queryset, many=True)
        return Response(serializer.data)


class ProductViewSet(viewsets.ViewSet):
    """Simple Viewset for viewing all products."""

    queryset = models.Product.objects.all()

    @extend_schema(responses=ProductSerializer)
    def list(self, request):
        serializer = ProductSerializer(self.queryset, many=True, context={"request": request})
        return Response(serializer.data)

    @extend_schema(responses=ProductSerializer)
    def retrieve(self, request, pk=None):
        product = get_object_or_404(self.queryset, pk=pk)
        serializer = ProductSerializer(product, context={"request": request})
        return Response(serializer.data)
