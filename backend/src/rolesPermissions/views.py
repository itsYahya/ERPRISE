from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from .models import Role, Permission, RolePermission
from .serializers import RoleSerializer, PermissionSerializer, RolePermissionSerializer


class RoleViewSet(viewsets.ModelViewSet):
    """
    CRUD complet sur les rôles
    """
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['get'], url_path='permissions')
    def get_permissions(self, request, pk=None):
        """
        Endpoint personnalisé : /roles/{id}/permissions/
        Liste les permissions associées à ce rôle
        """
        role = self.get_object()
        permissions = Permission.objects.filter(permission_roles__role=role)
        serializer = PermissionSerializer(permissions, many=True)
        return Response(serializer.data)


class PermissionViewSet(viewsets.ModelViewSet):
    """
    CRUD complet sur les permissions
    """
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [IsAuthenticated]


class RolePermissionViewSet(viewsets.ModelViewSet):
    """
    CRUD sur la table personnalisée de liaison Rôle ↔ Permission
    """
    queryset = RolePermission.objects.all()
    serializer_class = RolePermissionSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        """
        Assigner une permission à un rôle (évite les doublons)
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        role = serializer.validated_data['role']
        permission = serializer.validated_data['permission']

        # Vérifie si l'association existe déjà
        if RolePermission.objects.filter(role=role, permission=permission).exists():
            return Response(
                {"detail": "Cette permission est déjà assignée à ce rôle."},
                status=status.HTTP_400_BAD_REQUEST
            )

        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        """
        Supprimer une permission assignée à un rôle
        """
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'], url_path='by-role/(?P<role_id>[^/.]+)')
    def get_by_role(self, request, role_id=None):
        """
        Endpoint personnalisé : /role-permissions/by-role/{role_id}/
        Affiche les permissions liées à un rôle
        """
        permissions = RolePermission.objects.filter(role_id=role_id)
        serializer = self.get_serializer(permissions, many=True)
        return Response(serializer.data)