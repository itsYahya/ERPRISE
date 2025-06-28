# utils.py
from .mongo import user_logs_collection
from django.utils.timezone import now

def log_user_activity(user_id, action, ip_address=None, extra_data=None):
    log_entry = {
        "user_id": user_id,
        "action": action,
        "ip_address": ip_address,
        "extra_data": extra_data or {},
        "timestamp": now(),
    }
    user_logs_collection.insert_one(log_entry)