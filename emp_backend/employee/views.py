from django.shortcuts import render
from rest_framework import viewsets
from .models import Employee, Department, Attendance, LeaveRequest
from .serializers import EmployeeSerializer, DepartmentSerializer, AttendanceSerializer, LeaveRequestSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .permissions import IsSelfOrAdmin
class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    def get_permissions(self):
        if self.action in ['list', 'create', 'destroy']:
            permission_classes = [IsAdminUser]
        
        elif self.action in ['retrieve', 'partial_update','update']:
            permission_classes = [IsSelfOrAdmin]

        else:
            permission_classes = [IsAdminUser]
        
        return [permission() for permission in permission_classes]

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAdminUser]

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

class LeaveRequestViewSet(viewsets.ModelViewSet):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated]
