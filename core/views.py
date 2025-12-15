from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from core.models import Post, Comment
from core.forms import PostForm
from django.template.loader import render_to_string
import random

RANDOM_NAMES = ["Alice", "Ben", "Charlie", "Diana", "Ethan", "Fiona", "George", "Hannah", "Ian", "Julia", "Kevin", "Laura", "Mason", "Nina", "Oliver", "Penelope", "Quentin", "Rachel", "Samuel", "Tina", "Ulysses", "Victoria", "William", "Xander", "Yvonne", "Zachary"]

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

def posts(request):
    posts = Post.objects.prefetch_related('comments').all()
    context = {
        'posts': posts,
        'title': 'Posts',
    }
    return render(request, 'posts.html', context)

def create_post(request):
    if request.method == "POST" and request.headers.get('x-requested-with') == 'XMLHttpRequest':
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save()
            # Render the single post HTML to send back
            html = render_to_string('partials/_single_post.html', {'post': post})
            return JsonResponse({'success': True, 'html': html})
        return JsonResponse({'success': False, 'errors': form.errors})
    return JsonResponse({'success': False, 'error': 'Invalid request'})

def update_post(request, post_id):
    if request.method == "POST" and request.headers.get('x-requested-with') == 'XMLHttpRequest':
        post = Post.objects.get(id=post_id)
        title = request.POST.get('title')
        body = request.POST.get('body')

        if title and body:
            post.title = title
            post.body = body
            post.save()
            return JsonResponse({'success': True, 'title': title, 'body': body})
        return JsonResponse({'success': False, 'error': 'Title and Body are required'})
    return JsonResponse({'success': False, 'error': 'Invalid request'})

def delete_post(request, post_id):
    if request.method == "POST" and request.headers.get('x-requested-with') == 'XMLHttpRequest':
        try:
            post = Post.objects.get(id=post_id)
            post.delete()
            return JsonResponse({'success': True})
        except Post.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Post not found'})
    return JsonResponse({'success': False, 'error': 'Invalid request'})

def create_comment(request):
    if request.method == "POST" and request.headers.get('x-requested-with') == 'XMLHttpRequest':
        post_id = request.POST.get('post_id')
        text = request.POST.get('text')

        if not text:
            return JsonResponse({'success': False, 'error': 'Comment text is required'})

        try:
            post = Post.objects.get(id=post_id)
            random_name = random.choice(RANDOM_NAMES)
            comment = Comment.objects.create(post=post, text=text, author=random_name)

            # Render the new comment HTML
            html = render_to_string('partials/_comment_item.html', {'comment': comment})
            return JsonResponse({'success': True, 'html': html})
        except Post.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Post not found'})

    return JsonResponse({'success': False, 'error': 'Invalid request'})

def update_comment(request, comment_id):
    if request.method == "POST" and request.headers.get("x-requested-with") == "XMLHttpRequest":
        comment = Comment.objects.get(pk=comment_id)
        text = request.POST.get("text", "").strip()
        if text:
            comment.text = text
            comment.save()
            return JsonResponse({
                "success": True,
                "comment": {
                    "id": comment.id,
                    "text": comment.text
                }
            })
        return JsonResponse({"success": False, "errors": "Empty text"})
    return JsonResponse({"success": False, "errors": "Invalid request"})

def delete_comment(request, comment_id):
    if request.method == "POST" and request.headers.get("x-requested-with") == "XMLHttpRequest":
        try:
            comment = Comment.objects.get(pk=comment_id)
            comment.delete()
            return JsonResponse({"success": True})
        except Comment.DoesNotExist:
            return JsonResponse({"success": False, "error": "Comment not found"})
    return JsonResponse({"success": False, "error": "Invalid request"})