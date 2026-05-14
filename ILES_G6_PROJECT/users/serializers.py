from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id','username','email','role']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    role = serializers.ChoiceField(choices=CustomUser.ROLE_CHOICES, default='student')

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'role']

    def validate_role(self, value):
        if value not in [choice[0] for choice in CustomUser.ROLE_CHOICES]:
            raise serializers.ValidationError("Invalid role for registration.")
        return value

    def create(self, validated_data):
        role = validated_data.pop('role', 'student')
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            role=role,
            password=validated_data['password']
        )
        return user

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['role'] = user.role
        token['username'] = user.username
        return token

    def validate(self, attrs):
        username = attrs.get(self.username_field)
        if username:
            user = None
            try:
                if '@' in username:
                    user = CustomUser.objects.get(email__iexact=username)
                else:
                    user = CustomUser.objects.get(username__iexact=username)
            except CustomUser.DoesNotExist:
                user = None

            if user is not None:
                attrs[self.username_field] = user.username

        data = super().validate(attrs)
        data["user"] = {
            "id": self.user.id,
            "role": self.user.role,
            "username": self.user.username,
        }
        return data