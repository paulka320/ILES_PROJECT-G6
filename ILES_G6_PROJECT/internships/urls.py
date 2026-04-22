from rest_framework.routers import DefaultRouter
from .views import InternshipPlacementViewSet
router = DefaultRouter()
router.register(r'placements', InternshipPlacementViewSet,basename='placements')

urlpatterns = router.urls