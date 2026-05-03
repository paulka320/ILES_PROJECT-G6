from django.shortcuts import render
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