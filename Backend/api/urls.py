
from django.urls import path
from rest_framework_simplejwt.views import ( # type: ignore
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import SchoolList,CreateUserView,LogingView

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('schools/', SchoolList.as_view(), name='school_list'),
    path('register/',CreateUserView.as_view(), name='register'),
    path('login/',LogingView.as_view(), name='login')
]