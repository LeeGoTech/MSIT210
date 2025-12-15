"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from core import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('base/', views.base, name='base'),
    path('announcements/', views.announcements, name='announcements'),
    path("announcements/<int:id>/", views.announcement_detail, name="announcement_detail"),
    path('posts/', views.posts, name='posts'),
    path('posts/create/', views.create_post, name='create_post'),
    path('posts/update/<int:post_id>/', views.update_post, name='update_post'),
    path('posts/delete/<int:post_id>/', views.delete_post, name='delete_post'),
    path('comments/create/', views.create_comment, name='create_comment'),
    path("comments/update/<int:comment_id>/", views.update_comment, name="update_comment"),
    path('comments/delete/<int:comment_id>/', views.delete_comment, name='delete_comment'),
]
