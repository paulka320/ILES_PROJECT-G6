from django.db import models
from django.conf import settings
# Create your models here.

user = settings.AUTH-USER_MODEL

class WeeklyLog(models.model):
  STATUS_CHOICE = (
    ('draft', 'draft'),
    ('submitted', 'submitted'),
    ('reviewed', 'reviewed'),
    ('approved', 'approved'),
  )
    
