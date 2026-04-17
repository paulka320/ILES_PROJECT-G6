from django.urls import path
from .views import RegisterView,UserListView,MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
