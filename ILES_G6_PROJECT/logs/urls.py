from rest_framework.routers import DefaultRouter
from .views import WeeklyLogViewSet

router =DefaultRouter()
router.register(r'logs', weeklyLogViewSet)

urlpatterns = router.urls
