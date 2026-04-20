from rest_framework import serializers
from .models import Evaluation

class EvaluationSerializer(serializers.ModelSerializer):
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
