from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Notification
# Create your views here.
from .serializers import NotificationSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Notification.objects.all()

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)
    def perform_create(self, serializer):
        serializer.save(recipient=self.request.user)

    @action(detail=True, methods=['patch'], url_path='mark_read')
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response(self.get_serializer(notification).data)

    @action(detail=False, methods=['post'], url_path='mark_all_read')
    def mark_all_read(self, request):
        notifications = self.get_queryset().filter(is_read=False)
        notifications.update(is_read=True)
        return Response({"message": "All notifications marked as read"})