from core.models import Coupon
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .serializers import CouponSerializer


class CouponViewSet(viewsets.ViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    permission_classes = [
        AllowAny,
    ]

    @action(detail=False, methods=["post"], url_name="coupon_apply")
    def coupon_apply(self, request):
        now = timezone.now()
        code = request.data.get("code", None)
        if code is not None:
            try:
                coupon = Coupon.objects.get(
                    code__iexact=code,
                    valid_from__lte=now,
                    valid_to__gte=now,
                    active=True,
                )
                request.session["coupon_id"] = coupon.id
                return Response({"data": "Coupon is valid"}, status=status.HTTP_200_OK)
            except Coupon.DoesNotExist:
                request.session["coupon_id"] = None
                return Response(
                    {"error": "Coupon Does Not Exists"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        return Response(
            {"error": "Invalid coupon code"}, status=status.HTTP_400_BAD_REQUEST
        )
