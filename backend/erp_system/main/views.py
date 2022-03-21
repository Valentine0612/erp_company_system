from rest_framework import generics
from rest_framework import status
from rest_framework import permissions
from rest_framework import viewsets
from rest_framework import filters
from rest_framework.parsers import MultiPartParser
from rest_framework.views import APIView
from rest_framework.views import Response
from rest_framework.exceptions import NotFound
from rest_framework_simplejwt.tokens import OutstandingToken, BlacklistedToken
from django.shortcuts import get_object_or_404
from mailings.services import (
    send_email_with_login_password,
    send_info_about_new_employee,
    generate_email_with_otp_password,
)
from mailings.utils import check_otp_password
from documents.services import (
    create_contract_for_user,
    preview_contract_for_manager,
    get_user_folder_path,
    create_context_data,
    write_sign_to_contract,
)

from . import permissions as custom_permission

from .utils import (
    check_user_in_company,
    decode_company_hash,
    get_company_id,
    change_state_for_user_in_company,
    BinaryFileRenderer,
    modify_input_for_multiple_files,
    create_context_data_for_contract,
)
from .mixins import VerifiedUserMixin
from .models import Company, CompanyUser, ManagerComment, User, Country
from .counters import DENIDED, WAITING_EMP
from .serializers import (
    WriteCompanySerializer,
    WriteUserSerializer,
    WriteUserDocumentSerializer,
    WriteManagerCommentSerializer,
    WriteAboutFieldSerializer,
    ReadOnlyFullCompanySerializer,
    ReadOnlyCompanyWithLinkSerializer,
    ReadOnlyUserForManagerSerializer,
    ReadOnlyFullUserForManager,
    ReadOnlyDocumentSerializer,
    ReadOnlyCountrySerializer,
    ReadOnlyUserSerializerWithOTP,
    ReadOnlyUserForAdminSerializer,
    VerifyUserSerializer,
    RetrieveReadOnlyUserSerializer,
    RetrieveReadOnlyUserForAdminSerializer,
    UpdateCompanySerializer,
    UpdateUserPassowrSerializer,
    UpdateUserSerializer,
)


class CheckEmailView(APIView):

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
        except:
            user = None
        if user:
            return Response({"info": "email already is used"}, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_204_NO_CONTENT)


class LogoutView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        tokens = OutstandingToken.objects.filter(user_id=request.user.id)
        for token in tokens:
            t, _ = BlacklistedToken.objects.get_or_create(token=token)
        return Response(status=status.HTTP_205_RESET_CONTENT)


class ListNotVerifiedUsersView(VerifiedUserMixin, generics.ListAPIView):
    """
    Display all user whis flag is_verified = False/True
    """
    permission_classes = [permissions.IsAdminUser]
    serializer_class = ReadOnlyUserForAdminSerializer


class RetrieveNotVerifiedUserView(VerifiedUserMixin, generics.RetrieveUpdateAPIView):
    """
    View for display all info about User to Admin and verify this User
    """
    permission_class = [permissions.IsAdminUser]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return RetrieveReadOnlyUserForAdminSerializer
        return VerifyUserSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        queryset = queryset.select_related(
            'profile', 'profile__bankdetail', 'profile__citizenship')
        queryset = queryset.prefetch_related('profile__documents')
        return queryset

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"Info": "User updated successfully"}, status=status.HTTP_205_RESET_CONTENT)
        else:
            return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)


class CompanyViewSet(viewsets.ModelViewSet):
    """
    ViewSet for manage Company model for Admin user
    Allows GET, POST, PATH, DELETE methods
    """
    permission_classes = [permissions.IsAdminUser]
    search_fields = ['full_name', 'short_name']
    filter_backends = [filters.SearchFilter]

    def get_serializer_class(self):
        if self.action in ["create"]:
            return WriteCompanySerializer
        elif self.action in ["partial_update"]:
            return UpdateCompanySerializer
        return ReadOnlyFullCompanySerializer

    def get_queryset(self):
        queryset = Company.objects.all()
        company_type = self.request.query_params.get('type', None)
        if company_type:
            queryset = queryset.filter(company_type=company_type)
        return queryset


class CompanyRetrieveView(APIView):
    """
    View for manage Company with IsManager permission
    """
    permission_classes = [permissions.IsAuthenticated,
                          custom_permission.IsManager]

    def get(self, request):
        company = Company.objects.get(id=get_company_id(request))
        serializer = ReadOnlyCompanyWithLinkSerializer(
            company, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class CurrentUserView(APIView):
    """
    Get info about current user
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = RetrieveReadOnlyUserSerializer(
            request.user, context={'request': request})
        return Response(serializer.data)


class CreateNewWorkmanView(APIView):
    """
    Register new Workman to Company via link
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        company_code = request.query_params.get('c')
        if company_code:
            try:
                code = decode_company_hash(company_code) or None
            except ValueError:
                return Response({"URL": "URL is broken"}, status.HTTP_400_BAD_REQUEST)
            # if code recieved
            if code is not None:
                company = get_object_or_404(Company, code=code)
        serializer = WriteUserSerializer(data=request.data)
        if serializer.is_valid():
            if company_code:
                serializer.save(company=company)
                #Celery task
                send_info_about_new_employee(company, request)
            else:
                serializer.save()
            #Celery task
            send_email_with_login_password(serializer.data)
            return Response({"user_id": serializer.data['id']}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateUserDocumentsView(generics.CreateAPIView):
    """
    Allow create and display UserDocuments for User-owner
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = WriteUserDocumentSerializer
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        profile = request.data['profile']
        titles = dict(request.data)['titles[]']
        images = dict(request.data)['image[]']

        flag = 1
        for title, img_name in zip(titles, images):
            modified_data = modify_input_for_multiple_files(profile, title, img_name)
            file_serializer = self.serializer_class(data=modified_data)
            if file_serializer.is_valid():
                file_serializer.save()
            else:
                flag = 0

        if flag == 1:
            return Response({"register": "Success!"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"register": "Error!"}, status=status.HTTP_400_BAD_REQUEST)


class ListUserFromCompanyView(generics.ListAPIView):
    """
    Display all employees in company
    """
    permission_classes = [permissions.IsAuthenticated,
                          custom_permission.IsManager]
    serializer_class = ReadOnlyUserForManagerSerializer
    search_fields = ['name', 'surname', 'patronymic',
                     'phone', 'email', 'profile__inn']
    filter_backends = [filters.SearchFilter]

    def get_queryset(self):
        param = self.request.query_params.get('state')

        company_id = get_company_id(self.request)
        if company_id is None:
            raise NotFound()
        company = Company.objects.get(id=company_id)
        queryset = User.objects.filter(
            company=company.id).filter(is_manager=False)
        if param:
            queryset = queryset.filter(get_user__state=param, company=company)
        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['company'] = Company.objects.get(
            id=get_company_id(self.request))
        return context


class DetailUserFromCompanyView(generics.RetrieveAPIView):
    """
    View for Manager company for Retrieve info about Employee
    """
    permission_classes = [permissions.IsAuthenticated,
                          custom_permission.IsManager]
    serializer_class = ReadOnlyFullUserForManager

    def get_queryset(self):
        company = Company.objects.get(id=get_company_id(self.request))
        queryset = User.objects.filter(
            company=company.id).filter(is_manager=False)
        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['company'] = Company.objects.get(
            id=get_company_id(self.request))
        return context


class CreateCommentView(generics.CreateAPIView):
    """
    Create comment for user by manager
    """
    permission_classes = [permissions.IsAuthenticated,
                          custom_permission.IsManager]
    serializer_class = WriteManagerCommentSerializer

    def post(self, request, **kwargs):
        company = Company.objects.get(id=get_company_id(self.request))
        user = get_object_or_404(User, pk=kwargs['pk'])
        if not check_user_in_company(company, user):
            return Response({"error": "user not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user.get_user.get(user=user, company=company))
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteCommentView(generics.DestroyAPIView):
    """
    Delete comment for user by Manager
    """
    permissions_class = [permissions.IsAuthenticated,
                        custom_permission.IsManager]
    queryset = ManagerComment.objects.all()

    def delete(self, request, **kwargs):
        company = Company.objects.get(id=get_company_id(self.request))
        obj = self.get_object()
        if obj.user.company == company:
            return super().delete(request, **kwargs)
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)


class EditAboutFieldView(generics.RetrieveUpdateAPIView):
    """
    Allow Manager edit field 'about' for employee
    """
    permissions_class = [permissions.IsAuthenticated,
                        custom_permission.IsManager]
    serializer_class = WriteAboutFieldSerializer

    def get_queryset(self):
        company = Company.objects.get(id=get_company_id(self.request))
        queryset = CompanyUser.objects.filter(company=company)
        return queryset

    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, user=self.kwargs['pk'])
        return obj
    

class ConfirmationView(APIView):
    """
    Send email to request.user with OTP password
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = ReadOnlyUserSerializerWithOTP(request.user)
        generate_email_with_otp_password(user.data)
        return Response(status=status.HTTP_200_OK)


class PreviewContractForUser(APIView):
    """
    Preview PDF for Manager
    """
    permissin_class = [permissions.IsAuthenticated]
    renderer_classes = [BinaryFileRenderer]

    def get(self, request, **kwargs):
        user = get_object_or_404(User, pk=kwargs['pk'])
        company = Company.objects.get(id=get_company_id(request))
        company_user = CompanyUser.objects.get(company=company, user=user)
        if check_user_in_company(company, user):
            context = create_context_data_for_contract(self.request)
            preview_contract_for_manager(company_user, context)
            user_path = get_user_folder_path(user)
            with open(f'{user_path}/{company.code}/contract.pdf', 'rb') as report:
                return Response(
                    report.read(),
                    headers={'Content-Disposition': 'attachment; filename="contract.pdf"'},
                    content_type='application/pdf',
                    status=status.HTTP_200_OK,)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class CreateContractView(APIView):
    """
    Create contract for user by manager
    """
    permission_classes = [permissions.IsAuthenticated,
                          custom_permission.IsManager]

    def post(self, request, **kwargs):
        state = request.data.get('state')
        code = request.data.get('code')
        context = create_context_data_for_contract(self.request)
        manager = ReadOnlyUserSerializerWithOTP(request.user)
        if not check_otp_password(manager.data['otp_code'], code):
            return Response({"error": "code is invalid"}, status=status.HTTP_409_CONFLICT)
        company = Company.objects.get(id=get_company_id(self.request))
        user = get_object_or_404(User, pk=kwargs['pk'])
        company_user = CompanyUser.objects.get(company=company, user=user)
        if check_user_in_company(company, user) and not company_user.contract:
            if state == 'accept':
                contract = create_contract_for_user(
                    company_user, context, is_manager=True)
                if contract:
                    change_state_for_user_in_company(company_user, WAITING_EMP)
                    return Response({"Success": "Contract created"}, status=status.HTTP_202_ACCEPTED)
                else:
                    return Response({"Error": "Something was wrong. Try again"}, status=status.HTTP_204_NO_CONTENT)
            elif state == 'deny':
                change_state_for_user_in_company(company_user, DENIDED)
                return Response({"success": "user has deny state"}, status=status.HTTP_200_OK)
        return Response({"error": "User does not exist or already has contract"}, status=status.HTTP_204_NO_CONTENT)


class ConfirmContractbyUser(APIView):
    """
    Confirm or refuse contract from user
    """
    permission_classes = [permissions.IsAuthenticated,
                          custom_permission.IsEmployee]

    def post(self, request):
        state = request.data.get('state')
        code = request.data.get('code')
        company = Company.objects.get(pk=request.data.get('company'))
        user = request.user
        company_user = CompanyUser.objects.get(user=user, company=company)
        serializer = ReadOnlyUserSerializerWithOTP(user)
        if not check_otp_password(serializer.data['otp_code'], code):
            return Response({"error": "code is invalid"}, status=status.HTTP_409_CONFLICT)
        if company_user.state == WAITING_EMP:
            context = create_context_data(company_user)
            write_sign_to_contract(user, company, context)
            change_state_for_user_in_company(company_user, state)
            return Response({"success": "state was update"}, status=status.HTTP_200_OK)
        return Response({"error": "you can't change state"}, status=status.HTTP_200_OK)


class DetailDocumentUserForManagerView(generics.RetrieveAPIView):
    """
    Detail User's document for Manager of Company
    """
    permission_classes = [permissions.IsAuthenticated,
                          custom_permission.IsManager]
    serializer_class = ReadOnlyDocumentSerializer

    def get_queryset(self, user):
        queryset = user.profile.documents.all()
        return queryset

    def get(self, request, *args, **kwargs):
        user = get_object_or_404(User, **kwargs)
        self.check_object_permissions(request, user)
        data = self.get_queryset(user)
        serializer = self.serializer_class(
            data, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class UpdateUserPasswordView(generics.UpdateAPIView):
    """
    View to change user's password
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UpdateUserPassowrSerializer

    def put(self, request):
        user = request.user
        serializer = self.serializer_class(
            user, data=request.data, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_205_RESET_CONTENT)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateLoginUserView(generics.UpdateAPIView):
    """
    View to change user's login and avatar
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UpdateUserSerializer

    def patch(self, request):
        user = request.user
        serializer = self.serializer_class(
            user, data=request.data, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_205_RESET_CONTENT)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListCountryView(generics.ListAPIView):
    """
    Display queryset of Country model
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = ReadOnlyCountrySerializer

    def list(self, request):
        queryset = Country.objects.all().exclude(name='Российская Федерация')
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SubscribeCompanyView(APIView):
    """
    Add User to Company by link
    """
    permission_classes = [permissions.IsAuthenticated,
                          custom_permission.IsVerified]

    def post(self, request):
        company_code = request.query_params.get('c')
        if company_code:
            try:
                code = decode_company_hash(company_code) or None
            except ValueError:
                return Response({"URL": "URL is broken"}, status.HTTP_400_BAD_REQUEST)
            # if code recieved
            if code is not None:
                company = get_object_or_404(Company, code=code)
            if not CompanyUser.objects.filter(company=company, user=request.user).exists():
                request.user.company.add(company)
                # Celery task
                send_info_about_new_employee(company, request)
                return Response({"Info": "Your request to company created"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"Info": "You are already in this company"}, status=status.HTTP_204_NO_CONTENT)
        return Response({"URL": "URL is broken"}, status.HTTP_400_BAD_REQUEST)
