from django.shortcuts import render

from rest_framework import viewsets
from .models import Evaluation
from .serializers import EvaluationSerializer
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsAcademic

class EvaluationViewSet(viewsets.ModelViewSet):