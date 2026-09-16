from rest_framework import serializers
from .models import Patient

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = "__all__"
        read_only_fields = ["id", "created_at"]

    def validate_age(self, value):
        if value < 1 or value > 120:
            raise serializers.ValidationError("Age must be between 1 and 120.")
        return value

    def validate_phone(self, value):
        digits = "".join(ch for ch in value if ch.isdigit())
        if len(digits) < 10 or len(digits) > 15:
            raise serializers.ValidationError("Enter a valid phone number with 10 to 15 digits.")
        return value

    def validate_full_name(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Full name must contain at least 3 characters.")
        return value.strip()
