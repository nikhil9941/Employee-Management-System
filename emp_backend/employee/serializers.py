from rest_framework import serializers
from .models import Employee, Department, Attendance, LeaveRequest

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'description']

class EmployeeSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)
    department_id = serializers.PrimaryKeyField(queryset=Department.objects.all(), 
                                               source='department', write_only=True)

    class Meta:
        model = Employee
        fields = ['id', 'first_name', 'last_name', 'email', 'role', 'hire_date', 'is_activate',
                  'department', 'department_id']

class AttendanceSerializer(serializers.ModelSerializer):
    employee = EmployeeSerializer(read_only=True)
    employee_id = serializers.PrimaryKeyField(queryset=Employee.objects.all(), 
                                             source='employee', write_only=True)
    class Meta:
        model = Attendance
        fields = ['id', 'employee','employee_id', 'date', 'check_in', 'check_out', 'status']

class LeaveRequestSerializer(serializers.ModelSerializer):
    employee = EmployeeSerializer(read_only=True)
    employee_id = serializers.PrimaryKeyField(queryset=Employee.objects.all(), 
                                             source='employee', write_only=True)
    class Meta:
        model = LeaveRequest
        fields = ['id', 'employee', 'employee_id', 'start_date', 'end_date', 'reason',
                    'status', 'approved_by']
        read_only_fields = ['status', 'approved_by']