from django.db import models
from django.conf import settings
# Create your models here.

User = settings.AUTH_USER_MODEL

class WeeklyLog(models.Model):
  STATUS_CHOICES = (
    ('draft', 'draft'),
    ('submitted', 'submitted'),
    ('reviewed', 'reviewed'),
    ('approved', 'approved'),
  )

student = models.ForeignKey(User, on_delete=models.CASCADE)
week_number = models.IntegerField()

content = models.TextField()

status = models.CharsField(max_length=20,choices = STATUS_CHOICES, default='draft')
created_at = models.DateField(auto_now_add=True)

def __str__(self):
  return f"Week {self.week_number} -{self.student}"



    
