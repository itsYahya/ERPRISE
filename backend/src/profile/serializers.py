from rest_framework import serializers
from django.contrib.auth.models import User
from rolesPermissions.models import Role
from .models import UserProfile
from rolesPermissions.serializers import RoleSerializer

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    role = RoleSerializer(read_only=True)
    role_id = serializers.PrimaryKeyRelatedField(queryset=Role.objects.all(), source='role', write_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'photo', 'role', 'role_id', 'created_at']