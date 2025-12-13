from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def home(request):
    context = {
        'title': 'Home',
        'course': 'MSIT 210 - DevOps and Software Lifecycle Automation',
        'units': 3,
    }
    return render(request, 'home.html', context)

def about(request):
    context = {
        'title': 'About',
        'name': 'Daniel Ligutan',
        'student_id': '2021-32347',
    }
    return render(request, 'about.html', context)

def base(request):
    return render(request, 'base.html')

def announcements(request):
    lists = {
        1: {"title": "Welcome!"},
        2: {"title": "First assignment."},
    }
    context = {
        "title": "Announcements",
        "lists": lists
    }
    return render(request, "announcements.html", context)


def announcement_detail(request, id):
    lists = {
        1: {
            "title": "Welcome!",
            "message": "Welcome to the course!",
        },
        2: {
            "title": "First assignment.",
            "message": "First assignment is due next week.",
        },
    }
    announcement = lists.get(id)
    context = {
        "id": id,
        "title": announcement["title"],
        "message": announcement["message"],
    }
    return render(request, "announcement_detail.html", context)
