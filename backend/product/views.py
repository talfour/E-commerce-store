from core import models
from django.db.models import Q
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from product.pagination import CustomLimitOffsetPagination
from rest_framework import generics, status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from .recommender import Recommender
from .serializers import (
    BrandSerializer,
    CategoryAndChildSerializer,
    CategorySerializer,
    ProductSerializer,
    ReviewSerializer,
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


class ProductViewSet(viewsets.ViewSet, generics.ListAPIView):
    """
    Simple Viewset for viewing all products.
    """

    permission_classes = [AllowAny]
    pagination_class = CustomLimitOffsetPagination

    @extend_schema(responses=ProductSerializer)
    def list(self, request):
        search_query = request.query_params.get("search", None)
        queryset = models.Product.objects.prefetch_related("brand").all()

        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query) | Q(description__icontains=search_query)
            )

        page = self.paginate_queryset(queryset)
        serializer = ProductSerializer(page, many=True, context={"request": request})
        return self.get_paginated_response(serializer.data)

    @extend_schema(responses=ProductSerializer)
    def retrieve(self, request, pk=None):
        product = get_object_or_404(models.Product, pk=pk)
        serializer = ProductSerializer(product, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class RecommendedProductViewSet(viewsets.ViewSet):
    """
    View for getting recommended products.
    """

    permission_classes = [
        AllowAny,
    ]

    @extend_schema(responses=ProductSerializer)
    def retrieve(self, request, pk=None):
        product = get_object_or_404(models.Product, pk=pk)
        r = Recommender()
        serializer = ProductSerializer(
            r.suggest_products_for([product], 4),
            many=True,
            context={"request": request},
        )
        return Response(serializer.data, status=status.HTTP_200_OK)


class ReviewViewSet(viewsets.ViewSet):
    """
    View for creating product ratings.
    """

    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request):
        """Endpoint create new review for product."""
        user = request.user
        serializer = ReviewSerializer(data=request.data)

        if serializer.is_valid():
            product_id = serializer.validated_data.get("product_id")
            rating_value = serializer.validated_data.get("rating")
            comment = serializer.validated_data.get("comment")
            product = models.Product.objects.get(id=product_id)
            already_exists = (
                models.Product.objects.prefetch_related("review_set")
                .filter(review__user=user, id=product.id)
                .exists()
            )
            if already_exists:
                return Response(
                    {"detail": "Product already reviewed"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            is_product_in_paid_order = models.Order.objects.filter(
                items__product=product, paid=True
            ).exists()

            if not is_product_in_paid_order:
                return Response(
                    {"detail": "Order must be paid to leave a review."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if rating_value == 0:
                return Response(
                    {"detail": "Please select a rating."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Create Review
            models.Review.objects.create(
                user=user, product=product, rating=rating_value, comment=comment
            )
            reviews = product.review_set.all()
            product.num_reviews = len(reviews)
            total = 0
            for i in reviews:
                total += i.rating

            # Update rating
            product.rating = total / len(reviews)
            product.save()

            return Response(
                {"success": "Rating created successfully."},
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
