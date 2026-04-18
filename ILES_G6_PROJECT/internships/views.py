from django.shortcuts import render
# Create your views here
from rest_framework import viewsets
from rest_framework import generics
from .models import InternshipPlacement
from .serializers import InternshipPlacementSerializer
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsAdmin


