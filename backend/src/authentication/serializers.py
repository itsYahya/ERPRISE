from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        credentials = {
            'username': attrs.get('username'),
            'password': attrs.get('password')
        }

        user = User.objects.filter(
            Q(username__iexact=credentials['username']) |
            Q(email__iexact=credentials['username'])
        ).first()

        if user and user.check_password(credentials['password']):
            attrs['user'] = user
            data = super().validate(attrs)
            data['user'] = {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            }
            return data
        else:
            raise serializers.ValidationError("Invalid credentials")


class RegisterUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
        )
        user.set_password(validated_data['password'])  # Securely hash password
        user.save()
        return user