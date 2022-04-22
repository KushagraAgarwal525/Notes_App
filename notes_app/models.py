from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    pass

class Notes(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
    title = models.CharField(max_length=100, default="")
    note = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)