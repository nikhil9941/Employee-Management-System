from rest_framework.permissions import BasePermission

class IsSelfOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or obj.user == request.user


# def has_object_permission(self, request, view, obj):
#         if request.user and request.user.is_staff:
#             return True
#         return obj.email == request.user.email

class IsSelf(BasePermission):
    """
    Custom permission:
    - Employees can only access their own attendance
    - Staff can access all
    """
    # def has_permission(self, request, view):
    #     # Staff can always access
    #     if request.user.is_staff:
    #         return True
    #     # Employees can create/retrieve/list their own records
    #     if view.action in ['create', 'retrieve', 'list']:
    #         return True
    #     return False

    # def has_object_permission(self, request, view, obj):
    #     # Staff can access all
    #     if request.user.is_staff:
    #         return True
    #     # Employees can access only their own record
    #     return obj.employee.user == request.user

    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return obj.employee.user == request.user