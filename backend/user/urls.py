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
]
