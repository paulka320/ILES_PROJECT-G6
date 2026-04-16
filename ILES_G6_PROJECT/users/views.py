from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import CustomUser
from .serializers import RegisterSerializer,UserSerializer
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAdmin


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer


class UserListView(generics.ListAPIView):
