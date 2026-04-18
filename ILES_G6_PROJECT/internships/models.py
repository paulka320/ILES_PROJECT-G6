from django.db import models
from django.conf import settings
# Create your models here.

User = settings.AUTH_USER_MODEL
class InternshipPlacement(models.Model):
    student = models.ForeignKey(User,on_delete=models.CASCADE,related_name='student_placements')
    academic_supervisor = models.ForeignKey(User, on_delete = models.CASCADE, related_name= 'academic_students')
    supervisor_name = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'supervisor_students')
    start_date = models.DateField()
