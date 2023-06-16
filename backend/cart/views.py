from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from core.models import Product, Order, OrderItem
from .serializers import CartSerializer, OrderSerializer
from .cart import Cart
from core.tasks import order_created


class CartView(viewsets.ViewSet):
    permission_classes = [
        AllowAny,
    ]
    queryset = Product.objects.none()
    serializer_class = CartSerializer

    def get_cart(self, request):
        """Get the cart from the session"""
        return Cart(request)

    def list(self, request):
        """Get the cart data"""
        cart = self.get_cart(request)
        serializer = CartSerializer(cart, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def add(self, request, pk=None):
        """Add a product to the cart"""
        quantity = request.data.get("quantity", 1)
        update_quantity = request.data.get("update_quantity", False)

        try:
            product = Product.objects.get(id=pk)
        except Product.DoesNotExist:
            return Response(
                {"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND
            )

        cart = self.get_cart(request)
        cart.add(product, quantity, update_quantity)

        return Response({"success": f"{product} added to cart"})

    @action(detail=True, methods=["delete"])
    def remove(self, request, pk=None):
        """Remove a product from the cart"""
        try:
            product = Product.objects.get(id=pk)
        except Product.DoesNotExist:
            return Response(
                {"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND
            )

        cart = self.get_cart(request)
        cart.remove(product)

        return Response({"success": "Product removed from cart"})

    @action(detail=False, methods=["get"], url_name="get_cart_data")
    def get_cart_data(self, request):
        """Get the cart data"""
        cart = self.get_cart(request)
        cart_items = []
        for item in cart:
            product = Product.objects.get(id=item["product"].id)
            cart_items.append(
                {
                    "id": item["product"].id,
                    "name": item["product"].name,
                    "price": str(item["product"].price),
                    "quantity": item["quantity"],
                    "brand": product.brand.name,
                    "total_price": str(item["total_price"]),
                    "image_url": item["product"].get_image_url(request),
                }
            )
        total_price = cart.get_total_price()
        return Response({"cart_items": cart_items, "total_price": total_price})


class OrderCreateView(viewsets.ModelViewSet):
    # queryset = Order.objects.none()
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    model = Order

    def create(self, request):
        cart = Cart(request)
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            order = serializer.save()
            for item in cart:
                OrderItem.objects.create(
                    order=order,
                    product=item["product"],
                    price=item["price"],
                    quantity=item["quantity"],
                )
            # Clear the shopping cart
            cart.clear()
            order_created.apply_async(
                countdown=30,
                args=(order.id,),
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
