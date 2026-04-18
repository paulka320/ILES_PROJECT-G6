from rest_framework import serializers
from .models import InternshipPlacement

class InternshipPlacementSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternshipPlacement
        fields = '__all__'

    # 🔥 VALIDATION: prevent overlapping dates
    def validate(self, data):
        student = data['student']
        start_date = data['start_date']
        end_date = data['end_date']

        if start_date > end_date:
            raise serializers.ValidationError("Start date must be before end date")

        existing = InternshipPlacement.objects.filter(
            student=student,
            start_date__lte=end_date,
            end_date__gte=start_date
        )

        if existing.exists():
