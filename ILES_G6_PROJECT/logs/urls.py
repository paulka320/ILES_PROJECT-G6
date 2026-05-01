from rest_framework.routers import DefaultRouter
from .views import WeeklyLogViewSet,SupervisorPendingLogsView,AcademicStudentLogsView,AdminLogsView

router =DefaultRouter()
router.register(r'logs', WeeklyLogViewSet)

urlpatterns = router.urls
