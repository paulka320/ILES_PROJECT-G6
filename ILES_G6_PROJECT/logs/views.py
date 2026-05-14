from django.shortcuts import render
from rest_framework.generics import ListAPIView
# Create your views here.
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import WeeklyLog
from .serializers import WeeklyLogSerializer
from rest_framework.permissions import IsAuthenticated
from users. permissions import IsStudent, IsSupervisor
from internships.models import InternshipPlacement





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
    
    elif user.role == "academic":
      return WeeklyLog.objects.all().order_by("-week_number")
    
    elif user.role =="admin":
      return WeeklyLog.objects.all().order_by("-week_number")
    return WeeklyLog.objects.none()
  

  def perform_create(self,serializer):
    serializer.save(student=self.request.user)

# submitting Log
  @action(detail=True, methods=['post'])
  def submit(self, request, pk=None):
    log = self.get_object()

    if log.status != 'draft':
      return Response({"error": "only draft logs can be submitted"}, status=400)

    log.status = 'submitted'
    log.save()

    return Response({"message": "Log submitted successfully"})

# Review Log
  @action(detail=True, methods=['post'])
  def review(self, request, pk=None):

    log = self.get_object()
    
    if log.status != 'submitted':
      return Response({"error": "only submitted logs can be reviewed"}, status=400)
    
    action = request.data.get("action")

    comment = request.data.get("supervisor_comment","")
    if action not in ['approve','reject']:
      return Response({"error":"Invalid action.Must be approve or reject"}, status=400)
    log.supervisor_comment = comment
    log.status = "approved" if action =="approve" else "rejected"
    log.save()

    message = f"Log {action}d by supervisor"
    return Response({"message": message})


  @action(detail=True,methods = ["post"],url_path="admin_approve")
  def admin_approve(self,request,pk=None):

    if request.user.role != "admin":
      return Response ({"error":"Unauthorised"},status=403)
    log = self.get_object()
    log.status = "approved"
    log.save()

    return Response ({"message":"Log approved by admin"})


  @action (detail=True, methods = ["post"], url_path="admin_reject")
  def admin_reject(self,request,pk = None):
    

    if request.user.role != "admin":
      return Response({"error":"Unauthorized"},status=403)
    log = self.get_object()
    log.status = "rejected"
    log.save()

    return Response({"message":"Log rejected by admin"})


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
