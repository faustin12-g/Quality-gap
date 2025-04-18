from pyexpat import model
from django.db import models
from  django.contrib.auth.models import AbstractUser
from django.db.models.signals import pre_save
from django.contrib.auth.hashers import make_password,check_password
from django.dispatch import receiver
import datetime
# Create your models here.
role_choices = [
    ('guest', 'guest'),
    ('student', 'Student'),
    ('parent', 'Parent'),
    ('school_admin', 'School Admin')
]

class  User(AbstractUser):
      username = models.CharField(max_length=50)
      role = models.CharField(max_length=20, choices=role_choices, default='guest')
      email = models.EmailField(max_length=255,unique=True)
      first_name = models.CharField(max_length=50,)
      last_name = models.CharField(max_length=50,)
      USERNAME_FIELD = 'email'
      REQUIRED_FIELDS = ['username']


class District(models.Model):
      name=models.CharField(max_length=200)
            
      def __str__(self):
            return self.name





class Parents(models.Model):
    firstName = models.CharField(max_length=200)
    lastName = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.firstName} {self.lastName}"



class District(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class School(models.Model):
    code = models.CharField(max_length=10, unique=True, blank=True)
    name = models.CharField(max_length=200)
    district = models.ForeignKey(District, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    def generate_school_code(self):
        # Get the total number of schools in the system to create a unique code
        school_count = School.objects.count() + 1
        # Generate a school code like SCH0001, SCH0002, etc.
        school_code = f"SCH{str(school_count).zfill(4)}"
        return school_code

    def save(self, *args, **kwargs):
        if not self.code:
            self.code = self.generate_school_code()  # Generate the code before saving
        super().save(*args, **kwargs)




class SchoolAccess(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    school_password = models.CharField(max_length=128)  # hashed
    is_active = models.BooleanField(default=True)

    def set_password(self, raw_password):
        self.school_password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.school_password)


class Parents(models.Model):
    firstName = models.CharField(max_length=200)
    lastName = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.firstName} {self.lastName}"


level_choices = [
    ('Advanced ', 'Advanced '),
    ('Ordinary ', 'Ordinary '),
    ]

class Levels(models.Model):
    name = models.CharField(max_length=200, choices=level_choices,default='Advanced ')
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    def __str__(self):
        return self.name


class Class(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    name = models.CharField(max_length=100) 
    level=models.ForeignKey(Levels, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} - {self.school.name}"

class Students(models.Model):
    parent = models.ForeignKey(Parents, on_delete=models.CASCADE)
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    class_name = models.ForeignKey(Class, on_delete=models.CASCADE)
    studentNumber = models.CharField(max_length=20, unique=True, blank=True)
    level=models.ForeignKey(Levels, on_delete=models.CASCADE,null=True,blank=True)
    firstName = models.CharField(max_length=200)
    lastName = models.CharField(max_length=200)
    dateOfBirth = models.DateField()
    gender = models.CharField(max_length=10)

    def generate_student_number(self):
        current_year = datetime.datetime.now().year
        school_code = self.school.code
        count = Students.objects.filter(school=self.school).count() + 1
        student_number = f"{current_year}{school_code}{str(count).zfill(4)}"
        return student_number

    def save(self, *args, **kwargs):
        if not self.studentNumber:
            self.studentNumber = self.generate_student_number()  # Generate student number before saving
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.firstName} {self.lastName}"








class DisciplineRecord(models.Model):
    student = models.ForeignKey(Students, on_delete=models.CASCADE, related_name='discipline_history')
    deduction_amount = models.PositiveIntegerField()
    reason = models.CharField(max_length=255)
    remarks = models.TextField(blank=True, null=True)
    date = models.DateTimeField(auto_now_add=True)
    recorded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    def get_recorded_by_name(self, obj):
        user = obj.recorded_by
        return f"{user.first_name} {user.last_name}" if user else None

class StudentDisciplinemanagement(models.Model):
            student = models.OneToOneField(Students, on_delete=models.CASCADE)
            student_descipline_marks = models.IntegerField(default=40)
            def deduct_marks(self, deduction_amount, reason="", remarks="", recorded_by=None):
                if deduction_amount > self.student_descipline_marks:
                    raise ValueError("Cannot deduct more than the current marks")

                self.student_descipline_marks -= deduction_amount
                self.save()

                DisciplineRecord.objects.create(
                    student=self.student,
                    deduction_amount=deduction_amount,
                    reason=reason,
                    remarks=remarks,
                    recorded_by=recorded_by
                )

            
          
class DisciplineHistory(models.Model):
    student_discipline = models.ForeignKey(StudentDisciplinemanagement, on_delete=models.CASCADE,related_name='discipline_history')
    reason = models.TextField()
    points_deducted = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)





class RequestedMembership(models.Model):
      user=models.ForeignKey(User, on_delete=models.CASCADE)
      phone_number=models.CharField(max_length=20)
      school=models.ForeignKey(School, on_delete=models.CASCADE)
      district=models.ForeignKey(District, on_delete=models.CASCADE)
      description=models.TextField()
      date_requested=models.DateTimeField(auto_now_add=True)
      status=models.CharField(max_length=20, choices=[('pending', 'pending'), ('approved', 'approved'), ('rejected','rejected')], default='pending')

      def __str__(self):
            return f"{self.user.first_name} {self.user.last_name} requested for membership in {self.school.name}."

    



class CustomerHelp(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Resolved', 'Resolved'),
    ]
    
    name = models.CharField(max_length=100)
    email = models.EmailField()
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    replies = models.JSONField(default=list)  # Stores array of reply strings
    
    def __str__(self):
        return f"Help request from {self.name} - {self.status}"
    






class Subject(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10)

    def __str__(self):
        return self.name

class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    subjects = models.ManyToManyField(Subject)

    def __str__(self):
        return self.user.get_full_name()

class Lesson(models.Model):
    school_class = models.ForeignKey(Class, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    teacher = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True)
    day = models.CharField(max_length=10, choices=[
        ("Monday", "Monday"),
        ("Tuesday", "Tuesday"),
        ("Wednesday", "Wednesday"),
        ("Thursday", "Thursday"),
        ("Friday", "Friday"),
        ("Saturday", "Saturday")
    ])
    start_time = models.TimeField()
    end_time = models.TimeField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="lessons_created")

    class Meta:
        unique_together = ('school_class', 'day', 'start_time')

    def __str__(self):
        return f"{self.subject.name} - {self.school_class.name} on {self.day}"

    
    



    
            
        