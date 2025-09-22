from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated, AllowAny
# Create your views here.
from rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework.response import Response 
from .serializers import RegisterSerializer, LoginSerializer
from django.contrib.auth import logout, authenticate
from rest_framework_simplejwt.tokens import RefreshToken
class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer=RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)

            return Response({
                "user": serializer.data,
                "refresh":str(refresh),
                "access":str(refresh.access_token)
            },status=status.HTTP_201_CREATED) 
        
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if  serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            user = authenticate(username = username, password = password)
            if user:
                token = RefreshToken.for_user(user)
                return Response({
                    "user":{"id":user.id, "username": user.username},
                    "refresh":str(token),
                    "access":str(token.access_token)
                },status=status.HTTP_200_OK)
            return Response({"error":"Invalid credintials"},status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            refresh = RefreshToken.for_user(request.data['refresh'])
            token= RefreshToken(refresh)
            token.blacklist()
            return Response({"message":"logged out successfully"},status=status.HTTP_200_OK)
        except Exception:
            return Response({"error":"Invalid credintials"},status=status.HTTP_400_BAD_REQUEST)
