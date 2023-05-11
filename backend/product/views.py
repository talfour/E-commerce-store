from rest_framework import viewsets
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from core import models
from .serializers import CategorySerializer, BrandSerializer, ProductSerializer


class CategoryViewSet(viewsets.ViewSet):
    """Simple Viewset for viewing categories."""

    queryset = models.Category.objects.all()

    @extend_schema(responses=CategorySerializer)
    def list(self, request):
        serializer = CategorySerializer(self.queryset, many=True)
        return Response(serializer.data)


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
