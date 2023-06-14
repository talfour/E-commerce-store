"""
Tests for the user API.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework.test import APIClient
from rest_framework import status

CREATE_USER_URL = reverse("user:register")
LOGIN_USER_URL = reverse("user:login")
ME_URL = reverse("user:me")


def create_user(**params):
    """Create and return a new user."""
    return get_user_model().objects.create_user(**params)


class PublicUserApiTests(TestCase):
    """Test the public features of the user API."""

    def setUp(self):
        self.client = APIClient()

    def test_create_user_success(self):
        """Test creating a user is successful."""
        payload = {
            "email": "test@example.com",
            "password": "testpass123",
            "name": "Test Name",
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
            "name": "Test User",
        }
        create_user(**payload)
        res = self.client.post(CREATE_USER_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_password_too_short_error(self):
        """Test an error is returned if password is less than 8 chars."""
        payload = {
            "email": "test@example.com",
            "password": "pass123",
            "name": "Test name",
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
            "name": "Test name",
        }
        create_user(**user_details)
        payload = {"email": user_details["email"], "password": user_details["password"]}
        response = self.client.post(
            LOGIN_USER_URL,
            payload,
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue("_auth_user_id" in self.client.session)


class PrivateUserApiTests(TestCase):
    """Test the private features of the user API."""

    def setUp(self):
        self.user = create_user(
            email="test@example.com", password="testpass123", name="Test name"
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
        self.assertEqual(response.data["user"]["name"], self.user.name)
        self.assertEqual(response.data["user"]["email"], self.user.email)

    def test_update_user_profile(self):
        """Test updating the user profile for the authenticated user."""
        payload = {"name": "Updated new name.", "password": "newpassword123"}

        res = self.client.patch(ME_URL, payload)

        self.user.refresh_from_db()
        self.assertEqual(self.user.name, payload["name"])
        self.assertTrue(self.user.check_password(payload["password"]))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
