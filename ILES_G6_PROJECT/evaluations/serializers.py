from rest_framework import serializers
from .models import Evaluation
from users.models import CustomUser


class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id','username', 'role']


class EvaluationSerializer(serializers.ModelSerializer):
    student = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all(),write_only = True)
    student_details=UserMiniSerializer(source ='student',read_only= True)
    evaluator = UserMiniSerializer(read_only=True)
    class Meta:
        model = Evaluation
        fields = '__all__'
        read_only_fields = ['total_score']

    