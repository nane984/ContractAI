from rest_framework import viewsets
from .models import ApiEndpoint
from .serializers import ApiEndpointSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

class ApiEndpointViewSet(viewsets.ModelViewSet):
    queryset = ApiEndpoint.objects.all().order_by('-created_at')
    serializer_class = ApiEndpointSerializer

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        # deactivate others and activate this
        ApiEndpoint.objects.update(is_active=False)
        ep = self.get_object()
        ep.is_active = True
        ep.save()
        return Response({'status':'activated'}, status=status.HTTP_200_OK)
