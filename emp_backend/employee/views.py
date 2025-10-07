from django.shortcuts import render
from django.utils import timezone
from rest_framework import viewsets
from .models import Employee, Department, Attendance, LeaveRequest
from .serializers import EmployeeSerializer, DepartmentSerializer, AttendanceSerializer, LeaveRequestSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from .permissions import IsSelfOrAdmin, IsSelf, IsOwnerorAdmin
from rest_framework import serializers
from rest_framework.exceptions import ValidationError



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
    permission_classes = [IsSelf]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Attendance.objects.all()
        return Attendance.objects.filter(employee__user=user)

    def perform_create(self, serializer):
        user = self.request.user
        today = timezone.now().date()
        current_time = timezone.now().time()

        if user.is_staff:
            # Staff can specify the employee in request data
            employee = serializer.validated_data.get('employee')
            if not employee:
                raise serializers.ValidationError("Staff must provide an employee to mark attendance.")
        else:
            # Normal employee → can mark only their own
            employee = user.employee

        # Avoid duplicate attendance for the same day
        if Attendance.objects.filter(employee=employee, date=today).exists():
            raise serializers.ValidationError(f"Attendance for {employee} is already marked today.")

        # Save attendance
        serializer.save(employee=employee, date=today,check_in=current_time)


class LeaveRequestViewSet(viewsets.ModelViewSet):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsOwnerorAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            # Staff can view all leave requests
            return LeaveRequest.objects.all()
        # Employees can view only their own leave requests
        return LeaveRequest.objects.filter(employee__user=user)

    def perform_create(self, serializer):
        user = self.request.user

        # Determine employee automatically
        if user.is_staff:
            # Staff can specify any employee, or default to their own if not given
            employee = serializer.validated_data.get("employee")
            if not employee:
                try:
                    employee = user.employee
                except Employee.DoesNotExist:
                    raise serializers.ValidationError(
                        "Staff must specify an employee or have an employee profile linked."
                    )
        else:
            # Normal employee → auto-link to their own profile
            try:
                employee = user.employee
            except Employee.DoesNotExist:
                raise serializers.ValidationError(
                    "Your user account is not linked to an employee profile."
                )

        start_date = serializer.validated_data.get("start_date")
        end_date = serializer.validated_data.get("end_date")

        # Prevent overlapping leave requests for same employee
        if LeaveRequest.objects.filter(
            employee=employee,
            start_date__lte=end_date,
            end_date__gte=start_date,
        ).exists():
            raise serializers.ValidationError({
                "non_field_errors": [
                    "You already have a leave request overlapping these dates."
                ]
            })

        # Save with correct employee
        serializer.save(employee=employee)
