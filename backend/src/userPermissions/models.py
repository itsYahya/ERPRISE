from django.db import models
from django.contrib.auth.models import User
from rolesPermissions.models import Permission  # Assure-toi que ce modèle existe

class UserPermission(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='custom_user_permissions'  # évite conflit avec auth.User.user_permissions
    )
    permission = models.ForeignKey(
        Permission,
        on_delete=models.CASCADE,
        related_name='user_permissions'  # accès inverse depuis Permission
    )
    granted_at = models.DateTimeField(auto_now_add=True)
    granted_by = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='granted_permissions'  # accès aux permissions qu’il a accordées
    )

    class Meta:
        unique_together = ('user', 'permission')
        verbose_name = "User Permission"
        verbose_name_plural = "User Permissions"

    def __str__(self):
        return f"{self.user.username} → {self.permission.codename}"