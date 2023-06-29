"""
URL mappings for the user API.
"""
from django.urls import path
from user import views

app_name = "user"

urlpatterns = [
    path("register/", views.UserRegister.as_view(), name="register"),
    path("login/", views.UserLogin.as_view(), name="login"),
    path("logout/", views.UserLogout.as_view(), name="logout"),
    path("me/", views.UserView.as_view(), name="me"),
    path(
        "address/",
        views.UserAddressViewSet.as_view({"get": "list", "post": "create"}),
        name="address",
    ),
    path(
        "address/<int:pk>/",
        views.UserAddressViewSet.as_view(
            {"get": "retrieve", "patch": "partial_update"}
        ),
        name="address-detail",
    ),
]
