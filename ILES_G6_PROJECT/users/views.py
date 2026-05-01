from django.shortcuts import render

# Create your views here.
from django.db.models import Avg
from rest_framework import generics,viewsets
from .models import CustomUser
from .serializers import RegisterSerializer,UserSerializer
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAdmin
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer
from internships.models import InternshipPlacement
from logs.models import WeeklyLog
from rest_framework.views import APIView


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
        total_supervisors = CustomUser.objects.filter(role="supervisor").count()
        total_academics = CustomUser.objects.filter(role="academic").count()
        toatl_placements = InternshipPlacement.objects.count()
        total_logs = WeeklyLog.objects.count()
        total_evaluations = Evaluation.objects.count()
        avg_score = Evaluation.object.aggregate(Avg("total_score"))["total_score__avg"] or 0

        return Response({
            "totalStudents":total_students,
            "totalSupervisors":total_supervisors,
            "totalAcademics":total_academics,
            "totalPlacements":total_placements,
            "totalLogs":total_logs,
            "totalEvaluations":total_evaluations,
            "avgScore":round(avg_score,2),
        })



class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer