from django.contrib import admin
from .models import Department, Employee , Attendance, LeaveRequest
# Register your models here.

# admin.site.register(Department)
# admin.site.register(Employee)
# admin.site.register(Attendance)
# admin.site.register(LeaveRequest)

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)
    ordering = ('name',)
 
@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'department', 'role', 'hire_date', 'is_active')
    list_filter = ('department', 'role', 'is_active')
    search_fields = ('first_name', 'last_name', 'email')
    ordering = ('last_name', 'first_name')
    fieldsets = (
        (None, {
            'fields': ('first_name', 'last_name', 'email', 'department', 'role', 'is_active')
        }),
        ('Dates', {
            'fields': ('hire_date',)
        }),
    )
    readonly_fields = ('hire_date',)

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('employee', 'date', 'check_in', 'check_out', 'status')
    list_filter = ('date', 'status')
    search_fields = ('employee__first_name', 'employee__last_name', 'employee__email')
    ordering = ('date',)
    date_hierarchy = 'date'
    
    
@admin.register(LeaveRequest)
class LeaveRequestAdmin(admin.ModelAdmin):  
    list_display = ('employee', 'start_date', 'end_date', 'status', 'approved_by')
    list_filter = ('status', 'start_date', 'end_date')
    search_fields = ('employee__first_name', 'employee__last_name', 'employee__email', 'approved_by')
    ordering = ('start_date',)
    date_hierarchy = 'start_date'
    readonly_fields = ('approved_by',)
    actions = ['approve_requests', 'reject_requests']   

