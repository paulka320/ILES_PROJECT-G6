from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import WeeklyLog
from .serializers import WeeklyLogSerializer
from rest_framework.permissions import IsAuthenticated
from users. permissions import IsStudent, IsSupervisor

class WeeklyLogViewSet(viewsets.modelViewSet):
  queryset = WeeklyLog.objects.all()
  serializer_class = WeeklyLogSerializer
  permission_classes =[IsAuthenticated]

  def get_queryset(self):
    user = self.request.user

    if user.role == 'student':
      return WeeklyLog.objects.filter(student=user)

    return WeeklyLog.objects.all()

# submitting Log
@action(detail=True, method=['post'], permission_classes=[IsStudent])
def submit(self, request, pk=None):
  log = self.get_object()

if log.status !- 'draft':
  return Response({"error": "only draft logs can be submitted"}, status=400)
  
lo.status ='submitted'
log.save()

return Response({"message": "Log submitted"})

# Review Log
@action(detail=True, methods=['post'], permission_classes=[IsSupervisor])
def review(self, request, pk=None):
  log = self.get_object()
  
if log.status != 'submitted':
  return Response({"error": "only submitted logs can be reviewed"}, status=400)

log.status ='approved'
log.save()

return Response({"message": "Log approved"})
