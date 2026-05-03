from django.shortcuts import render
# Create your views here
from rest_framework import viewsets
from rest_framework import generics
from .models import InternshipPlacement
from .serializers import InternshipPlacementSerializer
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsAdmin
from rest_framework.generics import ListAPIView


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
        elif user.role =="admin":
            return InternshipPlacement.objects.all()
        
        return InternshipPlacement.objects.none()

class SupervisorStudentsView(ListAPIView):
    serializer_class = InternshipPlacementSerializer
    permission_classes =[IsAuthenticated]

    def get_queryset(self):
        return InternshipPlacement.objects.filter(
            supervisor_name = self.request.user
        )


class AcademicStudentsView(ListAPIView):
    serializer_class = InternshipPlacementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return InternshipPlacement.objects.filter(academic_supervisor = self.request.user)


from users.permissions import IsAdmin
from rest_framework.decorators import action
from rest_framework.response import Response
from users.models import CustomUser
class AdminPlacementViewSet(viewsets.ModelViewSet):
    queryset = InternshipPlacement.objects.all()
    serializer_class = InternshipPlacementSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


    @action(detail=True, methods=["post"])
    def assign_supervisor(self, request, pk=None):

        placement = self.get_object()
        supervisor_id = request.data.get("supervisor_id")

        try:
            supervisor = CustomUser.objects.get(
                id=supervisor_id,
                role="supervisor"
            )
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "Supervisor not found"},
                status=400
            )
        placement.supervisor_name = supervisor
        placement.save()
        return Response ({
            "message":"Supervisor assigned successfully"
        })
    
    @action(detail=True, methods=["post"])
    def assign_academic_supervisor(self,request, pk=None):
        placement = self.get_object()
        academic_id = request.data.get("academic_id")

        try:
            academic = CustomUser.objects.get(
                id=academic_id,
                role ="academic"
            )
        except CustomUser.DoesNotExist:
            return Response (
                {"error":"Academic supervisor not found"},
                status=400
            )
        placement.academic_supervisor = academic
        placement.save()

        return Response ({
            "message":"Academic Supervisor assigned successfully"
        })
    
    @action(detail=False, methods=["post"])
    def create_placement(self,request):
        """Create a new internship placement for a student"""