from rest_framework import serializers
from core.models import OrderItem, Order

class CartSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    quantity = serializers.IntegerField()
    total_price = serializers.SerializerMethodField()

    def get_total_price(self, obj):
        return obj.get_total_price()

    def to_representation(self, instance):
        """Convert the Cart object to a list of items"""
        items = []
        for key, value in instance.items():
            item_data = {
                key: str(value)
            }
            items.append(item_data)
        return items
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ("id", "product", "price", "quantity")

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ("id", "first_name", "last_name", "email", "address", "postal_code", "city", "created", "updated", "paid", "items")