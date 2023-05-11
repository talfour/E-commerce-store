from rest_framework import viewsets
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework import status
from core.models import Product, Order, OrderItem
from rest_framework.views import APIView
from .serializers import CartSerializer, OrderSerializer
from .cart import Cart

class CartView(viewsets.ViewSet):
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

    @action(detail=False, methods=["get"])
    def get_cart_data(self, request):
        """Get the cart data"""
        cart = self.get_cart(request)
        cart_items = []
        for item in cart:
            product = Product.objects.get(id=item['product'].id)
            cart_items.append({
                    'id': item['product'].id,
                    'name': item['product'].name,
                    'price': str(item['product'].price),
                    'quantity': item['quantity'],
                    'brand': product.brand.name,
                    'total_price': str(item['total_price']),
                    'image_url': item['product'].get_image_url(request),
            })
        total_price = cart.get_total_price()
        return Response({'cart_items': cart_items, 'total_price': total_price})


@api_view(["POST"])
def order_create(request):
    cart = Cart(request)
    serializer = OrderSerializer(data=request.data)
    if serializer.is_valid():
        order = serializer.save()
        for item in cart:
            OrderItem.objects.create(order=order, product=item["product"], price=item["price"], quantity=item["quantity"])
        # Clear the shopping cart
        cart.clear()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OrderCreateView(viewsets.ModelViewSet):
    # queryset = Order.objects.none()
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    model = Order
    def post(self, request):
        return order_create(request)