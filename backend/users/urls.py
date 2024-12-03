from django.urls import path
from .views import RegisterUserView, LoginView, RefreshTokenView, UserView

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', RefreshTokenView.as_view(), name='refresh'),
    path('user/', UserView.as_view(), name='getUser'),
]