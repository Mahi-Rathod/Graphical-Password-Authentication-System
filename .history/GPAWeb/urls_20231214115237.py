from django.contrib import admin
from django.urls import path,include
from . import views

urlpatterns = [
    path('',views.main, name='main'),
    # path('signup',views.signup,name='signup'),
    # path('signin', views.signin, name='signin'),
    path('register',views.register,name='register'),
    path('login',views.login, name='login'),
    path('forgot',views.forgot,name='forgot'),
    path('ajax-view/<str:email>/<str:uname>/',views.Generate_OTP, name='Generate_OTP'),
    path('user_exist/<str:username>/<str:email>/',views.user_exist, name='user_exist'),
]
