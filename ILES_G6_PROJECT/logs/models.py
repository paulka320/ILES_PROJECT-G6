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

student = models.Foreignkey(User, on_delete=models.CASCADE)
week_number = models.IntegerField()

content = models.TextField()

status = models.charField(max_length=20,choices = STATUS_CHOICES, default='draft')
created_at = models.DateField(auto_now_add=TRUE)

def __str__(self):
  return f"Week {self.week_number} -{self.student}"



    
