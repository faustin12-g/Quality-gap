from datetime import timezone
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
from gap.models import User, School,District,Students,RequestedMembership,CustomerHelp,SchoolAccess
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
class SchoolListView(APIView):
    def get(self, request):
        district_id = request.query_params.get('district_id')
        
        if district_id:
            try:
                schools = School.objects.filter(district__id=int(district_id))
                print(f"Found {schools.count()} schools for district {district_id}")
            except ValueError:
                return Response({"error": "Invalid district_id"}, status=400)
        else:
            schools = School.objects.all()
            
        serializer = SchoolSerializer(schools, many=True)
        return Response(serializer.data)







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
    







from django.template.loader import render_to_string
from django.utils.html import strip_tags
import secrets

from django.contrib.auth.hashers import make_password
from django.db import transaction

@api_view(['POST'])
def approve_membership(request):
    request_id = request.data.get('request_id')
    try:
        # Log the request ID for debugging
        print(f"Confirming membership for request ID: {request_id}")

        membership_request = RequestedMembership.objects.get(id=request_id)

        # Get the existing school selected by the user
        school = School.objects.get(name=membership_request.school, district=membership_request.district)

        # Mark the membership request as approved
        membership_request.status = 'approved'
        membership_request.save()

        # ✅ Ensure SchoolAccess exists
        try:
            with transaction.atomic():
                school_access, created = SchoolAccess.objects.get_or_create(
                    user=membership_request.user,
                    school=school,
                )
                if not created:
                    print(f"SchoolAccess for user {membership_request.user.username} already exists for {school.name}")
        except Exception as e:
            return Response({'error': f"Error creating SchoolAccess: {str(e)}"}, status=500)

        # Create email content
        subject = f"Your School Account for {school.name} Has Been Approved"
        message = f"""
        Dear {membership_request.user.username},

        Your request to register {school.name} has been approved!

        Here is your School Code: {school.code}

        Please login at: http://localhost:5173/school-passwrd?code={school.code}

        You will be prompted to set your password after logging in.

        If you didn't request this, please contact us immediately.

        Best regards,  
        Nexius Company Ltd Support Team
        """

        # Send email with error handling
        try:
            send_mail(
                subject,
                message.strip(),
                'ismailgihozo@gmail.com',
                [membership_request.user.email],
                fail_silently=False,
            )
        except Exception as e:
            return Response({'error': f'Error sending email: {str(e)}'}, status=500)

        return Response({
            'success': True,
            'school_code': school.code,
            'message': 'Membership approved and school code sent via email'
        })

    except RequestedMembership.DoesNotExist:
        return Response({'error': 'Request not found'}, status=404)
    except School.DoesNotExist:
        return Response({'error': 'Selected school does not exist'}, status=404)
    except Exception as e:
        # Log the full error for debugging
        print(f"Unexpected error: {e}")
        return Response({'error': f"Unexpected error: {str(e)}"}, status=500)








@api_view(['POST'])
def reject_membership(request):
    request_id = request.data.get('request_id')
    try:
        membership_request = RequestedMembership.objects.get(id=request_id)
        membership_request.status = 'rejected'
        membership_request.save()

        # Send rejection email
        subject = f"Your School Registration Request for {membership_request.school} Was Rejected"
        message = f"""
        Dear {membership_request.user.username},

        Unfortunately, your request to register the school "{membership_request.school}" in {membership_request.district} has been rejected.

        If you believe this was a mistake or you have any questions, please contact our support team.

        Best regards,  
        Nexius Company Ltd Support Team
        """

        send_mail(
            subject,
            message.strip(),
            'ismailgihozo@gmail.com',  # from email
            [membership_request.user.email],  # to email
            fail_silently=False,
        )

        return Response({'success': True, 'message': 'Membership request rejected and email sent'})

    except RequestedMembership.DoesNotExist:
        return Response({'error': 'Request not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)   





from django.contrib.auth import get_user_model

User = get_user_model()

@api_view(['POST'])
def set_school_password(request):
    school_code = request.data.get('school_code')
    password = request.data.get('password')

    if not all([school_code, password]):
        return Response({'error': 'Missing required fields'}, status=400)

    try:
        # Get the SchoolAccess object based on school_code
        access = SchoolAccess.objects.get(school__code=school_code)

        # Set the new password for the user associated with the school access
        access.set_password(password)
        access.save()

        return Response({'message': 'Password set successfully'})
    except SchoolAccess.DoesNotExist:
        return Response({'error': 'School access not found for this user'}, status=404)






@api_view(['POST'])
def school_login(request):
    school_code = request.data.get('school_code')
    password = request.data.get('password')

    if not school_code or not password:
        return Response({'error': 'School code and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Get the school by school_code
        school = School.objects.get(code=school_code)

        # Check if a user has access to this school
        access = SchoolAccess.objects.get(school=school)

        # Authenticate using the user's school password
        if not access.check_password(password):
            return Response({'error': 'Invalid school password'}, status=status.HTTP_401_UNAUTHORIZED)

        # Generate JWT token (if needed for further API calls)
        user = access.user
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        school_data = {
            'name': school.name,
            'code': school.code,
            'district': school.district.name,
        }

        return Response({
            'success': True,
            'token': access_token,
            'school': school_data,
            'user': {
                'username': user.username,
                'email': user.email,
            },
        })

    except School.DoesNotExist:
        return Response({'error': 'Invalid school code'}, status=status.HTTP_404_NOT_FOUND)
    except SchoolAccess.DoesNotExist:
        return Response({'error': 'No access found for this school'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)