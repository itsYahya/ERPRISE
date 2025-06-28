# urls.py
from django.urls import path
from .views import UserLogListView, LogTestActionView

urlpatterns = [
    path("", UserLogListView.as_view(), name="user-logs"),
    path("test/", LogTestActionView.as_view(), name="user-logs-test"),
]