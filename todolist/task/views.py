from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from .forms import SignupForm, LoginForm
from django.contrib.auth.decorators import login_required
from .models import Task
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
import json

@login_required
def todolist(request):
    tasks = Task.objects.filter(user=request.user)
    context = {'tasks': tasks}
    return render(request, 'task/todolist.html', context)

# Create your views here.
# Home page
def index(request):
    return render(request, 'task/todolist.html')

# signup page
def user_signup(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = SignupForm()
    return render(request, 'signup.html', {'form': form})

# login page
def user_login(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user:
                login(request, user)
                return redirect('todolist')
    else:
        form = LoginForm()
    return render(request, 'login.html', {'form': form})

# logout page
def user_logout(request):
    logout(request)
    return redirect('login')

def todo_list(request):
    if request.user.is_authenticated:
        tasks = Task.objects.filter(user=request.user)
    else:
        tasks = []
    return render(request, 'todolist.html', {'tasks': tasks})

@csrf_exempt
@login_required
def create_task(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        completed = request.POST.get('completed') == 'true'
        task = Task.objects.create(user=request.user, title=title, completed=completed)
        return JsonResponse({'id': task.id, 'title': task.title, 'completed': task.completed})

@login_required
def delete_task(request, task_id):
    task = Task.objects.get(id=task_id, user=request.user)
    task.delete()
    return redirect('todolist')

@method_decorator(csrf_exempt, name='dispatch')
class UpdateTaskView(View):
    def get(self, request, task_id):
        task = Task.objects.get(id=task_id, user=request.user)
        context = {'task': task}
        return render(request, 'task/updatetask.html', context)

    def post(self, request, task_id):
        try:
            task = Task.objects.get(id=task_id, user=request.user)
            data = json.loads(request.body)
            task.title = data.get('title', task.title)
            task.description = data.get('description', task.description)
            task.completed = data.get('completed', task.completed)
            task.save()
            return JsonResponse({'success': True})
        except Task.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Task not found.'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)

update_task = UpdateTaskView.as_view()
