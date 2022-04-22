from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.urls import reverse
from django.http import HttpResponseRedirect, JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from json import loads
from notes_app.models import User, Notes

def register(request):
    if request.method == "POST":
        email = request.POST["email"]
        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "notes_app/register.html", {
                "message": "Passwords must match."
            })
        # Attempt to create new user
        try:
            user = User.objects.create_user(username = email, password = password)
            user.save()
        except IntegrityError:
            return render(request, "notes_app/register.html", {
                "message": "User with the entered email already exists."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    return render(request, 'notes_app/register.html')

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        email = request.POST["email"]
        password = request.POST["password"]
        user = authenticate(request, username=email, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "notes_app/login.html", {
                "message": "Invalid email and/or password."
            })
    return render(request, 'notes_app/login.html')

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("login"))

@login_required(login_url='/login/')
def index(request):
    return render(request, 'notes_app/index.html')

@login_required(login_url='/login/')
@csrf_exempt
def notes(request):
    if request.method == "GET":
        try:
            user = request.user
            notes = user.notes.all()
            notes_list = []
            for i in notes:
                a = {'id': i.id, 'title': i.title,'note': i.note,'created_at': i.created_at,'updated_at': i.updated_at}
                notes_list.append(a)       
            return JsonResponse({"status": 0, "notes": notes_list})
        except:
            return JsonResponse({"status": 1})
    try:
        note = loads(request.body)
        title = note["title"]
        content = note["content"]
        user = request.user
        note_object=  Notes.objects.create(user=user, title=title, note=content)
        note_object.save()
        return JsonResponse({"status": 0})
    except:
        return JsonResponse({"status": 1})

@login_required(login_url='/login/')
@csrf_exempt
def delete(request):
    if request.method == "POST":
        try:
            note_id = loads(request.body)
            note_id = note_id["id"]
            note = Notes.objects.filter(id=note_id)
            if len(note) != 0:
                note.delete()
            return JsonResponse({"status": 0})
        except:
            return JsonResponse({"status": 1})

@login_required(login_url='/login/')
@csrf_exempt
def edit(request):
    if request.method == "POST":
        try:
            note_edit = loads(request.body)
            note = Notes.objects.get(id=note_edit["id"])
            note.title = note_edit["title"]
            note.note = note_edit["content"]
            note.save()
            return JsonResponse({"status": 0})
        except:
            return JsonResponse({"status": 1})