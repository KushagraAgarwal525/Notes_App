from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('notes/', views.notes, name='notes'),
    path('delete/', views.delete, name='delete'),
    path('edit/', views.edit, name='edit'),
]