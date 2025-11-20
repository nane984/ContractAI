from django.db import models
from django.utils import timezone

class ApiEndpoint(models.Model):
    name = models.CharField(max_length=120)
    url = models.URLField()
    is_active = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name