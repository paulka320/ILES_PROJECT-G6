from rest_framework.routers import DefaultRouter
from .views import InternshipPlacementViewSet,SupervisorStudentsView,AcademicStudentsView,AdminPlacementViewSet
from django.urls import path
router = DefaultRouter()
router.register(r'admin/placements', AdminPlacementViewSet,basename='admin-placements')

urlpatterns = router.urls + [
    path('supervisor/students/',SupervisorStudentsView.as_view(),name="supervisor-students"),
    path('academic/students/',AcademicStudentsView.as_view(),name="academic-students"),
]