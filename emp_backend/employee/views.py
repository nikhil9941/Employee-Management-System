from django.shortcuts import render
from rest_framework import viewsets
from .models import Employee, Department, Attendance, LeaveRequest
from .serializers import EmployeeSerializer, DepartmentSerializer, AttendanceSerializer, LeaveRequestSerializer
