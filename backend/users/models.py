from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)


    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # Можете вказати будь-які інші поля, які необхідно заповнити при створенні користувача

    def __str__(self):
        return self.email
