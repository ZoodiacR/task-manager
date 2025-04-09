# Task Manager - Gestión de Tareas

Aplicación full-stack para gestión de tareas con autenticación JWT.

## Instalación

### Backend (Django)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate # Windows
cd taskmanager
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend (Vue)
```bash
cd frontend
npm install
npm run dev
```

## API Documentation
Accede a la documentación en: http://localhost:8000/api/docs/
### Autenticación
```
POST /api/token/ → Obtener JWT
POST /api/token/refresh/ → Refrescar token
```

### Tareas
```
GET    /api/tasks/tasks/ → Listar tareas
POST   /api/tasks/tasks/ → Crear tarea
GET    /api/tasks/tasks/{id}/ → Detalle tarea
PUT    /api/tasks/tasks/{id}/ → Actualizar tarea
DELETE /api/tasks/tasks/{id}/ → Eliminar tarea
```

### Usuario
```
GET /api/tasks/user/ → Obtener datos usuario actual
```

## Decisiones Técnicas

1. **Arquitectura**:  
   - Frontend: Vue 3 + Vuetify + Pinia  
   - Backend: Django REST Framework + SimpleJWT

2. **Autenticación**:  
   - JWT con refresh tokens
   - Interceptores de axios para auto-inclusión de tokens

3. **Estado**:  
   - Pinia para gestión centralizada
   - Auto-recarga de datos tras mutaciones

4. **UI/UX**:  
   - Filtros combinados en tiempo real
   - Validación en tiempo de escritura
   - Feedback visual con chips de colores

## Mejoras Potenciales

1. ✨ Búsqueda full-text en tareas
2. 🔄 Sincronización en tiempo real con WebSockets
3. 📊 Reportes PDF/Excel de tareas
4. 👥 Sistema de multi-usuario con roles
5. 🗓 Vista de calendario para tareas