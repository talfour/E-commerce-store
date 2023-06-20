"""
Views for the user API.
"""
from django.contrib.auth import login, logout
from drf_spectacular.utils import extend_schema
from rest_framework import permissions, status
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import UserLoginSerializer, UserSerializer


class UserRegister(APIView):
    """View for registering new user in the system."""

    permission_classes = (permissions.AllowAny,)

    @extend_schema(
        request=UserSerializer,
        operation_id="Register User",
        responses={200: UserSerializer},
        tags=["User"],
    )
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.create(serializer.validated_data)
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
    """View for logging user"""

    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)

    @extend_schema(
        request=UserLoginSerializer,
        operation_id="Login User",
        responses={200: UserLoginSerializer},
        tags=["User"],
    )
    def post(self, request):
        data = request.data
        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.check_user(data)
            login(request, user)
            return Response(serializer.data, status=status.HTTP_200_OK)


class UserView(APIView):
    """View for showing user data."""

    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    @extend_schema(
        request=UserSerializer,
        operation_id="Shows User info.",
        responses={200: UserSerializer},
        tags=["User"],
    )
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


    @extend_schema(
        request=UserSerializer,
        operation_id="Update User info.",
        responses={200: UserSerializer},
        tags=["User"],
    )
    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class UserLogout(APIView):
    """View for logging user out from the system."""

    @extend_schema(
        request=None,
        operation_id="Logout User",
        responses={200: UserSerializer},
        tags=["User"],
    )
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)
