from django.urls import path
from .views import RegisterView,MyTokenObtainPairView,AdminStatsView,AdminUserViewSet
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r"admin/users", AdminUserViewSet, basename='admin-users')
urlpatterns =router.urls + [
    path('register/',RegisterView.as_view()),
    path('login/',MyTokenObtainPairView.as_view()),
    path('refresh/',TokenRefreshView.as_view()),
]