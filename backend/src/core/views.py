from django.shortcuts import render

from rest_framework import viewsets
from .models import Item
from .serializers import ItemSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

@extend_schema(
    tags=["Core"],
    auth=[{'BearerAuth': []}],
    responses={200: {"type": "object", "properties": {"message": {"type": "string"}}}}
)
class ProtectedCoreView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": f"Welcome to the core app, {request.user.username}!\n"})
