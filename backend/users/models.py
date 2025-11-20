from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    # username i email postoje u AbstractUser
    subscription_type = models.CharField(max_length=30, default='free')
    is_active_account = models.BooleanField(default=True)
    questions_used = models.IntegerField(default=0)
    monthly_limit = models.IntegerField(default=100)
    last_reset = models.DateField(default=timezone.now)
    payment_history = models.JSONField(default=list, blank=True)
    api_endpoint = models.ForeignKey('endpoints.ApiEndpoint', null=True, blank=True, on_delete=models.SET_NULL)

    def can_ask(self):
        # If 30+ days passed since last_reset, reset (simple fallback)
        if (timezone.now().date() - self.last_reset).days >= 30:
            self.reset_questions()
        return self.is_active_account and self.questions_used < self.monthly_limit

    def increment_questions(self):
        self.questions_used += 1
        self.save(update_fields=['questions_used'])

    def reset_questions(self):
        self.questions_used = 0
        self.last_reset = timezone.now().date()
        self.save(update_fields=['questions_used', 'last_reset'])
