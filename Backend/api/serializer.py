from rest_framework import serializers
from gap.models import User, School,District,Students,RequestedMembership,CustomerHelp

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



class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Students
        fields = ['id', 'parent', 'firstName','studentNumber','school' ,'lastName', 'dateOfBirth', 'gender']
        extra_kwargs = {"id": {"read_only": True}}
        



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


