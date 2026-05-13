from rest_framework.routers import DefaultRouter
from .views import WeeklyLogViewSet,SupervisorPendingLogsView,AcademicStudentLogsView,AdminLogsView
from django.urls import path


router =DefaultRouter()
router.register(r'weeklylogs', WeeklyLogViewSet,basename='weeklylogs')

urlpatterns = [
    path('', include(router.urls)), # This includes your 'weeklylogs'
    path('supervisor/pending/', SupervisorPendingLogsView.as_view(), name="supervisor-pending"),
    path('academic/<int:student_id>/logs/', AcademicStudentLogsView.as_view(), name="academic-student-logs"),
    path('admin/logs/', AdminLogsView.as_view(), name="admin-logs"),
]