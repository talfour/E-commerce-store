"""Custom pagination"""

from rest_framework.pagination import LimitOffsetPagination


class CustomLimitOffsetPagination(LimitOffsetPagination):
    page_size = 10
    max_page_size = 100
