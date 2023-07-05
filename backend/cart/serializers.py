from core.models import Order, OrderItem
from drf_spectacular.utils import extend_schema_field
from product.serializers import ProductSerializer
from rest_framework import serializers


class CartSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    quantity = serializers.IntegerField()
    total_price = serializers.SerializerMethodField()

    @extend_schema_field({"type": "integer", "format": "binary"})
    def get_total_price(self, obj):
        return obj.get_total_price()

    def to_representation(self, instance):
        """Convert the Cart object to a list of items"""
        items = [{key: str(value)} for key, value in instance.items()]
        return items


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = OrderItem
        fields = ("id", "product", "price", "quantity")


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, required=False)
    total_cost = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = (
            "id",
            "first_name",
            "last_name",
            "email",
            "address",
            "post_code",
            "city",
            "user",
            "created",
            "updated",
            "paid",
            "items",
            "total_cost",
        )

    def __init__(self, *args, **kwargs):
        request = kwargs.pop("request", None)
        super().__init__(*args, **kwargs)
        if request is not None:
            self.fields["user"].context["request"] = request

    def get_total_cost(self, obj):
        return obj.get_total_cost()
