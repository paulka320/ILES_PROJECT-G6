from rest_framework import serializers
from .models import WeeklyLog
from users.models import CustomUser


class UserMiniSerializer(serializers.ModelSerializer):
  class Meta:
    model = CustomUser
    fields = ['id','username','role']

class WeeklyLogSerializer(serializers.ModelSerializer):
    student = UserMiniSerializer(read_only=True)

    class Meta:
        model = WeeklyLog
        fields = '__all__'
        read_only_fields = ['status', 'student', 'supervisor_comment']

    def create(self, validated_data):
        request = self.context['request']
        validated_data['student'] = request.user
        return WeeklyLog.objects.create(**validated_data)

    def update(self, instance, validated_data):
        # Prevent editing after approval
        if instance.status == 'approved':
            raise serializers.ValidationError("Cannot edit approved log")
        return super().update(instance, validated_data)

  
  
