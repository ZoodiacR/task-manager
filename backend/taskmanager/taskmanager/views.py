from django.http import JsonResponse

def welcome(request):
    return JsonResponse({
        "message": "Bienvenido a la API del Gestor de Tareas",
        "endpoints": {
            "tasks": "/api/tasks/",
            "documentación": "/api/docs/",
            "autenticación": "/api/token/"
        }
    })