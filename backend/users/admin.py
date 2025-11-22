from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User
from chat.models import ChatSession

class ChatSessionInline(admin.TabularInline):
    model = ChatSession
    extra = 0
    readonly_fields = ("title", "created_at", "admin_messages_link")
    fields = ("title", "created_at", "admin_messages_link")
    can_delete = False              # ne može da briše

    def has_add_permission(self, request, obj=None):
        # Onemogućava dodavanje novih poruka
        return False

    def has_change_permission(self, request, obj=None):
        # Onemogućava izmene postojećih poruka
        return False

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

    inlines = [ChatSessionInline]

admin.site.register(User, CustomUserAdmin)