
from django.urls import path
from rest_framework_simplejwt.views import ( # type: ignore
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (Customerhelpview, SchoolListView,CreateUserView,LoginView,DistrictViewSet,CurrentUserView,
                    CurrentUserView,GetAllRequestedMemberships,CustomerHelpReply,AllRequestedCustomerHelp,
                    RequestedMembershipViewSet, approve_membership, delete_help_request, reject_membership,school_login,set_school_password)

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('schools/',SchoolListView .as_view(), name='school_list'),
    path('register/',CreateUserView.as_view(), name='register'),
    path('login/',LoginView.as_view(), name='login'),
    path('districts/', DistrictViewSet.as_view({'get': 'list'}), name='district_list'),
    # path('schools/', SchoolViewSet.as_view({'get': 'list'}), name='school_list'),
    path('current_user/', CurrentUserView.as_view(), name='current_user'),
    path('requested_memberships/', RequestedMembershipViewSet.as_view({'get': 'list', 'post': 'create'}), name='requested_membership_list'),
    path('requested_memberships/all/', GetAllRequestedMemberships.as_view(), name='all_requested_memberships'),
    path("customerhelpcenter/",Customerhelpview,name="help"),
       path('customerhelp/', AllRequestedCustomerHelp.as_view(), name='customer-help-list'),
    path('customerhelp/<int:pk>/', AllRequestedCustomerHelp.as_view(), name='customer-help-detail'),
    path('customerhelp/<int:pk>/reply/', CustomerHelpReply.as_view(), name='customer-help-reply'),

path('deletehelprequest/<int:pk>/', delete_help_request, name='delete_help_request'),
path('approve-membership/', approve_membership, name='approve-membership'),
path('reject-membership/', reject_membership, name='reject-membership'),
path('set-school-password/', set_school_password, name='set-school-password'),
path('school-login/', school_login, name='school-login'),

    # path('api/reject_membership/', RejectMembershipView.as_view(), name='reject_membership'),
]