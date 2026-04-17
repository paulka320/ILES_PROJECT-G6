from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class EvaluationCriteria(models.model):
    name = models.CharField(max_length = 100)
    weight = models.FloatField()

    def __str__(self):
        return self.name
    
class Evaluation(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    evaluator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='evaluatoions_given')
    attendance_score = models.FloatField()
    performance_score = models.FloatField()
    report_score = models.FloatField()

    total_score = models.FloatField(blank=True, null=True)