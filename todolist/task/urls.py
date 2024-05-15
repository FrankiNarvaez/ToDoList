from django.urls import path
from . import views
from .views import create_task, delete_task

urlpatterns = [
    path('', views.index, name='home'),
    path('todolist/', views.todolist, name='todolist'),
    path('login/', views.user_login, name='login'),
    path('signup/', views.user_signup, name='signup'),
    path('logout/', views.user_logout, name='logout'),
    path('create_task/', create_task, name='create_task'),
    path('delete_task/<int:task_id>/', delete_task, name='delete_task'),
]