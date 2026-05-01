from rest_framework.routers import DefaultRouter
from .views import EvaluationViewSet,AcademicEvaluationsView,academic_stats,AdminEvaluationsView
from django.urls import path
router = DefaultRouter()
router.register(r'evaluations', EvaluationViewSet,basename='evaluations')

urlpatterns = router.urls + [
    path('academic/<int:id>/evaluations/',
         AcademicEvaluaionsView.as_view(),name="academic-evaluations"),
    path('academic/<int:id>/stats/',academic_stats,name="academic-stats"),
    path('admin/evaluations/',AdminEvaluationsView.as_view(),name="admin-evaluations"),
]