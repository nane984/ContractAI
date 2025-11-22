from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import ChatSession, ChatMessage

User = get_user_model()

# ---------------------------------------------------------
#  CUSTOM FILTERS – DEPENDENT FILTERS
# ---------------------------------------------------------
class UserFilter(admin.SimpleListFilter):
    title = 'User'
    parameter_name = 'user'

    # Dropdown u filteru: lista svih korisnika
    def lookups(self, request, model_admin):
        return [(u.id, u.username) for u in User.objects.all()]
    
    # Ako user iz dropdown-a izabran → filtriraj po tom useru
    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(user_id=self.value())
        return queryset


class MessageSessionFilter(admin.SimpleListFilter):
    title = 'Session'
    parameter_name = 'session'

    def lookups(self, request, model_admin):
        # Pogledamo da li je u filteru već izabran User
        user_id = request.GET.get('user')

        # Ako jeste → pokaži samo njegove sesije
        if user_id:
            sessions = ChatSession.objects.filter(user_id=user_id)
        else:
            sessions = ChatSession.objects.all()

        return [(s.id, s.title) for s in sessions]

    def queryset(self, request, queryset):
        # Ako session iz dropdown-a izabran → filtriraj poruke
        if self.value():
            return queryset.filter(session_id=self.value())
        return queryset


# ---------------------------------------------------------
#  INLINE PRIKAZ PORUKA UNUTAR SESIJE
# ---------------------------------------------------------

class ChatMessageInline(admin.TabularInline):
    model = ChatMessage
    fk_name = "session"  # obavezno ako model ima više FK
    extra = 0            # ne prikazuje prazna polja
    readonly_fields = ("role", "content", "timestamp")
    fields = ("role", "content", "timestamp")
    can_delete = False              # ne može da briše

    def has_add_permission(self, request, obj=None):
        # Onemogućava dodavanje novih poruka
        return False

    def has_change_permission(self, request, obj=None):
        # Onemogućava izmene postojećih poruka
        return False
    
# ---------------------------------------------------------
#  ADMIN ZA CHAT SESSION
# ---------------------------------------------------------

@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "title", "created_at", "admin_messages_link")
    list_filter = (UserFilter,)
    search_fields = ("title", "user__username")
    inlines = [ChatMessageInline]

    # Ne može da se doda
    def has_add_permission(self, request):
        return False

    # Ne može da se menja
    def has_change_permission(self, request, obj=None):
        return False

    # Ne može da se briše
    def has_delete_permission(self, request, obj=None):
        return False

    # Sve vrednosti readonly
    readonly_fields = ("user", "title", "created_at", "admin_messages_link")
# ---------------------------------------------------------
#  ADMIN ZA CHAT MESSAGE
# ---------------------------------------------------------

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ("id", "session", "role", "content","timestamp")
    list_filter = (UserFilter, MessageSessionFilter)  # zavisni filteri
    search_fields = ("content",)

    # Ne može da se doda
    def has_add_permission(self, request):
        return False

    # Ne može da se menja
    def has_change_permission(self, request, obj=None):
        return False

    # Ne može da se briše
    def has_delete_permission(self, request, obj=None):
        return False

    # Readonly fields
    readonly_fields = ("session", "role", "content", "timestamp")