from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import weeklyLog
from .serializers import WeeklyLogSerializer
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsStudent, IsSupervisor



