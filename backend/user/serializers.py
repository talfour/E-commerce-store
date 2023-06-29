"""
Serializers for the user API View.
"""
from core.models import UserAddress
from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    """Serializer for the user object."""

    class Meta:
        model = get_user_model()
        fields = ["email", "password", "name"]
        extra_kwargs = {"password": {"write_only": True, "min_length": 8}}

    def create(self, validated_data):
        """Create and return a user with encrypted password."""
        user_obj = get_user_model().objects.create_user(**validated_data)
        return user_obj

    def update(self, instance, validated_data):
        """Update and return user."""
        password = validated_data.pop("password", None)
        user = super().update(instance, validated_data)
        if password:
            try:
                user.set_password(password)
                user.save()
            except Exception as e:
                raise Exception(e)

        return user


class UserAddressSerializer(serializers.ModelSerializer):
    """Serializer for user address."""

    class Meta:
        model = UserAddress
        fields = [
            "id",
            "first_name",
            "last_name",
            "address",
            "address2",
            "city",
            "post_code",
        ]


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login."""

    email = serializers.EmailField()
    password = serializers.CharField()

    def check_user(self, validated_data):
        email = validated_data.get("email")
        password = validated_data.get("password")
        if not email:
            raise serializers.ValidationError("Email is required to login.")
        if not password:
            raise serializers.ValidationError("Password is required to login.")
        user = authenticate(email=email, password=password)
        if not user:
            raise serializers.ValidationError("User not found.")
        return user
