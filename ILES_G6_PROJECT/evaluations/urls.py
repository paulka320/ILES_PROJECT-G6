from rest_framework.routers import DefaultRouter
from .views import EvaluationViewSet,AcademicEvaluationsView,academic_stats,AdminEvaluationsView

router = DefaultRouter()
router.register(r'evaluations', EvaluationViewSet,basename='evaluations')

urlpatterns = router.urls + [
    
]