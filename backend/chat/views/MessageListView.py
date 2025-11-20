from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from ..models import ChatMessage
from ..serializers import ChatMessageSerializer

#vraća sve poruke iz jedne sesije
class MessageListView(ListAPIView):
    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        chat_id = self.kwargs["chat_id"]
        return ChatMessage.objects.filter(session_id=chat_id).order_by("timestamp")