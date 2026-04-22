from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class EvaluationCriteria(models.model):
    name = models.CharField(max_length = 100)
    weight = models.FloatField()
