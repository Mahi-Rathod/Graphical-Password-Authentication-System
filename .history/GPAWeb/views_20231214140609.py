from django.shortcuts import get_object_or_404, render, redirect
from django.http import HttpResponse
from django.template import loader

from .models import CustomUser

from django.contrib import messages
from django.contrib.auth import authenticate, login,logout
from django.conf import settings
from django.core.mail import send_mail,EmailMessage
from GPA.settings import EMAIL_HOST_USER
import random as rand
from django.http import JsonResponse
import os
from twilio.rest import Client

from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import update_session_auth_hash


OTP_1="123"

def main(request):
    return render(request, 'register.html')

def send_message(mobile, bodyofmessage):
    account_sid = "AC1066f107c8ffe31655789fbca13fa8bd"
    auth_token = "8b97da2e361632eaa6316463802153c4"
    verify_sid = "VA9f0e2aafd69c9549d54c1d2b3d4697f7"
    verified_number = "+13367901562"

    client = Client(account_sid, auth_token)

    try:
        message = client.messages.create(
            body=bodyofmessage,
            from_=verified_number,
            to="+91"+mobile
        )
        return f'Message sent. SID: {message.sid}'
    except Exception as e:
        return f'Error sending message: {str(e)}'

def register(request):
    if request.method=="POST":
        username   = request.POST['uname']
        firstname  = request.POST['fname']
        lastname   = request.POST['lname']
        email      = request.POST['email']
        password   = request.POST['pass']
        mobile_num = request.POST['mobile']

        if CustomUser.objects.filter(username=username):
            messages.error(request, "Username Already Exist! Please try some other username")
            return redirect('/register')
        
        if CustomUser.objects.filter(email=email):
            messages.error(request, "Email You Provided is Already Exist!")
            return redirect('/register')
        
        myuser = CustomUser.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=firstname,
            last_name=lastname,
            mobile_number=mobile_num
        )
        
        body = "Thank you " + firstname + " " + lastname + "! for using our Services " + "\n Your Regards, \n Graphical Password Authentication Team",
        result = send_message(mobile_num, body)

        print(result)
        return redirect('/login')

    return render(request, 'register.html')

def login(request):
    if request.method == 'POST':
        username = request.POST['uname']
        email = request.POST['email']
        password = request.POST['pass']
        mobile_num  = request.POST['mobile']
        # Check if a user with the provided credentials exists
        user = authenticate(request, username=username, password=password, email=email)

        if user is not None:
            firstname = user.first_name
            lastname  = user.last_name
            # return HttpResponse("Hello, Welcome Back!")
            templates = loader.get_template('landing_page.html')
            context   = {
                'firstname' : firstname.capitalize(),
                "lastname"  : lastname.capitalize(),
            }
            return HttpResponse(templates.render(context, request))
        
        else:
            messages.error(request, "Bad Credentials")
            return redirect('/login')

    return render(request, 'login.html')
 
def Generate_OTP(request,email, uname):
    email = str(email)
    uname = str(uname)
    OTP_1 = str(rand.randint(100000,999999))
    subject = "OTP"
    message = "Hello, " + uname + " welcome to GPA." + " Your OTP Is " + OTP_1
    from_email = EMAIL_HOST_USER
    to_list = [email]
    send_mail(subject, message, from_email, to_list, fail_silently=False)
    data = {'otp':OTP_1}
    return JsonResponse(data)

def forgot(request):
    if request.method == 'POST':
        username = request.POST['uname']
        email = request.POST['email']
        password = request.POST['pass']
        mobile_num = request.POST['mobile']

        try:
            user = get_object_or_404(CustomUser, username=username, email=email)
        except ObjectDoesNotExist:
            messages.error(request, 'Invalid username or email')
            return redirect('forgot')

        user.set_password(password)
        user.save()

        update_session_auth_hash(request, user)

        body = "\nHello " + user.first_name + " " + user.last_name + "\nYour Password has been changed Successfully.\nYour Regards,\nGPA Team"
        result = send_message(mobile_num, body)
        print(result)

    return render(request, 'forgot.html')

def user_exist(request,username,email):
    user_name = username
    email     = email
    flag = False
    user_exists = CustomUser.objects.filter(username=user_name).exists() or CustomUser.objects.filter(email=email).exists()
    if(user_exists):
        flag = 'True'
    else:
        flag = 'False'
    print(flag)
    return JsonResponse({'user_exist':flag})

def logouts(request):
    logout(request)
    return render(request,'login.html')

