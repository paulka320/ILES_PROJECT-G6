from django.shortcuts import render

from rest_framework import viewsets
from .models import Evaluation
from .serializers import EvaluationSerializer
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsAcademic

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
        
    })
