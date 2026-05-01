from rest_framework.routers import DefaultRouter
from .views import WeeklyLogViewSet,SupervisorPendingLogsView,AcademicStudentLogsView,AdminLogsView

router =DefaultRouter()
router.register(r'logs', WeeklyLogViewSet,basename='weeklylogs')

urlpatterns = router.urls + [
    path('supervisor/pending/',SuperVisorPendingLogsView.as_view(),name="supervisor-pending-logs"),
    path('academic/<int:student_id>/logs/',AcademicStudentLogsView.as_view(),name = "academic-student-logs"),
    
]
