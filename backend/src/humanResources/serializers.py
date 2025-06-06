from rest_framework import serializers
from .models import Employee, Department, Job, Salary


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'


class SalarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Salary
        fields = '__all__'

class EmployeeSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)
    job = JobSerializer(read_only=True)
    salaries = SalarySerializer(many=True, read_only=True)

    class Meta:
        model = Employee
        fields = '__all__'
