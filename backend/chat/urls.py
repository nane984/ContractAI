from django.urls import path
from .views import AskView, ChatListView, MessageListView

urlpatterns = [
    path("sessions/", ChatListView.as_view(), name="chat-list"),
    path("sessions/<int:chat_id>/messages/", MessageListView.as_view(), name="message-list"),

    # Ask AI
    path("sessions/ask/", AskView.as_view(), name="ask-new"),
    path("sessions/<int:chat_id>/ask/", AskView.as_view(), name="ask-existing"),
]
