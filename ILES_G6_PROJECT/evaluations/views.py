from django.shortcuts import render
from django.db.models import Avg
from rest_framework import viewsets
from .models import Evaluation
from .serializers import EvaluationSerializer
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsAcademic
from rest_framework.decorators import api_view, permission_classes
from internships.models import InternshipPlacement
from rest_framework.response import Response
from rest_framework.generics import ListAPIView


class EvaluationViewSet(viewsets.ModelViewSet):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer
    permission_classes = [IsAuthenticated, IsAcademic]

    def get_queryset(self):
        user = self.request.user
        if user.role =='student':
            return Evaluation.objects.filter(student=user)
        
        if user.role=='supervisor':
            return Evaluation.objects.filter(evaluator=user)
        
        if user.role =='academic':
            return Evaluation.objects.filter(evaluator=user)
        
        return Evaluation.objects.all()

    def perform_create(self, serializer):
        serializer.save(evaluator=self.request.user)
from users.permissions import IsAdmin

class AdminEvaluationsView(viewsets.ModelViewSet):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer
    permission_classes = [IsAuthenticated,IsAdmin]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def academic_stats(request, id=None):
    students = InternshipPlacement.objects.filter(academic_supervisor=request.user)
    total_students =students.count()
    evaluations = Evaluation.objects.filter(evaluator=request.user)
    total_evaluations = evaluations.count()
    avg_score = evaluations.aggregate(Avg('total_score'))['total_score__avg'] or 0

    return Response ({
        "totalStudents":total_students,
        "totalEvaluations":total_evaluations,
        "avgScore":round(avg_score, 2)

    })


class AdminEvaluationsView(ListAPIView):
    serializer_class = EvaluationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        if self.request.user.role =="admin":
            return Evaluation.objects.all()
        return Evaluation.objects.none()


from rest_framework.generics import ListAPIView

class AcademicEvaluationsView(ListAPIView):
    serializer_class = EvaluationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Evaluation.objects.filter(evaluator = self.request.user)