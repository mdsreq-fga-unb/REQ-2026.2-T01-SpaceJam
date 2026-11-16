from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Usuario


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    list_display = ("username", "first_name", "last_name", "papel", "treinador", "is_active")
    list_filter = ("papel", "is_active")
    fieldsets = UserAdmin.fieldsets + (
        ("Basquete", {"fields": ("papel", "telefone", "treinador")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Basquete", {"fields": ("papel", "telefone", "treinador")}),
    )
