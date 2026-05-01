from django.shortcuts import render

# Create your views here.
from django.db.models import Avg
from rest_framework import generics
from .models import CustomUser
from .serializers import RegisterSerializer,UserSerializer
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAdmin
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer


class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated,IsAdmin]

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer


class AdminStatsView(APIView):
    permission_classes = [IsAuthenticated,IsAdmin]
    def get(self, request):
        total_students = CustomUser.objects.filter(role="student").count()

class UserListView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated,IsAdmin]

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer