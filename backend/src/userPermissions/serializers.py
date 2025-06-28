from rest_framework import serializers
from django.contrib.auth.models import User
from rolesPermissions.models import Permission
from .models import UserPermission

class UserPermissionSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    permission = serializers.PrimaryKeyRelatedField(queryset=Permission.objects.all())
    granted_by = serializers.ReadOnlyField(source='granted_by.username')

    class Meta:
        model = UserPermission
        fields = ['id', 'user', 'permission', 'granted_at', 'granted_by']
        read_only_fields = ['id', 'granted_at', 'granted_by']