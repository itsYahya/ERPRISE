from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.record_login),
    path('logout/', views.record_logout),
    path('', views.get_attendance),
]