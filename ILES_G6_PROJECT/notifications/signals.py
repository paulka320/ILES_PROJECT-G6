from django.db.models.signals import post_save
from django.dispatch import receiver
from logs.models import WeeklyLog
from evaluations.models import Evaluation
from internships.models import InternshipPlacement
from notifications.models import Notification
from users.models import CustomUser

@receiver(post_save, sender=WeeklyLog)
def notify_on_log_submission(sender, instance, created, **kwargs):
    if instance.status == 'submitted' and not created:
        # Confirm submission to the student
        Notification.objects.create(
            recipient=instance.student,
            notification_type='log_submitted',
            title='Log Submitted',
            message=f'Your weekly log for week {instance.week_number} has been submitted successfully and is pending review.',
            related_log=instance
        )
