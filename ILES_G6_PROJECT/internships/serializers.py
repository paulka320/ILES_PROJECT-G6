from rest_framework import serializers
from .models import InternshipPlacement
from users.models import CustomUser

class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id','username','role']

class InternshipPlacementSerializer(serializers.ModelSerializer):
    student = UserMiniSerializer(read_only=True)
    supervisor_name = UserMiniSerializer(read_only=True)
    academic_supervisor = UserMiniSerializer(read_only=True)

    student_id = serializers.IntegerField(write_only=True)
    supervisor_id = serializers.IntegerField(write_only=True,required=False)
    academic_id = serializers.IntegerField(write_only=True, required=False)
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
            raise serializers.ValidationError("Overlapping internship placement detected")

        return data