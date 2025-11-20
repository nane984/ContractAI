from django.contrib.auth import get_user_model
from django.http import JsonResponse

User = get_user_model()

class CheckUserExistsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        user = request.user

        # Ako je autentifikovan, proveri da li postoji u bazi
        if user.is_authenticated:
            exists = User.objects.filter(id=user.id).exists()
            if not exists:
                return JsonResponse(
                    {"detail": "User account no longer exists."},
                    status=401
                )

        return self.get_response(request)