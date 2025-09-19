from django.shortcuts import render
from rest_framework import viewsets
from .models import Employee, Department, Attendance, LeaveRequest
from .serializers import EmployeeSerializer, DepartmentSerializer, AttendanceSerializer, LeaveRequestSerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class AttendanceViewSet(viewsets.ModelViewSet)::
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    