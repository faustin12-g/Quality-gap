from django.core.mail import EmailMessage
from django.shortcuts import render
from rest_framework import status
from django.core.mail import send_mail
from api.serializer import (UserSerializer, 
                            
                            SchoolSerializer,
                              DistrictSerializer,
                              RequestedMembershipSerializer,
                              CustomerHelpSerializer,
                              StudentSerializer)
from rest_framework import generics,permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from gap.models import User, School,District,Students,RequestedMembership,CustomerHelp
from rest_framework import viewsets


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
                'refresh': str(refresh),
                'username': user.username,
            }, status=status.HTTP_200_OK)
        
        return Response(
            {'detail': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )



class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
         serializer = UserSerializer(request.user)
         return Response(serializer.data)

       



class DistrictViewSet(viewsets.ModelViewSet):
    queryset = District.objects.all()
    serializer_class = DistrictSerializer



import logging

logger = logging.getLogger(__name__)

class SchoolViewSet(viewsets.ModelViewSet):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        district_id = self.request.query_params.get('district_id')
        logger.debug(f"Received district_id: {district_id}")
        if district_id:
            try:
                district_id_int = int(district_id)
                # Filter using the nested relation field lookup
                queryset = queryset.filter(district__id=district_id_int)
            except ValueError:
                logger.error(f"Invalid district_id: {district_id}")
        return queryset




class RequestedMembershipViewSet(viewsets.ModelViewSet):
    queryset = RequestedMembership.objects.all()
    serializer_class = RequestedMembershipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        


class GetAllRequestedMemberships(APIView):
    def get(self, request):
        memberships = RequestedMembership.objects.all()
        serializer = RequestedMembershipSerializer(memberships, many=True)
        return Response(serializer.data)
       
     

@api_view(["POST"])
def Customerhelpview(request):
    serializer=CustomerHelpSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,200)
    return Response(serializer.errors,401)



class AllRequestedCustomerHelp(APIView):
    def get(self, request):
        help = CustomerHelp.objects.all().order_by('-id')  # Newest first
        serializer = CustomerHelpSerializer(help, many=True)
        return Response(serializer.data)

    def patch(self, request, pk):
        try:
            help_request = CustomerHelp.objects.get(pk=pk)
            serializer = CustomerHelpSerializer(help_request, data=request.data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except CustomerHelp.DoesNotExist:
            return Response(
                {"error": "Help request not found"},
                status=status.HTTP_404_NOT_FOUND
            )

class CustomerHelpReply(APIView):
    def post(self, request, pk):
        try:
            help_request = CustomerHelp.objects.get(pk=pk)
            reply_text = request.data.get('reply', '')

            if not reply_text:
                return Response(
                    {"error": "Reply text is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Append the reply to existing replies
            current_replies = help_request.replies if help_request.replies else []
            updated_replies = current_replies + [reply_text]

            # Update the help request
            help_request.replies = updated_replies
            help_request.status = 'Resolved'
            help_request.save()

            # Prepare the plain text message
            message = f"""
            Hello,

            This is a response to your support request:

            Your message:
            {help_request.description}

            Our reply:
            {reply_text}

            Best regards,
            NEXUS Support Team
            """

            # Send the reply via plain text email
            email = EmailMessage(
                subject="Response to your support request",
                body=message,  # Plain text body
                from_email="ismailgihozo@gmail.com",
                to=[help_request.email]
            )

            email.send(fail_silently=False)

            serializer = CustomerHelpSerializer(help_request)
            return Response(serializer.data)

        except CustomerHelp.DoesNotExist:
            return Response(
                {"error": "Help request not found"},
                status=status.HTTP_404_NOT_FOUND
            )


# views.py


@api_view(["DELETE"])

def delete_help_request(request, pk):
    try:
        help_request = CustomerHelp.objects.get(pk=pk)
        help_request.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except CustomerHelp.DoesNotExist:
        return Response(
            {"error": "Help request not found"},
            status=status.HTTP_404_NOT_FOUND
            )
    
       
# Create your views here.
