from django.shortcuts import render
from rest_framework import status

from api.serializer import UserSerializer, SchoolSerializer, DistrictSerializer,StudentSerializer
from rest_framework import generics,permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from gap.models import User, School,District,Students


class SchoolList(generics.ListCreateAPIView):
        queryset = School.objects.all()
        serializer_class = SchoolSerializer


class StudentList(generics.ListCreateAPIView):
        queryset = Students.objects.all()
        serializer_class = StudentSerializer
        
       



class CreateUserView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        



from rest_framework_simplejwt.tokens import RefreshToken

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Authenticate using email as username
        user = authenticate(username=email, password=password)
        
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            }, status=status.HTTP_200_OK)
        
        return Response(
            {'detail': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )

class LogoutView(APIView):
      permission_classes = [IsAuthenticated]
      def post(self, request, format=None):
            logout(request)
            return Response({'message': 'User logged out successfully'}, status=status.HTTP_200_OK)

       

        
        



# Create your views here.
