from django.shortcuts import render
# Create your views here
from rest_framework import viewsets
from rest_framework import generics
from .models import InternshipPlacement
from .serializers import InternshipPlacementSerializer
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsAdmin

class InternshipPlacementViewSet(viewsets.ModelViewSet):
    queryset = InternshipPlacement.objects.all()
    serializer_class = InternshipPlacementSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        user = self.request.user

        if user.role =="student":
            return InternshipPlacement.objects.filter(student=user)
        
        elif user.role =="supervisor":
            return InternshipPlacement.objects.filter(supervisor_name = user)
        elif user.role =="academic":
            return InternshipPlacement.objects.filter(academic_supervisor = user)
        return InternshipPlacement.objects.none()

class SupervisorStudentsView(generics.ListAPIView):
    serializer_class = InternshipPlacementSerializer
    permission_classes =[IsAuthenticated]

    def get_queryset(self):
        return InternshipPlacement.objects.filter(
            supervisor = self.request.user
        )