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
        fields = ['id', 'student', 'company_name', 'academic_supervisor', 'supervisor_name',
                 'start_date', 'end_date', 'student_id', 'supervisor_id', 'academic_id']

    def create(self, validated_data):
        student_id = validated_data.pop('student_id')
        supervisor_id = validated_data.pop('supervisor_id',None)
        academic_id = validated_data.pop('academic_id',None)

        student = CustomUser.objects.get(id=student_id)
        validated_data['student']= student

        if supervisor_id:
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