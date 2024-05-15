from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from .forms import SignupForm, LoginForm
from django.contrib.auth.decorators import login_required
from .models import Task
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

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
