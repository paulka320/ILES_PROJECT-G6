from rest_framework import serializers
from .models import Evaluation
from users.models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id','username', 'role']


class EvaluationSerializer(serializers.ModelSerializer):
    student = serializers.PrimaryKeyRelationField(queryset=CustomUser.objects.all(),write_only = True)
    student_details=UserSerializer(source ='student',read_only= True)
    evaluator = UserSerializer(read_only=True)
    class Meta:
        model = Evaluation
        fields = '__all__'
        read_only_fields = ['total_score']

    #prevent duplicate evaluation
    def validate(self, data):
        student = data['student']
        evaluator = self.context['request'].user

        if Evaluation.objects.filter(student=student, evaluator=evaluator).exists():
            raise serializers.ValidationError("You have already evaluated this student.")
        
        return data
