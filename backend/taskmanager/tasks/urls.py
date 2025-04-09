from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, CurrentUserView

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('', include(router.urls)),
    path("user/", CurrentUserView.as_view(), name="current-user"),
]


