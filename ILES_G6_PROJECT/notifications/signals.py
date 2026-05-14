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


        try:
            placement = InternshipPlacement.objects.get(student=instance.student)
            supervisor = placement.supervisor_name
            Notification.objects.create(
                recipient=supervisor,
                notification_type='log_submitted',
                title ='New Log Submitted',
                message=f'Student {instance.student.username} has submitted their weekly log for week {instance.week_number}.',
                related_log=instance
            )
        except InternshipPlacement.DoesNotExist:
            Notification.objects.create(
                recipient = instance.student,
                notification_type = 'log_submitted',
                title ='Log Submitted - No Supervisor Assigned',
                message="Your weekly log was submiited, but no supervsor is currently assignedto your placement. It will be reviewed once a supervior is assigned.",
                related_log=instance
            )
@receiver(post_save, sender=WeeklyLog)
def notify_on_log_review(sender, instance,created, **kwargs):
    if not created and instance.status in ['approved', 'rejected']:
        notification_type = 'log_approved' if instance.status== 'approved' else 'log_rejected'
        title = 'Log Approved' if instance.status =='approved' else 'Log Rejected'
        message = f"Your weekly log for week {instance.week_number} has been {instance.status}."
        if instance.supervisor_comment:
            message += f'Comment: {instance.supervisor_comment}'

        Notification.objects.create(
            recipient= instance.student,
            notification_type = notification_type,
            title = title,
            message = message,
            related_log = instance


        )

@receiver(post_save, sender=Evaluation)
def notify_on_evaluation_created(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            recipient=instance.student,
            notification_type='evaluation_created',
            title='New Evaluation Available',
            message=f'You have received a new evaluation from {instance.evaluator.username}. Total score: {instance.total_score:.2f}',
            related_evaluation=instance
        )