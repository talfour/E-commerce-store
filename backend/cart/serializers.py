from core.models import Order, OrderItem
from drf_spectacular.utils import extend_schema_field
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
    class Meta:
        model = OrderItem
        fields = ("id", "product", "price", "quantity")


class OrderSerializer(serializers.ModelSerializer):
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
        )

    def to_representation(self, instance):
        """User to representation instead of
        user = serializers.HiddenField(default=serializers.CurrentUserDefault())
        as view wouldn't allow AnonymousUser to create an order.
        """
        if "request" in self.context:
            self.fields["user"].context["request"] = self.context["request"]
        return super().to_representation(instance)
