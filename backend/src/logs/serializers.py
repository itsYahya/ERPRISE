from rest_framework import serializers

class UserLogSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    action = serializers.CharField()
    ip_address = serializers.CharField(allow_null=True)
    extra_data = serializers.DictField()
    timestamp = serializers.DateTimeField()