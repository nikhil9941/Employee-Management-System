from rest_framework.permissions import BasePermission

class IsSelfOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or obj.user == request.user


# def has_object_permission(self, request, view, obj):
#         if request.user and request.user.is_staff:
#             return True
#         return obj.email == request.user.email