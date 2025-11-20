from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from endpoints.models import ApiEndpoint
import requests
from ..models import ChatSession, ChatMessage


#glavni endpoint za AI
class AskView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, chat_id=None):
        user = request.user
        prompt = request.data.get("prompt")

        if not prompt:
            return Response({"detail": "Prompt je obavezan."}, status=400)

        if not user.can_ask():
            return Response({"detail": "Limit dostignut."}, status=429)

        endpoint = user.api_endpoint or ApiEndpoint.objects.filter(is_active=True).first()
        if not endpoint:
            return Response({"detail": "API endpoint ne postoji."}, status=503)

        # Ako chat ne postoji, kreira se novi
        if chat_id is None:
            chat = ChatSession.objects.create(user=user, title=prompt[:50])
        else:
            chat = ChatSession.objects.filter(id=chat_id, user=user).first()
            if not chat:
                return Response({"detail": "Chat ne postoji."}, status=404)

        # Sačuvaj user poruku
        ChatMessage.objects.create(session=chat, role="user", content=prompt)

        try:
            r = requests.get(endpoint.url, timeout=15)
            r.raise_for_status()
            data = r.json()
            answer = data.get("title", "No answer received")

            # Sačuvaj AI odgovor
            ChatMessage.objects.create(session=chat, role="assistant", content=answer)

            user.increment_questions()

            return Response({
                "chat_id": chat.id,
                "title": chat.title,
                "answer": answer
            })

        except Exception as e:
            return Response({"detail": "API error", "error": str(e)}, status=500)
