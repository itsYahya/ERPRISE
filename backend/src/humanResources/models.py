from django.db import models

class Department(models.Model):
    name = models.CharField(max_length=100)

class Job(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.title


class Employee(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    hire_date = models.DateField()
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True)
    job = models.ForeignKey(Job, on_delete=models.SET_NULL, null=True)  # changed from job_title
    status = models.CharField(max_length=20, default='Active')  # Active, On Leave, Resigned
    manager = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Salary(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='salaries')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    effective_date = models.DateField()

    def __str__(self):
        return f"{self.employee} - {self.amount} on {self.effective_date}"
