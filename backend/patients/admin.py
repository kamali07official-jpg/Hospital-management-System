from django.contrib import admin
from .models import Patient

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ("id", "full_name", "age", "gender", "email", "phone", "blood_group", "admission_date")
    search_fields = ("full_name", "email", "phone")
    list_filter = ("gender", "blood_group")
