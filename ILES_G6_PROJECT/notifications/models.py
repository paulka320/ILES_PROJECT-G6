from django.db import models
from django.conf import settings
# Create your models here.
User = settings.AUTH_USER_MODEL

class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ('log_submitted','Log Submitted'),
        ('log_approved','Log Approved'),
        ('log_rejected','Log Rejected'),
        ('evaluation_created','Evaluation Created'),
        ('placement_assigned','Placement Assigned'),
    )

    recipient = models.ForeignKey(User,on_delete=models.CASCADE,related_name='notifications')
    notification_type = models.CharField(max_length=20,choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    related_log = models.ForeignKey('logs.WeeklyLog',on_delete=models.CASCADE, null=True, blank=True)
    related_evaluation = models.ForeignKey('evaluations.Evaluation',on_delete=models.CASCADE, null=True,blank=True)
    related_placement = models.ForeignKey('internships.InternshipPlacement', on_delete=models.CASCADE, null=True,blank=True)

    def __str__(self):
        return f"{self.recipient.username}-{self.title}"
    

class Meta:
    ordering = ['-created_at']
    