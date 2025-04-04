from django.db import models
from  django.contrib.auth.models import AbstractUser
from django.db.models.signals import pre_save
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


class Parents(models.Model):
    firstName = models.CharField(max_length=200)
    lastName = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.firstName} {self.lastName}"


class Students(models.Model):
    parent = models.ForeignKey(Parents, on_delete=models.CASCADE)
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    studentNumber = models.CharField(max_length=20, unique=True, blank=True)
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
    



