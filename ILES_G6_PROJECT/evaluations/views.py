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
        return Evaluation.objects.all()

    def perform_create(self, serializer):
        serializer.save(evaluator=self.request.user)
