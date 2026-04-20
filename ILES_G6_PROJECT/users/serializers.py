from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id','username','email','role']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True,required=True)

    class Meta:
        model = CustomUser
        fields = ['username','email','password','role']

        def create(self,validated_data):
            user = CustomUser.objects.create_user(
                username=validated_data['username'],
                email = validated_data['email'],
                role = validated_data['role'],
                password = validated_data['password']
            )
            return user

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self,attrs):
        data = super().validate(attrs)
#add role to the response
        data['role'] = self.user.role
        data['username'] = self.user.username

        return data