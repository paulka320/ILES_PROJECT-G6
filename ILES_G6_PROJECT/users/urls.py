from django.urls import path
from .views import RegisterView,UserListView,MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/',RegisterView.as_view()),
    path('users/',UserListView.as_view()),
    path('login/',MyTokenObtainPairView.as_view()),
    path('refresh/',TokenRefreshView.as_view()),
]