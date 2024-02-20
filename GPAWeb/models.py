from django.db import models
from django.contrib.auth.models import User, AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db.models.signals import post_save
from django.dispatch import receiver
# Create your models here.
# class User(models.Model):
#     username      =  models.CharField(max_length=30)
#     email         =  models.CharField(max_length=30)
#     password      =  models.CharField(max_length=12)
#     first_name    =  models.CharField(max_length=30)
#     last_name     =  models.CharField(max_length=30)
#     mobile_number =  models.CharField(max_length=10)

#     def __str__(self):
#         return self.firstname + " " + self.lastname
    

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(username, email, password, **extra_fields)
    

class CustomUser(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=30, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # Use a more secure field like models.PasswordField in production
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    mobile_number = models.CharField(max_length=10)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name', 'mobile_number']

    # Add unique related_name for groups and user_permissions
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',
        related_query_name='customuser',
        blank=True,
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_set',
        related_query_name='customuser',
        blank=True,
        verbose_name='user permissions',
    )

    def __str__(self):
        return self.username + "->" + self.first_name + self.last_name + "->" + self.email + "->" + self.mobile_number + "-> " + self.password
