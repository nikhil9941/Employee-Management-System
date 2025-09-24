from rest_framework import serializers
from django.utils import timezone
from .models import Employee, Department, Attendance, LeaveRequest
from django.contrib.auth.models import User
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'description']

class EmployeeSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)
    department_id = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all(), 
                                               source='department', write_only=True, required=False)
    user_id = serializers.PrimaryKeyRelatedField(queryset = User.objects.all(),
                                                source = 'user', write_only = True, required =False)
    user = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = Employee
        fields = ['id', 'first_name', 'last_name', 'email', 'role', 'hire_date', 'is_active',
                  'department', 'department_id', 'user', 'user_id']
        read_only_fields = ['is_active', 'hire_date', 'role']

    def get_fields(self):
        fields = super().get_fields()
        request = self.context.get('request')
        if request and not request.user.is_staff:
            fields.pop('department_id', None)
            fields.pop('user_id', None)
        return fields

class AttendanceSerializer(serializers.ModelSerializer):
    employee = serializers.PrimaryKeyRelatedField(
        queryset=Employee.objects.all(),
        required=False
    )

    class Meta:
        model = Attendance
        fields = ['id', 'employee', 'date', 'status', 'check_in', 'check_out']
        read_only_fields = ['date', 'check_in']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and not request.user.is_staff:
            self.fields.pop('employee', None)


class LeaveRequestSerializer(serializers.ModelSerializer):
    employee = EmployeeSerializer(read_only=True)
    employee_id = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all(), 
                                             source='employee', write_only=True)
    class Meta:
        model = LeaveRequest
        fields = ['id', 'employee', 'employee_id', 'start_date', 'end_date', 'reason',
                    'status', 'approved_by']
        read_only_fields = ['status', 'approved_by']