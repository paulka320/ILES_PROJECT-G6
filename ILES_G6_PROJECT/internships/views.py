from django.shortcuts import render
# Create your views here
from rest_framework import viewsets
from rest_framework import generics
from .models import InternshipPlacement
from .serializers import InternshipPlacementSerializer
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsAdmin
from rest_framework.generics import ListAPIView



from rest_framework.permissions import BasePermission, SAFE_METHODS

# Custom permission: students can view, only admins can modify
class IsAdminOrReadOnlyForStudent(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated and getattr(request.user, 'role', None) == 'admin'

class InternshipPlacementViewSet(viewsets.ModelViewSet):
    queryset = InternshipPlacement.objects.all()
    serializer_class = InternshipPlacementSerializer
    permission_classes = [IsAdminOrReadOnlyForStudent]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'role', None) == "student":
            return InternshipPlacement.objects.filter(student=user)
        elif getattr(user, 'role', None) == "supervisor":
            return InternshipPlacement.objects.filter(supervisor_name=user)
        elif getattr(user, 'role', None) == "academic":
            return InternshipPlacement.objects.filter(academic_supervisor=user)
        elif getattr(user, 'role', None) == "admin":
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
        try:
            student_id = request.data.get("student_id")
            company_name = request.data.get("company_name")
            start_date = request.data.get("start_date")
            end_date = request.data.get("end_date")
            academic_id = request.data.get("academic_id")
            supervisor_id = request.data.get("supervisor_id")

            student = CustomUser.objects.get(id=student_id, role="student")

            academic=None
            if academic_id:
                academic = CustomUser.objects.get(id=academic_id, role="academic")

            supervisor = None
            if supervisor_id:
                supervisor = CustomUser.objects.get(id=supervisor_id, role="supervisor")

            placement = InternshipPlacement.objects.create(
                student = student,
                company_name=company_name,
                start_date=start_date,
                end_date=end_date,
                academic_supervisor=academic,
                supervisor_name=supervisor
            )
            serializer = InternshipPlacementSerializer(placement)
            return Response(serializer.data, status=201)
        
        except CustomUser.DoesNotExist as e:
            return Response({"error":"User not found"},status=400)
        except Exception as e:
            return Response({"error":str(e)},status=400)