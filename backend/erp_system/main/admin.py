from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from rest_framework_simplejwt.token_blacklist.admin import OutstandingTokenAdmin
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken

from .models import *

from tasks.models import *

class UserAdminConfig(UserAdmin):
    model = User
    search_fields = ('login',)
    list_filter = ('login',)
    ordering = ('login',)
    list_display = ('login', 'is_manager')
    readonly_fields = ('created_at', 'otp_code', 'open_code')
    fieldsets = (
        (None, {'fields': ('email', 'avatar', 'login', 'phone', 'name', 'surname',
                           'patronymic', 'otp_code', 'open_code', 'created_at')}),
        ('Permissions', {'fields': ('is_active', 'is_manager','is_verified', 'is_banned')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'avatar', 'login', 'name', 'surname', 'patronymic', 'phone', 'password1',
                       'password2', 'is_active', 'is_manager')}
         ),
    )


class MyOutstandingTokenAdmin(OutstandingTokenAdmin):

    def has_delete_permission(self, *args, **kwargs):
        return True


admin.site.register(User, UserAdminConfig)
admin.site.register(Company)
admin.site.register(Profile)
admin.site.register(BankDetail)
admin.site.register(UserDocument)
admin.site.register(Country)
admin.site.register(CompanyUser)
admin.site.register(CompanyUserDocument)
admin.site.register(ManagerComment)
admin.site.register(MetaDataUserDocument)
admin.site.unregister(OutstandingToken)
admin.site.register(OutstandingToken, MyOutstandingTokenAdmin)

admin.site.register(Task)
admin.site.register(TaskDocument)
