from ..models import ChatSession
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from ..serializers import ChatSessionSerializer

#vraca sve sesije korisnika
class ChatListView(ListAPIView):
    serializer_class = ChatSessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ChatSession.objects.filter(user=self.request.user).order_by("-created_at")