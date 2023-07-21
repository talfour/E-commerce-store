from core.models import Order, OrderItem, Product
from core.tasks import order_created
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .cart import Cart
from .serializers import CartSerializer, OrderSerializer


class CartView(viewsets.ViewSet):
    "View for shopping cart stored in session."
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
        total_price = cart.get_total_price_after_discount()
        discount = cart.get_discount()
        if cart.coupon:
            coupon = cart.coupon.code
        else:
            coupon = ''
        return Response({"cart_items": cart_items, "total_price": total_price, "discount": discount, "coupon": coupon})

    @action(detail=False, methods=["get"], url_name="get_cart_discount")
    def get_cart_discount(self, request):
        """Get the cart discount."""
        cart = self.get_cart(request)
        discount = cart.get_discount()
        return Response({"discount": discount})


class OrderView(viewsets.ModelViewSet):
    """View for creating, retrieving and listing an order in the system."""

    permission_classes = [
        AllowAny,
    ]

    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    model = Order

    def list(self, request):
        queryset = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(queryset, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        queryset = Order.objects.get(user=request.user, pk=pk)
        serializer = OrderSerializer(queryset, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        cart = Cart(request)
        # Get current user if user is not authenticated let user to create an
        # order anyway but User won't be able to track order in profile menu.
        user = request.user if request.user.is_authenticated else None
        serializer = OrderSerializer(
            data=request.data, context={"request": request, "user": user}
        )
        if serializer.is_valid():
            order = serializer.save(user=user)
            if cart.coupon:
                order.coupon = cart.coupon
                order.discount = cart.coupon.discount
                order.save()
            # Create order items
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
            request.session["coupon_id"] = None
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
