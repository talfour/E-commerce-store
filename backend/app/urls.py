from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework.routers import DefaultRouter

from product import views
from cart import views as c_views

router = DefaultRouter()
router.register(r"category", views.CategoryViewSet, basename="category")
router.register(r"brand", views.BrandViewSet, basename="brand")
router.register(r"product", views.ProductViewSet, basename='product')
router.register(r"cart", c_views.CartView, basename="cart")
router.register(r"order", c_views.OrderCreateView, basename="order")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/schema/docs", SpectacularSwaggerView.as_view(url_name="schema")),
    path("api/user/", include('user.urls'))
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
