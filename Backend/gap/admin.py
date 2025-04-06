from django.contrib import admin
from .models import User, District, School, Parents, Students,RequestedMembership,CustomerHelp

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'username', 'first_name', 'last_name', 'is_active', 'is_staff', 'is_superuser')
    list_filter = ('is_active', 'is_staff', 'is_superuser')
    search_fields = ('email', 'username', 'first_name', 'last_name')


@admin.register(District)
class DistrictAdmin(admin.ModelAdmin):
    list_display = ('name',)


@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    list_display = ('name', 'district', 'code')
    list_filter = ('district',)

    def save_model(self, request, obj, form, change):
        if not obj.code:
            obj.code = obj.generate_school_code()  # Ensure the school code is generated before saving
        super().save_model(request, obj, form, change)


@admin.register(Parents)
class ParentsAdmin(admin.ModelAdmin):
    list_display = ('firstName', 'lastName')


@admin.register(Students)
class StudentsAdmin(admin.ModelAdmin):
    list_display = ('studentNumber', 'firstName', 'lastName', 'dateOfBirth', 'gender')
    list_filter = ('gender',)
    search_fields = ('firstName', 'lastName', 'dateOfBirth')

    def save_model(self, request, obj, form, change):
        if not obj.studentNumber:
            obj.studentNumber = obj.generate_student_number()  # Ensure the student number is generated before saving
        super().save_model(request, obj, form, change)


@admin.register(RequestedMembership)
class RequestedMembershipAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone_number', 'description', 'date_requested','status')
    list_filter = ('status',)
    search_fields = ('user__email', 'user__username', 'phone_number', 'description')
    def save_model(self, request, obj, form, change):
        if not obj.status:
            obj.status = 'pending'  # Ensure the status is set to pending by default
            super().save_model(request, obj, form, change)
        else:
                super().save_model(request, obj, form, change)


@admin.register(CustomerHelp)
class CustomerAdminsupport(admin.ModelAdmin):
    list_display=["name","email","description"]
    list_filter=["email"]
                    

