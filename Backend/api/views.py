from datetime import timezone
from urllib.parse import unquote
from django.core.mail import EmailMessage
from django.shortcuts import render
from rest_framework import status
from django.core.mail import send_mail
from api.serializer import (StudentReadSerializer, StudentWriteSerializer, UserSerializer, 
                            SchoolSerializer,
                              DistrictSerializer,
                              DisciplineRecordSerializer,
                              StudentDisciplineHistorySerializer,
                              LevelsSerializer,
                              ParentsSerializer,
                              ClassSerializer,
                              SubjectSerializer,
                              TeacherSerializer,
                              RequestedMembershipSerializer,
                              CustomerHelpSerializer,
                              )
from rest_framework import generics,permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from gap.models import Class, Levels, Parents, User, StudentDisciplinemanagement, School,District,Students,RequestedMembership,CustomerHelp,SchoolAccess
from rest_framework import viewsets


class SchoolList(generics.ListCreateAPIView):
        queryset = School.objects.all()
        serializer_class = SchoolSerializer


class StudentList(generics.ListCreateAPIView):
        queryset = Students.objects.all()
        serializer_class = StudentReadSerializer
        
       



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
    


class StudentView(APIView):
    def get(self, request, name):  # Now using 'name' in the URL
        try:
            school = School.objects.get(name=name)  # Querying by school name
        except School.DoesNotExist:
            return Response({"error": "School not found"}, status=status.HTTP_404_NOT_FOUND)

        students = Students.objects.filter(school=school)
        serializer = StudentReadSerializer(students, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    



class AddStudentView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, name):
        try:
            decoded_name = unquote(name)
            try:
                school = School.objects.get(name=decoded_name)
            except School.DoesNotExist:
                return Response({"error": f"School '{decoded_name}' not found"}, status=status.HTTP_404_NOT_FOUND)

            data = request.data.copy()
            data['school'] = school.id

            # ✅ Handle Parent
            parent_full_name = data.get('parentName', '')
            parent_first, parent_last = parent_full_name.strip().split(' ', 1) if ' ' in parent_full_name else (parent_full_name.strip(), '')

            parent, _ = Parents.objects.get_or_create(
                firstName=parent_first,
                lastName=parent_last
            )
            data['parent'] = parent.id

            # ✅ Handle Level
            level_name = data.get('level', '').strip()
            if not level_name:
                return Response({"error": "Level is required."}, status=status.HTTP_400_BAD_REQUEST)

            level, _ = Levels.objects.get_or_create(name=level_name, school=school)
            data['level'] = level.id

            # ✅ Handle Class
            class_name_value = data.get('className', '').strip()
            if not class_name_value:
                return Response({"error": "Class name is required."}, status=status.HTTP_400_BAD_REQUEST)

            class_obj, _ = Class.objects.get_or_create(name=class_name_value, school=school, level=level)
            data['class_name'] = class_obj.id

            # ✅ Now validate and save student
            serializer = StudentWriteSerializer(data=data)
            if serializer.is_valid():
                student = serializer.save()
                read_serializer = StudentReadSerializer(student)
                return Response(read_serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        



class EditStudentView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, name, pk):
        """Handle GET request to retrieve student data for editing"""
        try:
            decoded_name = unquote(name)
            try:
                school = School.objects.get(name=decoded_name)
            except School.DoesNotExist:
                return Response({"error": f"School '{decoded_name}' not found"}, status=status.HTTP_404_NOT_FOUND)

            try:
                student = Students.objects.get(id=pk, school=school)
                serializer = StudentReadSerializer(student)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Students.DoesNotExist:
                return Response({"error": f"Student with ID {pk} not found in school '{decoded_name}'"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def patch(self, request, name, pk):
        """Handle PATCH request to update student data"""
        try:
            decoded_name = unquote(name)
            try:
                school = School.objects.get(name=decoded_name)
            except School.DoesNotExist:
                return Response({"error": f"School '{decoded_name}' not found"}, status=status.HTTP_404_NOT_FOUND)

            try:
                student = Students.objects.get(id=pk, school=school)
            except Students.DoesNotExist:
                return Response({"error": f"Student with ID {pk} not found in school '{decoded_name}'"}, status=status.HTTP_404_NOT_FOUND)
            
            data = request.data.copy()
            data['school'] = school.id

            # Handle Parent
            parent_full_name = data.get('parentName', '')
            if parent_full_name:  # Only update parent if provided
                parent_first, parent_last = parent_full_name.strip().split(' ', 1) if ' ' in parent_full_name else (parent_full_name.strip(), '')
                parent, _ = Parents.objects.get_or_create(
                    firstName=parent_first,
                    lastName=parent_last
                )
                data['parent'] = parent.id

            # Handle Level
            level_name = data.get('level', '').strip()
            if level_name:  # Only update level if provided
                level, _ = Levels.objects.get_or_create(name=level_name, school=school)
                data['level'] = level.id

            # Handle Class
            class_name_value = data.get('className', '').strip()
            if class_name_value:  # Only update class if provided
                # Get level from data or existing student
                level_id = data.get('level', student.level.id if student.level else None)
                if not level_id:
                    return Response({"error": "Level is required when updating class."}, status=status.HTTP_400_BAD_REQUEST)
                
                level = Levels.objects.get(id=level_id)
                class_obj, _ = Class.objects.get_or_create(
                    name=class_name_value, 
                    school=school, 
                    level=level
                )
                data['class_name'] = class_obj.id

            # Now validate and save student
            serializer = StudentWriteSerializer(student, data=data, partial=True)
            if serializer.is_valid():
                student = serializer.save()
                read_serializer = StudentReadSerializer(student)
                return Response(read_serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        






class DeleteStudentView(APIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, name, pk):
        """Handle DELETE request to delete a student"""
        try:
            decoded_name = unquote(name)
            try:
                school = School.objects.get(name=decoded_name)
            except School.DoesNotExist:
                return Response({"error": f"School '{decoded_name}' not found"}, status=status.HTTP_404_NOT_FOUND)

            try:
                student = Students.objects.get(id=pk, school=school)
                student.delete()
                return Response({"message": f"Student with ID {pk} deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
            except Students.DoesNotExist:
                return Response({"error": f"Student with ID {pk} not found in school '{decoded_name}'"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


# views.py
from django.contrib.auth import get_user_model

User = get_user_model()

class DeductDisciplineMarksView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, name, pk):
        try:
            decoded_name = unquote(name)
            school = School.objects.get(name=decoded_name)
        except School.DoesNotExist:
            return Response({"error": f"School '{decoded_name}' not found"}, status=status.HTTP_404_NOT_FOUND)

        try: 
            student = Students.objects.get(id=pk, school=school)
        except Students.DoesNotExist:
            return Response({"error": "Student not found in this school"}, status=status.HTTP_404_NOT_FOUND)

        # Get or create the discipline record for the student
        discipline_mgmt, created = StudentDisciplinemanagement.objects.get_or_create(student=student)

        deduction_amount = request.data.get("deductionAmount")
        reason = request.data.get("reason", "")
        remarks = request.data.get("remarks", "")

        if deduction_amount is None:
            return Response({"error": "Deduction amount is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            deduction_amount = int(deduction_amount)
            if deduction_amount < 1:
                raise ValueError("Invalid deduction amount")
        except ValueError:
            return Response({"error": "Deduction amount must be a positive integer"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            discipline_mgmt.deduct_marks(
                deduction_amount=deduction_amount,
                reason=reason,
                remarks=remarks,
                recorded_by=request.user
            )
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "success": f"{deduction_amount} marks deducted from {student.firstName} {student.lastName}",
            "remainingMarks": discipline_mgmt.student_descipline_marks
        }, status=status.HTTP_200_OK)
    


class StudentDisciplineHistoryView(generics.ListAPIView):
    """
    GET /api/schools/{schoolName}/students/{pk}/discipline-history/
    """
    serializer_class   = DisciplineRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # 1) Decode & fetch school
        name   = unquote(self.kwargs['name'])
        school = School.objects.get(name=name)

        # 2) Fetch that student
        student = Students.objects.get(
            pk      = self.kwargs['pk'],
            school  = school
        )

        # 3) Return all their DisciplineRecord via the related_name
        return student.discipline_history.all().order_by('-date')

    def list(self, request, *args, **kwargs):
        try:
            return super().list(request, *args, **kwargs)
        except School.DoesNotExist:
            return Response(
                {"error": "School not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Students.DoesNotExist:
            return Response(
                {"error": "Student not found in this school"},
                status=status.HTTP_404_NOT_FOUND
            )