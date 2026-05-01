from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import WeeklyLog
from .serializers import WeeklyLogSerializer
from rest_framework.permissions import IsAuthenticated
from users. permissions import IsStudent, IsSupervisor

class WeeklyLogViewSet(viewsets.ModelViewSet):
  queryset = WeeklyLog.objects.all()
  serializer_class = WeeklyLogSerializer
  permission_classes =[IsAuthenticated]

  def get_queryset(self):

    user = self.request.user

    if user.role == "student":
      return WeeklyLog.objects.filter(student=user).order_by("-week_number")
    
    elif user.role == "supervisor":
      return WeeklyLog.objects.filter(status="submitted").order_by("-week_number")
# submitting Log
@action(detail=True, method=['post'], permission_classes=[IsStudent])
def submit(self, request, pk=None):
  log = self.get_object()

  if log.status != 'draft':
    return Response({"error": "only draft logs can be submitted"}, status=400)

  log.status = 'submitted'
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



class SupervisorPendingLogsView(ListAPIView):
  serializer_class = WeeklyLogSerializer
  permission_classes = [IsAuthenticated]


  def get_queryset(self):

    if self.request.user.role == "supervisor":
      return WeeklyLog.objects.filter(
        status ="submitted"
      ).order_by("-week_number")
    return WeeklyLog.objects.none()






class AcademicStudentLogsView(ListAPIView):
  serializer_class = WeeklyLogSerializer
  permission_classes = [IsAuthenticated]

  def get_queryset(self):

    user = self.request.user
    student_id = self.kwargs["student_id"]

    if user.role == "academic":
      assigned_students = (
        InternshipPlacement.objects.filter(academic_supervisor=user).values_list("student_id",flat=True)

      )
      if student_id in assigned_students:
        return WeeklyLog.objects.filter(
          student_id = student_id
        ).order_by("-week_number")
      
    return WeeklyLog.objects.none()










class AdminLogsView(ListAPIView):
  serializer_class = WeeklyLogSerializer
  permission_classes = [IsAuthenticated]

  def get_queryset(self):
    if self.request.user.role == "admin":
      return WeeklyLog.objects.all().order_by("-week_number")
    return WeeklyLog.objects.none()
