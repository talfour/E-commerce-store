"""
Serializers for the user API View.
"""
from django.contrib.auth import get_user_model, authenticate

from rest_framework import serializers


class UserRegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""

    class Meta:
        model = get_user_model()
        fields = ['email', 'password', 'name']
        extra_kwargs = {'password': {'write_only': True, 'min_length': 8}}

    def create(self, validated_data):
        """Create and return a user with encrypted password."""
        return get_user_model().objects.create_user(**validated_data)


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    email = serializers.EmailField()
    password = serializers.CharField()

    def check_user(self, validated_data):
        user = authenticate(email=validated_data['email'], password=validated_data['password'])

        if not user:
            raise serializers.ValidationError('User not found.')
        return user


class UserSerializer(serializers.ModelSerializer):
    """Serializer for the user object."""
    class Meta:
        model = get_user_model()
        fields = ['email', 'name']
