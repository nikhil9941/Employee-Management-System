from django.db import models
from django.conf import settings 
class Department(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description =models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name 

class Employee(models.Model):
    ROLES_CHOICES = [('Admin','Admin'), ('Manager','Manager'), ('Staff','Staff')]
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    department = models.ForeignKey('Department', on_delete=models.CASCADE)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=30,choices=ROLES_CHOICES, default='Staff')
    hire_date = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.first_name}, {self.last_name}- {self.role}"

    class Meta:
        ordering = ['last_name', 'first_name']
        verbose_name = 'Employee'
        verbose_name_plural = 'Employees'
        indexes = [
            models.Index(fields=['last_name', 'first_name']),
            models.Index(fields=['email',]),
        ]

class Attendance(models.Model):
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
    ]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    check_in = models.TimeField(blank=True, null=True)
    check_out = models.TimeField(blank=True, null=True)
    class Meta:
        # Ensure one attendance record per employee per day
        unique_together = ('employee', 'date')
        ordering = ['-date']

    def __str__(self):
        return f"{self.employee} - {self.date} - {self.status}"

class LeaveRequest(models.Model):
    STATUS_CHOICES = [('Pending','Pending'),('Approved','Approved'),('Rejected','Rejected')]
    employee = models.ForeignKey('Employee',on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default='Pending')
    approved_by= models.CharField(max_length=20, blank= True, null=True)

    class Meta:
        ordering=['start_date',]
        indexes=[models.Index(fields=['start_date','end_date','status'])]
    
    def __str__(self):
        return f"{self.employee}: {self.status}"

