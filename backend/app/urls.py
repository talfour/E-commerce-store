from cart import views as c_views
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from product import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"category", views.CategoryViewSet, basename="category")
router.register(r"brand", views.BrandViewSet, basename="brand")
router.register(r"product", views.ProductViewSet, basename='product')
router.register(r"cart", c_views.CartView, basename="cart")
router.register(r"order", c_views.OrderView, basename="order")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/schema/docs", SpectacularSwaggerView.as_view(url_name="schema")),
    path("api/user/", include('user.urls')),
    path('api/user/password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
