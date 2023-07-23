from cart import views as c_views
from coupons import views as coupon_views
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from product import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"categories", views.CategoryViewSet, basename="categories")
router.register(
    r"category-children", views.CategoryChildrenView, basename="category-children"
)
router.register(r"brands", views.BrandViewSet, basename="brands")
router.register(r"products", views.ProductViewSet, basename="products")
router.register(r"cart", c_views.CartView, basename="cart")
router.register(r"orders", c_views.OrderView, basename="order")
router.register(r"product_reviews", views.ReviewViewSet, basename="reviews")
router.register(r'recommended-products', views.RecommendedProductViewSet, basename='recommended-products')
router.register(r"coupons", coupon_views.CouponViewSet, basename="coupons")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/schema/docs", SpectacularSwaggerView.as_view(url_name="schema")),
    path("api/user/", include("user.urls")),
    path(
        "api/user/password_reset/",
        include("django_rest_passwordreset.urls", namespace="password_reset"),
    ),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
