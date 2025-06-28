from rest_framework import viewsets, permissions
from .models import UserPermission
from .serializers import UserPermissionSerializer

class UserPermissionViewSet(viewsets.ModelViewSet):
    queryset = UserPermission.objects.select_related('user', 'permission', 'granted_by').all()
    serializer_class = UserPermissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(granted_by=self.request.user)