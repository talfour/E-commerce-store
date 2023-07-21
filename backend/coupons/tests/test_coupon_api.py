from datetime import datetime, timedelta

from core.models import Coupon
from django.test import TestCase
from django.urls import reverse
from django.utils.timezone import make_aware
from rest_framework import status
from rest_framework.test import APIClient

from ..serializers import CouponSerializer


class CouponViewSetTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.coupon = Coupon.objects.create(
            code="ABC123",
            valid_from=make_aware(datetime.now() - timedelta(days=7)),
            valid_to=make_aware(datetime.now() + timedelta(days=7)),
            active=True,
            discount=0.10,
        )

    def test_coupon_apply_success(self):
        """Test that coupon is applied successfully."""
        url = reverse("coupons-coupon_apply")
        data = {"code": "ABC123"}

        response = self.client.post(url, data, format="json")
        session = self.client.session

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["data"], "Coupon is valid")
        self.assertEqual(session["coupon_id"], self.coupon.id)

    def test_coupon_apply_invalid_code(self):
        """Test that coupon is not applied as it does not exists."""
        url = reverse("coupons-coupon_apply")
        data = {"code": "invalid_code"}

        response = self.client.post(url, data)
        session = self.client.session

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Coupon Does Not Exists")
        self.assertIsNone(session.get("coupon_id"))

    def test_coupon_apply_expired_coupon(self):
        """Test that coupon is not applied as it is expired."""
        self.coupon.valid_to = make_aware(datetime.now() - timedelta(days=7))
        self.coupon.save()
        url = reverse("coupons-coupon_apply")
        data = {"code": "ABC123"}

        response = self.client.post(url, data)
        session = self.client.session

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Coupon Does Not Exists")
        self.assertIsNone(session.get("coupon_id"))

    def test_coupon_apply_inactive_coupon(self):
        """Test that coupon is not applied as it is inactive."""
        self.coupon.active = False
        self.coupon.save()
        url = reverse("coupons-coupon_apply")
        data = {"code": "ABC123"}

        response = self.client.post(url, data)
        session = self.client.session

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Coupon Does Not Exists")
        self.assertIsNone(session.get("coupon_id"))

    def test_serialize_coupon(self):
        """Test that coupon is serialized correctly."""
        serializer = CouponSerializer(instance=self.coupon)
        self.assertEqual(serializer.data["code"], "ABC123")
