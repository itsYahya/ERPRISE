from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserPermissionViewSet

router = DefaultRouter()
router.register(r'user-permissions', UserPermissionViewSet, basename='userpermission')

urlpatterns = [
    path('', include(router.urls)),
]