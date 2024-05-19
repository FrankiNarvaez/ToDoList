from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='login'),
    path('todolist/', views.todolist, name='todolist'),
    path('login/', views.user_login, name='login'),
    path('signup/', views.user_signup, name='signup'),
    path('logout/', views.user_logout, name='logout'),
    path('create_task/', views.create_task, name='create_task'),
    path('delete_task/<int:task_id>/', views.delete_task, name='delete_task'),
    path('update_task/<int:task_id>/', views.update_task, name='update_task'),
]
