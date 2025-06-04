from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet
from .views import ProtectedCoreView

router = DefaultRouter()

urlpatterns = [
    path('me/', ProtectedCoreView.as_view(), name='protected-core-view'),
]
