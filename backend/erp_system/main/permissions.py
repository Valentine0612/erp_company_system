from rest_framework.permissions import BasePermission


class IsManager(BasePermission):
    """
    Allow access for User with flag is_manager = True to their Company
    and update employees info 
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_manager)


class IsBanned(BasePermission):
    """
    Allow assecc for User with flag is_banned = False
    """

    def has_permission(self, request, view):
        return bool(request.user and not request.user.is_banned)


class IsEmployee(BasePermission):
    """
    Allow change state of profile only for employee 
    """

    def has_permission(self, request, view):
        try:
            profile = request.user.profile
        except:
            profile = None
        return bool(request.user and profile)


class IsVerified(BasePermission):
    """
    Allow access for User with flag is_verified = True
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_verified)
