from django.contrib import admin
from .models import Task  # 👈 Importar el modelo

@admin.register(Task)  # 👈 Registrar el modelo
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'status', 'due_date')  # Campos visibles
    list_filter = ('status', 'priority')  # Filtros laterales
    search_fields = ('title', 'description')