from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmployeeViewSet, JobViewSet, DepartmentViewSet, SalaryViewSet

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet, basename='employee')
router.register(r'job', JobViewSet, basename='job')
router.register(r'department', DepartmentViewSet, basename='department')
router.register(r'salary', SalaryViewSet, basename='salary')

urlpatterns = [
    path('', include(router.urls)),
]