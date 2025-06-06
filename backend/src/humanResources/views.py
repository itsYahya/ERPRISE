from rest_framework import viewsets
from .models import Employee, Job, Department, Salary
from .serializers import EmployeeSerializer, JobSerializer, DepartmentSerializer, SalarySerializer
from rest_framework.permissions import IsAuthenticated

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    #permission_classes = [IsAuthenticated] 

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    #permission_classes = [IsAuthenticated] 

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    #permission_classes = [IsAuthenticated] 

class SalaryViewSet(viewsets.ModelViewSet):
    queryset = Salary.objects.all()
    serializer_class = SalarySerializer
    #permission_classes = [IsAuthenticated]