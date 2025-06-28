from django.db import models
from django.contrib.auth.models import User
from rolesPermissions.models import Role, Permission

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True, related_name="users")
    photo = models.ImageField(
        upload_to='user_photos/',
        null=True,
        blank=True,
        default='user_photos/default.png'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username

    def get_role_permissions(self):
        return Permission.objects.filter(roles__role=self.role) if self.role else Permission.objects.none()

    def get_direct_permissions(self):
        from userPermissions.models import UserPermission
        return Permission.objects.filter(user_permissions__user=self.user)

    def get_all_permissions(self):
        return self.get_role_permissions().union(self.get_direct_permissions())
