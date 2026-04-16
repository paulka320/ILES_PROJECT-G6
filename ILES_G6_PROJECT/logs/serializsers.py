from rest_framework import serializsers
from .models import WeeklyLog

class WeeklyLogSerializser(serializers.ModelSerializer):
  class meta:
    model = WeeklyLog
    fields ='__all__'
    read_only_fields = ['status', 'student']

def create(self, validated_data):
  
