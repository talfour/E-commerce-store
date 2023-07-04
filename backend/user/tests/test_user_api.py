"""
Tests for the user API.
"""
from core import models
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from user.serializers import UserAddressSerializer

CREATE_USER_URL = reverse("user:register")
LOGIN_USER_URL = reverse("user:login")
ME_URL = reverse("user:me")
ADDRESS_URL = reverse("user:address")


def create_user(**params):
    """Create and return a new user."""
    return get_user_model().objects.create_user(**params)


def address_detail_url(address_id):
    """Create and return a address detail url."""
    return reverse("user:address-detail", args=[address_id])


class PublicUserApiTests(TestCase):
    """Test the public features of the user API."""

    def setUp(self):
        self.client = APIClient()

    def test_create_user_success(self):
        """Test creating a user is successful."""
        payload = {
            "email": "test@example.com",
            "password": "testpass123",
        }
        res = self.client.post(CREATE_USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        user = get_user_model().objects.get(email=payload["email"])
        self.assertTrue(user.check_password(payload["password"]))
        self.assertNotIn("password", res.data)

    def test_user_with_email_exists_error(self):
        """Test error is returned if user with email exists."""
        payload = {
            "email": "test@example.com",
            "password": "testpass123",
        }
        create_user(**payload)
        res = self.client.post(CREATE_USER_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_password_too_short_error(self):
        """Test an error is returned if password is less than 8 chars."""
        payload = {
            "email": "test@example.com",
            "password": "pass123",
        }
        res = self.client.post(CREATE_USER_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        user_exists = get_user_model().objects.filter(email=payload["email"]).exists()
        self.assertFalse(user_exists)

    def test_login_success(self):
        """Test login user is successful."""
        user_details = {
            "email": "test@example.com",
            "password": "testpass123",
        }
        create_user(**user_details)
        payload = {"email": user_details["email"], "password": user_details["password"]}
        response = self.client.post(
            LOGIN_USER_URL,
            payload,
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue("_auth_user_id" in self.client.session)

    def test_user_access_address_raise_403_error(self):
        """Test unauthenticated user try to access address url."""
        response = self.client.get(ADDRESS_URL)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class PrivateUserApiTests(TestCase):
    """Test the private features of the user API."""

    def setUp(self):
        self.user = create_user(
            email="test@example.com", password="testpass123"
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_logout_user(self):
        """Test for logging user out from the system."""

        url = reverse("user:logout")
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse("_auth_user_id" in self.client.session)

    def test_get_user_info(self):
        """Test for getting user information."""
        response = self.client.get(ME_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data, {"email": self.user.email}
        )

    def test_update_user_profile(self):
        """Test updating the user profile for the authenticated user."""
        payload = {"password": "newpassword123"}

        res = self.client.patch(ME_URL, payload)

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password(payload["password"]))
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_post_me_not_allowed(self):
        """Test POST is not allowed for the me endpoint."""
        res = self.client.post(ME_URL, {})

        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_user_create_new_shipping_address(self):
        """Test create user new shipping address."""
        payload = {
            "user": self.user,
            "first_name": "Test Name",
            "last_name": "Test Last Name",
            "address": "123 Norris",
            "city": "City",
            "post_code": "XX-XXX",
        }

        res = self.client.post(ADDRESS_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_retrieve_addresses(self):
        """Test retrieving a list of addresses."""
        models.UserAddress.objects.create(
            user=self.user,
            first_name="test name",
            last_name="last name",
            address="123 Street",
            city="City",
            post_code="XX-XXX",
        )
        models.UserAddress.objects.create(
            user=self.user,
            first_name="second name",
            last_name="another name",
            address="123 Street",
            city="Town",
            post_code="YY-YYY",
        )

        res = self.client.get(ADDRESS_URL)

        addresses = models.UserAddress.objects.all()
        serializer = UserAddressSerializer(addresses, many=True)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_address_limited_to_user(self):
        """Test list of addresses is limited to authenticated user."""
        user2 = create_user(email="user2@example.com")
        models.UserAddress.objects.create(
            user=user2,
            first_name="test name",
            last_name="last name",
            address="123 Street",
            city="City",
            post_code="XX-XXX",
        )
        address = models.UserAddress.objects.create(
            user=self.user,
            first_name="second name",
            last_name="another name",
            address="123 Street",
            city="Town",
            post_code="YY-YYY",
        )

        res = self.client.get(ADDRESS_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]["first_name"], address.first_name)
        self.assertEqual(res.data[0]["id"], address.id)

    def test_update_address(self):
        """Test updating an address."""
        address = models.UserAddress.objects.create(
            user=self.user,
            first_name="second name",
            last_name="another name",
            address="123 Street",
            city="Town",
            post_code="YY-YYY",
        )

        payload = {"first_name": "updated name", "post_code": "ZZ-ZZZ"}
        url = address_detail_url(address.id)
        res = self.client.patch(url, payload)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        address.refresh_from_db()
        self.assertEqual(address.first_name, payload["first_name"])
        self.assertEqual(address.post_code, payload["post_code"])
