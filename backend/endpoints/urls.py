from rest_framework.routers import DefaultRouter
from .views import ApiEndpointViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'', ApiEndpointViewSet, basename='endpoints')

urlpatterns = [
    path('', include(router.urls)),
]
