from rest_framework import serializers
from gap.models import (User, School,District,Students,RequestedMembership,CustomerHelp,Levels,
                        Parents,Class,Subject,DisciplineRecord,
                        
                        Teacher,Lesson,StudentDisciplinemanagement)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'role', 'first_name', 'last_name', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
            'id': {'read_only': True},
            'role': {'read_only': True}  # Remove this if you want to allow role setting during registration
        }
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user
    


class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ['id', 'name', 'district']
class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = ['id', 'name']
        extra_kwargs ={"id": {"read_only": True}}



class LevelsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Levels
        fields = ['id', 'name']
        extra_kwargs = {"id": {"read_only": True}}
class ParentsSerializer(serializers.ModelSerializer):
    class Meta:
                model = Parents
                fields = ['id', 'firstName', 'lastName']
                extra_kwargs = {"id": {"read_only": True}}


class ClassSerializer(serializers.ModelSerializer):
    level=LevelsSerializer()
    class Meta:
        model = Class
        fields = ['id', 'name', 'level']
        extra_kwargs = {"id": {"read_only": True}}

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name', 'code']
        extra_kwargs = {"id": {"read_only": True}}

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ['id', 'user', 'school','subjects']
        extra_kwargs = {"id": {"read_only": True}}


class StudentReadSerializer(serializers.ModelSerializer):
    level = LevelsSerializer(read_only=True)
    parent = ParentsSerializer(read_only=True)
    class_name = ClassSerializer(read_only=True)
    school = SchoolSerializer(read_only=True)
    disciplineMarks = serializers.IntegerField(
        source='studentdisciplinemanagement.student_descipline_marks',
        read_only=True
    )
    class Meta:
        model = Students
        fields = ['id', 'parent', 'level', 'disciplineMarks', 'class_name',"school","studentNumber", 'firstName', 'lastName', 'dateOfBirth', 'gender']
        extra_kwargs = {"id": {"read_only": True}}

class StudentWriteSerializer(serializers.ModelSerializer):
    level = serializers.PrimaryKeyRelatedField(queryset=Levels.objects.all())
    parent = serializers.PrimaryKeyRelatedField(queryset=Parents.objects.all())
    class_name = serializers.PrimaryKeyRelatedField(queryset=Class.objects.all())
    school = serializers.PrimaryKeyRelatedField(queryset=School.objects.all())

    class Meta:
        model = Students
        fields = ['id', 'parent', 'level', 'class_name', 'school', 'firstName', 'lastName', 'dateOfBirth', 'gender']
        extra_kwargs = {
            'id': {'read_only': True},
            'parent': {'required': True},
            'level': {'required': True},
            'class_name': {'required': True},
            'school': {'required': True}
        }

    def validate_level(self, value):
        if not Levels.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Selected level does not exist.")
        return value

    # Additional validation methods can be added similarly


# serializers.py
class DisciplineRecordSerializer(serializers.ModelSerializer):
    recorded_by = serializers.SerializerMethodField()

    class Meta:
        model = DisciplineRecord
        fields = ['id', 'deduction_amount', 'reason', 'remarks', 'date', 'recorded_by']

    def get_recorded_by(self, obj):
        user = obj.recorded_by
        if not user:
            return None
        return f"{user.first_name} {user.last_name}"


class StudentDisciplineHistorySerializer(serializers.ModelSerializer):
    discipline_history = DisciplineRecordSerializer(many=True, read_only=True, source='discipline_records')
    
    class Meta:
        model = Students
        fields = ['id', 'firstName', 'lastName', 'discipline_history']


class DistrictListSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = ['id', 'name']
        extra_kwargs = {"id": {"read_only": True}}


class SchoolSerializer(serializers.ModelSerializer):
    district = DistrictSerializer(read_only=True)
    district_id = serializers.PrimaryKeyRelatedField(
        queryset=District.objects.all(),
        source='district',
        write_only=True
    )

    class Meta:
        model = School
        fields = ['id', 'code', 'name', 'district', 'district_id']



class RequestedMembershipSerializer(serializers.ModelSerializer):
    # Adding 'name' and 'email' fields by accessing the user model (assuming user is a foreign key to the User model)
    name = serializers.CharField(source='user.get_full_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    # Nested serializer for district and school (assuming they are related fields)
    district_name = serializers.CharField(source='district.name', read_only=True)
    school_name = serializers.CharField(source='school.name', read_only=True)

    class Meta:
        model = RequestedMembership
        fields = ['id', 'user', 'phone_number', 'description', 'date_requested', 'status', 'district', 'school', 'name', 'email', 'district_name', 'school_name']
        read_only_fields = ['id', 'user', 'date_requested', 'status']

class CustomerHelpSerializer (serializers.ModelSerializer):
    class Meta:
        model=CustomerHelp
        fields='__all__'
        extra_kwargs={"id":{"read_only":True}}       


