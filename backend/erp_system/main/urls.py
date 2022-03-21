from django.urls import path
from rest_framework.routers import DefaultRouter

from . import views as view

router = DefaultRouter()
router.register(r'companies', view.CompanyViewSet, basename='Company')


urlpatterns = [
    # URLs for Admin to verify User
    path('users/', view.ListNotVerifiedUsersView.as_view()),
    path('users/<int:pk>/', view.RetrieveNotVerifiedUserView.as_view()),

    # URLs for Manager of Company
    path('company/', view.CompanyRetrieveView.as_view()),
    path('company/users/',view.ListUserFromCompanyView.as_view()),
    path('company/users/<int:pk>/',view.DetailUserFromCompanyView.as_view()),
    path('company/users/<int:pk>/documents/',view.DetailDocumentUserForManagerView.as_view()),
    path('company/users/<int:pk>/contract/', view.CreateContractView.as_view()),
    path('company/users/<int:pk>/contract/preview/', view.PreviewContractForUser.as_view()),
    path('company/users/<int:pk>/comment/', view.CreateCommentView.as_view()),
    path('company/users/comment/<int:pk>/', view.DeleteCommentView.as_view()),
    path('company/users/<int:pk>/about/', view.EditAboutFieldView.as_view()),
    
    # URLs for manage User model
    path('user/',view.CurrentUserView.as_view()),
    path('user/update/',view.UpdateLoginUserView.as_view()),
    path('user/change_password/', view.UpdateUserPasswordView.as_view()),
    path('user/contract/', view.ConfirmContractbyUser.as_view()),
    path('company_subscribe/', view.SubscribeCompanyView.as_view()),

    # URLs for register new Workman
    path('register/', view.CreateNewWorkmanView.as_view(), name='register_workman'),
    path('register/documents/', view.CreateUserDocumentsView.as_view()),

    path('logout/',view.LogoutView.as_view()),

    path('countries/',view.ListCountryView.as_view()),
    path('confirm/', view.ConfirmationView.as_view()),
    path('check_email/', view.CheckEmailView.as_view()),
]

urlpatterns += router.urls
