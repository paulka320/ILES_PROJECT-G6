from rest_framework.routers import DefaultRouter
from .views import InternshipPlacementViewSet,SupervisorStudentsView,AcademicStudentsView,AdminPlacementViewSet
router = DefaultRouter()
router.register(r'admin/placements', AdminPlacementViewSet,basename='admin-placements')

urlpatterns = router.urls