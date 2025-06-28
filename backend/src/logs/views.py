# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils.timezone import now
from .mongo import user_logs_collection

class UserLogListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        logs_cursor = (
            user_logs_collection
            .find({"user_id": request.user.id})
            .sort("timestamp", -1)
            .limit(100)
        )
        logs = []
        for log in logs_cursor:
            log["_id"] = str(log["_id"])  # convert MongoDB ObjectId to string
            logs.append(log)
        return Response(logs)

class LogTestActionView(APIView):
    """Route pour tester un log d'action"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        from .utils import log_user_activity
        log_user_activity(
            user_id=request.user.id,
            action="Test Activity",
            ip_address=request.META.get("REMOTE_ADDR"),
            extra_data={"source": "manual log test"}
        )
        return Response({"detail": "Log enregistré."})