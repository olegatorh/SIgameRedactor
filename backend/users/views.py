import os
from os import access

from drf_spectacular.utils import extend_schema
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken

from .serializers import UserSerializer, LoginSerializer, TokenSerializer
from rest_framework_simplejwt.tokens import RefreshToken

DEBUG = os.getenv('DEBUG')


class RegisterUserView(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

    @extend_schema(
        summary="Реєстрація нового користувача",
        description="Цей ендпоїнт дозволяє зареєструвати нового користувача.",
        request=UserSerializer,  # Вхідні дані (дані запиту)
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class LoginView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer
    @extend_schema(
        summary="Login",
        request=LoginSerializer,
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)

            response = Response({
                'message': 'Login successful',
            }, status=status.HTTP_200_OK)


            response.set_cookie(
                key='refresh_token',
                value=str(refresh),
                httponly=True,
                secure=True,
                samesite='None',
            )

            response.set_cookie(
                key='access_token',
                value=str(refresh.access_token),
                httponly=True,
                secure=True,
                samesite='None',
            )
            print(response)
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RefreshTokenView(APIView):
    permission_classes = (AllowAny,)

    @extend_schema(
        summary="refresh token",
        request=TokenSerializer,
    )
    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")
        if refresh_token is None:
            return Response({"error": "Refresh token is required"}, status=status.HTTP_403_FORBIDDEN)
        try:
            refresh = RefreshToken(refresh_token)
            if BlacklistedToken.objects.filter(token__jti=refresh['jti']).exists():
                return Response({"error": "Token is blacklisted"}, status=status.HTTP_403_FORBIDDEN)

            access_token = refresh.access_token
            response = Response({"access_token": str(access_token)})
            response.set_cookie(
                key='access_token',
                value=str(access_token),
                httponly=True,
                secure=True,
                samesite='None',
            )
            return response
        except Exception as e:
            return Response({"error": "Invalid refresh token"}, status=403)


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        response = Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        response.delete_cookie('refresh_token', path='/')
        response.delete_cookie('access_token', path='/')

        return response

class UserView(APIView):
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)


class UserDetailView(generics.RetrieveUpdateAPIView):
    User = get_user_model()
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'pk'


