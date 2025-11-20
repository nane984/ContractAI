from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    model = User

    # kolone koje se vide u listi korisnika
    list_display = [
        "username",
        "email",
        "subscription_type",
        "questions_used",
        "monthly_limit",
        "is_active_account",
        "is_staff",
    ]

    # filteri sa strane
    list_filter = ["subscription_type", "is_active_account", "is_staff"]

    # polja u formi editovanja korisnika
    fieldsets = UserAdmin.fieldsets + (
        ("Subscription Info", {
            "fields": (
                "subscription_type",
                "is_active_account",
                "questions_used",
                "monthly_limit",
                "last_reset",
                "payment_history",
                "api_endpoint",
            )
        }),
    )

    # polja kada se kreira novi korisnik
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Subscription Info", {
            "fields": (
                "subscription_type",
                "is_active_account",
                "questions_used",
                "monthly_limit",
                "last_reset",
                "payment_history",
                "api_endpoint",
            )
        }),
    )


admin.site.register(User, CustomUserAdmin)