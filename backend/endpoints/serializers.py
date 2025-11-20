from rest_framework import serializers
from .models import ApiEndpoint

class ApiEndpointSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApiEndpoint
        fields = '__all__'