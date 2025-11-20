from celery import shared_task
from .models import User

@shared_task
def monthly_reset_question():
    for u in User.objects.all():
        u.reset_questions()