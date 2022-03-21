from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password

from .models import (
    BankDetail,
    Company,
    CompanyUser,
    Profile,
    User,
    UserDocument,
    ManagerComment
)

from .utils import (
    create_manager,
    generate_company_hash,
    gen_random_login_password,
    get_tokens_for_user,
)

from .validators import *

from bank_manager.services import get_bank_info_form_bik

from tinkoff_api.api_urls import get_current_balance

from tinkoff_api.utils import (
    get_beneficiare_id,
    get_bankDetails_id
)

from billing.serializers import ReadOnlyReceiptSerializer
from billing.utils import create_receipt_model


class ReadOnlyManagerCommentSerializer(serializers.Serializer):
    """
    Display manager's comment about User
    """
    id = serializers.IntegerField(read_only=True)
    body = serializers.CharField(read_only=True)


class ReadOnlyCountrySerializer(serializers.Serializer):
    """
    Display info about Country model
    """
    name = serializers.CharField(read_only=True)
    code = serializers.CharField(read_only=True)


class ReadOnlyCompanySerializer(serializers.Serializer):
    """
    Display info about Company for Employees
    """
    full_name = serializers.CharField(read_only=True)
    short_name = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    address = serializers.CharField(read_only=True)
    phone = serializers.CharField(read_only=True)


class ReadOnlyFullCompanySerializer(ReadOnlyCompanySerializer):
    """
    Display all fields of Company model
    (Only for admin)
    """
    company_type = serializers.CharField(read_only=True)
    inn = serializers.CharField(read_only=True)
    kpp = serializers.CharField(read_only=True)
    ogrn = serializers.CharField(read_only=True)
    okpo = serializers.CharField(read_only=True)
    rs = serializers.CharField(read_only=True)
    ks = serializers.CharField(read_only=True)
    bik = serializers.CharField(read_only=True)
    bank_info = serializers.CharField(read_only=True)
    id = serializers.IntegerField(read_only=True)
    total_price = serializers.DecimalField(read_only=True, decimal_places=2, max_digits=10)


class ReadOnlyDocumentSerializer(serializers.Serializer):
    """
    Display info about UserDocumen model
    """
    image = serializers.ImageField(read_only=True)
    title = serializers.CharField(read_only=True)


class ReadOnlyBankDetailSerializer(serializers.Serializer):
    """
    Display info about Bank detail model
    """
    cardholder_name = serializers.CharField(read_only=True)
    bik = serializers.CharField(read_only=True)
    card = serializers.CharField(read_only=True)
    rs = serializers.CharField(read_only=True)
    ks = serializers.CharField(read_only=True)
    bank_info = serializers.CharField(read_only=True)


    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.card:
            representation.pop('bik')
            representation.pop('rs')
            representation.pop('ks')
            representation.pop('bank_info')
        else:
            representation.pop('card')
            representation.pop('cardholder_name')
        return representation


class ReadOnlyProfileWithDocumentsSerializer(serializers.Serializer):
    """
    Display info adout Profile model
    """
    citizenship = serializers.CharField(read_only=True)
    state = serializers.CharField(read_only=True)
    type = serializers.CharField(read_only=True)
    passport = serializers.CharField(read_only=True)
    inn = serializers.CharField(read_only=True)
    snils = serializers.CharField(read_only=True)
    dob = serializers.DateField(read_only=True)
    pob = serializers.CharField(read_only=True)
    residence = serializers.CharField(read_only=True)
    issued = serializers.DateField(read_only=True)
    place_of_issue = serializers.CharField(read_only=True)
    issued_code = serializers.CharField(read_only=True)
    bankdetail = ReadOnlyBankDetailSerializer()
    ogrnip = serializers.CharField(read_only=True)
    registration_date = serializers.DateField(read_only=True)
    documents = ReadOnlyDocumentSerializer(many=True)


class ReadOnlyUserSerializer(serializers.Serializer):
    """
    Display info only about User model
    """
    id = serializers.IntegerField(read_only=True)
    login = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    avatar = serializers.ImageField(read_only=True)
    name = serializers.CharField(read_only=True)
    surname = serializers.CharField(read_only=True)
    patronymic = serializers.CharField(read_only=True)
    phone = serializers.CharField(read_only=True)
    manager = serializers.BooleanField(source='is_manager', read_only=True)
    staff = serializers.BooleanField(source='is_staff', read_only=True)
    verified = serializers.BooleanField(source='is_verified', read_only=True)


class ReadOnlyUserSerializerWithOTP(ReadOnlyUserSerializer):
    """
    Add otp_code field to display info about user
    """
    otp_code = serializers.CharField(read_only=True)


class ReadOnlyCompanyUserDocumentSerializer(serializers.Serializer):
    """
    Display info about documents in CompanyUser model
    """
    title = serializers.CharField(read_only=True)
    document = serializers.FileField(read_only=True)


class ReadOnlyCompanuUserSerializer(serializers.Serializer):
    """
    Display info about CompanyUser model
    """
    company = serializers.CharField(read_only=True)
    documents = ReadOnlyCompanyUserDocumentSerializer(many=True)
    state = serializers.CharField(read_only=True)
    about = serializers.CharField(read_only=True)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['company_id'] = instance.company.pk
        return representation


class ReadOnlyCompanyUserForManagerSerializer(ReadOnlyCompanuUserSerializer):
    """
    Add comments for manager display info
    """
    comments = ReadOnlyManagerCommentSerializer(many=True)


class ReadOnlyUserForAdminSerializer(serializers.Serializer):
    """
    Display info about User model for Admin
    """
    id = serializers.IntegerField(read_only=True)
    email = serializers.EmailField(read_only=True)
    avatar = serializers.ImageField(read_only=True)
    name = serializers.CharField(read_only=True)
    surname = serializers.CharField(read_only=True)
    patronymic = serializers.CharField(read_only=True)
    phone = serializers.CharField(read_only=True)
    manager = serializers.BooleanField(source='is_manager', read_only=True)
    staff = serializers.BooleanField(source='is_staff', read_only=True)
    verified = serializers.BooleanField(source='is_verified', read_only=True)
    banned = serializers.BooleanField(source='is_banned', read_only=True)


class RetrieveReadOnlyUserForAdminSerializer(ReadOnlyUserForAdminSerializer):
    """
    Display info about User to Admin
    """
    profile = ReadOnlyProfileWithDocumentsSerializer()


class RetrieveReadOnlyUserSerializer(RetrieveReadOnlyUserForAdminSerializer):
    """
    Display info about User and user's Profile and Company model
    """
    login = serializers.CharField(read_only=True)
    company = ReadOnlyCompanuUserSerializer(source='get_user', many=True)


class ReadOnlyCompanyWithLinkSerializer(ReadOnlyFullCompanySerializer):
    """
    Dislay info about Company for manager
    """
    receipts = serializers.SerializerMethodField()

    def get_receipts(self, obj):
        lastest_receipt = obj.receipts.all().last()
        data = ReadOnlyReceiptSerializer(lastest_receipt).data 
        return data

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['link'] = generate_company_hash(
            instance.code, instance.created_at, self.context['request'])
        balance_data = get_current_balance(instance.beneficiary_id)
        if balance_data is not None:
            representation['amount'] = balance_data['amount']
            representation['amount_on_hold'] = balance_data['amountOnHold']
        return representation


class UserForManagerSerializer(serializers.Serializer):
    """
    Base serializer for display info about user to manager
    """
    id = serializers.IntegerField(read_only=True)
    avatar = serializers.ImageField(read_only=True)
    email = serializers.EmailField(read_only=True)
    name = serializers.CharField(read_only=True)
    surname = serializers.CharField(read_only=True)
    patronymic = serializers.CharField(read_only=True)
    phone = serializers.CharField(read_only=True)
    verified = serializers.BooleanField(source='is_verified', read_only=True)
    banned = serializers.BooleanField(source='is_banned', read_only=True)


class ReadOnlyUserForManagerSerializer(UserForManagerSerializer):
    """
    Display info about Company's employee for manager
    """

    def to_representation(self, instance):
        company = self.context['company']
        representation = super().to_representation(instance)
        company_user = instance.get_user.get(company=company)
        representation['state'] = company_user.state
        representation['about'] = company_user.about
        representation['inn'] = instance.profile.inn if instance.profile is not None else None
        representation['type'] = instance.profile.type if instance.profile is not None else None
        return representation


class ReadOnlyFullUserForManager(UserForManagerSerializer):
    """
    Display all info about user for manager
    """
    profile = ReadOnlyProfileWithDocumentsSerializer()
    company = ReadOnlyCompanyUserForManagerSerializer(source='get_user', many=True)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        context_company = self.context['company']
        companies = representation['company']
        company_data = next((company for company in companies if company['company'] == context_company.full_name), None)
        representation.pop('company')
        representation['company'] = company_data
        return representation


class WriteManagerSerializer(serializers.ModelSerializer):
    """
    Serializer for creation User model with flag is_manager=True
    """
    manager = serializers.BooleanField(source='is_manager', required=False)

    class Meta:
        model = User
        fields = ['email', 'name', 'surname', 'patronymic', 'phone', 'manager']


class WriteBankDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for display info about BankDetail model
    """
    bik = serializers.CharField(required=False, validators=[bik_regex])
    card = serializers.CharField(required=False, validators=[card_regex])
    rs = serializers.CharField(required=False, validators=[rs_regex])
    ks = serializers.CharField(required=False, validators=[ks_regex])
    cardholder_name = serializers.CharField(required=False)

    def validate(self, attrs):
        bik = attrs.get('bik', None)
        rs = attrs.get('rs', None)
        ks = attrs.get('ks', None)
        card = attrs.get('card', None)
        cardholder_name = attrs.get('cardholder_name', None)
        check_bank = card is None and cardholder_name is None and bik is not None and rs is not None and ks is not None
        check_card = card is not None and cardholder_name is not None and bik is None and rs is None and ks is None

        if not (check_bank or check_card):
            raise serializers.ValidationError(
                {"Error": "Enter BIK, rs and ks or card and cardholder_name"}
            )
        
        if bik:
            bank_info = get_bank_info_form_bik(bik)
            if bank_info == 'BIK is not valid':
                raise serializers.ValidationError(
                    {"error": bank_info}
                )    
            attrs.update({'bank_info': bank_info})
        
        return attrs

    class Meta:
        model = BankDetail
        exclude = ['profile']


class WriteManagerCommentSerializer(serializers.ModelSerializer):
    """
    Allow write comments about user by manager
    """

    class Meta:
        model = ManagerComment
        fields = ['body']


class WriteAboutFieldSerializer(serializers.ModelSerializer):
    """
    Allow write info about employee by Manager
    """

    class Meta:
        model = CompanyUser
        fields = ['about']


class WriteProfileForManagerSerializer(serializers.ModelSerializer):
    """
    Allow to update user's profile by Manager 
    """
    bankdetail = WriteBankDetailSerializer()

    class Meta:
        model = Profile
        fields = ['citizenship', 'state', 'type', 'passport', 'inn',
                  'snils', 'dob', 'pob', 'residence', 'bankdetail', 'ogrnip', 'about', ]

    def update(self, instance, validated_data):
        if 'bankdetail' in validated_data:
            nested_serializer = self.fields['bankdetail']
            nested_instance = instance.bankdetail
            nested_data = validated_data.pop('bankdetail')
            nested_serializer.update(nested_instance, nested_data)
        return super().update(instance, validated_data)


class WriteUserForManagerSerializer(serializers.ModelSerializer):
    """
    Allow update user's info by manager
    """
    profile = WriteProfileForManagerSerializer()

    class Meta:
        model = User
        fields = ['id', 'name', 'surname',
                  'patronymic', 'email', 'phone', 'profile']

    def update(self, instance, validated_data):
        if 'profile' in validated_data:
            nested_serializer = self.fields['profile']
            nested_instance = instance.profile
            nested_data = validated_data.pop('profile')
            nested_serializer.update(nested_instance, nested_data)
        return super().update(instance, validated_data)


class WriteUserDocumentSerializer(serializers.ModelSerializer):
    """
    Serializer for creation UserDocument
    """

    class Meta:
        model = UserDocument
        fields = ['image', 'profile', 'title']


class WriteProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for display info about Profile model
    """
    bankdetail = WriteBankDetailSerializer()
    issued = serializers.CharField(required=False)
    issued_code = serializers.CharField(required=False, validators=[issued_code_regex])
    place_of_issue = serializers.CharField(required=False)
    type = serializers.CharField(required=True)
    snils = serializers.CharField(required=False, validators=[snils_regex])
    dob = serializers.DateField(required=False)
    pob = serializers.CharField(required=False)
    passport = serializers.CharField(required=False)
    ogrnip = serializers.CharField(required=False, validators=[ogrnip_regex])
    registration_date = serializers.DateField(required=False)

    def validate(self, attrs):
        type = attrs['type']
        match type:
            case 'SP':
                if not (attrs.get('ogrnip') and attrs.get('dob') and attrs.get('pob')
                        and attrs.get('issued_code') and attrs.get('place_of_issue')
                        and attrs.get('passport') and attrs.get('issued') and attrs.get('registration_date')):
                    raise serializers.ValidationError(
                        {"Error": "registration_date, ogrnip, issued_code, place_of_issue is required for SP type"}
                    )
            case 'SE' | 'NP':
                if not (attrs.get('snils') and attrs.get('dob') and attrs.get('pob')
                        and attrs.get('issued_code') and attrs.get('place_of_issue')
                        and attrs.get('passport') and attrs.get('issued')):
                    raise serializers.ValidationError(
                        {"Error": "passport, snils, dob, pob, issued are required for NP or SE type"}
                    )
            case 'FR':
                if not (attrs.get('citizenship')):
                    raise serializers.ValidationError(
                        {"Error": "citizenship is required for FR type"}
                    )
        return attrs

    class Meta:
        model = Profile
        fields = ['citizenship', 'type', 'passport', 'inn', 'ogrnip', 'snils', 'registration_date',
                  'issued', 'place_of_issue', 'dob', 'pob', 'residence', 'bankdetail', 'issued_code']


class UpdateCompanySerializer(serializers.ModelSerializer):
    """
    Serializer for update Company model
    """
    kpp = serializers.CharField(required=False, allow_null=True)

    class Meta:
        model = Company
        fields = ['id', 'full_name', 'short_name', 'owner', 'company_type',
                  'email', 'address', 'phone', 'inn', 'kpp',
                  'ogrn', 'okpo', 'rs', 'ks', 'bik', 'bank_info']


class WriteCompanySerializer(UpdateCompanySerializer):
    """
    Serializer for creation Company model with Manager
    """
    user = WriteManagerSerializer(many=True)
    bank_info = serializers.CharField(required=False)
    meta_data = serializers.JSONField(required=False)

    def create(self, validated_data):
        meta_data = validated_data.pop('meta_data', None)

        user_data = validated_data.pop('user')
        bik = validated_data.get('bik')
        bank_info = get_bank_info_form_bik(bik)

        if bank_info == 'BIK is not valid':
            raise serializers.ValidationError(
                {"error": bank_info}
            )

        validated_data.update({'bank_info': bank_info})

        # register beneficiary
        beneficiary_id = get_beneficiare_id(validated_data.copy(), meta_data)
        if  beneficiary_id.get('errorId'):
            # raise error when tinkoff_API returns error message or invalid data message
            raise serializers.ValidationError(beneficiary_id)

        bankDetails_id = get_bankDetails_id(validated_data, beneficiary_id['beneficiary_id'])
        if  bankDetails_id.get('errorId'):
            # raise error when tinkoff_API returns error message or invalid data message
            raise serializers.ValidationError(bankDetails_id)

        # save beneficiary and bank details id
        validated_data.update({'beneficiary_id':beneficiary_id['beneficiary_id']})
        validated_data.update({'bankDetails_id':bankDetails_id['bankDetails_id']})

        company = Company.objects.create(**validated_data)

        # create Receipt model for billing system
        create_receipt_model(company=company)
        for user in user_data:
            create_manager(company=company, **user)
        return company

    class Meta(UpdateCompanySerializer.Meta):
        model = Company
        fields = UpdateCompanySerializer.Meta.fields + ['user', 'meta_data']


class WriteUserSerializer(serializers.ModelSerializer):
    """
    Allow to create new user model with profile 
    """
    profile = WriteProfileSerializer()
    login = serializers.CharField(required=False)
    password = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'surname', 'patronymic',
                  'phone', 'profile', 'login', 'password']

    def create(self, validated_data):
        company = validated_data.pop('company', None)
        profile_data = validated_data.pop('profile')
        bank_detail_data = profile_data.pop('bankdetail')
        self.login, self.password = gen_random_login_password()
        user_data = validated_data
        user_data['login'] = self.login
        user_data['password'] = self.password
        user = User.objects.create_user(**user_data)
        if company:
            user.company.add(company)
        profile = Profile.objects.create(user=user, **profile_data)
        BankDetail.objects.create(profile=profile, **bank_detail_data)
        return user

    def to_representation(self, instance):
        representation = {}
        representation['id'] = instance.id
        representation['email'] = [instance.email]
        representation['login'] = self.login
        representation['password'] = self.password
        return representation


class VerifyUserSerializer(serializers.ModelSerializer):
    """
    Allow verify account by Admin
    """

    def update(self, instance, validated_data):
        # serialize user's data
        user_data = RetrieveReadOnlyUserSerializer(instance).data
        profile_data = dict(user_data.pop('profile'))
        bank_data = dict(profile_data.pop('bankdetail'))

        # create beneficiary
        beneficiary = get_beneficiare_id(user_data, profile_data)
        if beneficiary.get('errorId'):
            # raise error when tinkoff_API returns error message or invalid data message
            raise serializers.ValidationError(beneficiary)
            
        bankDetails = get_bankDetails_id(bank_data, beneficiary['beneficiary_id'])
        if  bankDetails.get('errorId'):
            # raise error when tinkoff_API returns error message or invalid data message
            raise serializers.ValidationError(bankDetails)

        # save Ids in profile model 
        instance.profile.beneficiary_id =  beneficiary['beneficiary_id']
        instance.profile.bankDetails_id = bankDetails['bankDetails_id']
        instance.profile.save()

        return super().update(instance, validated_data)

    class Meta:
        model = User
        fields = ['is_verified', 'is_banned']


class UpdateUserPassowrSerializer(serializers.ModelSerializer):
    """
    Allow to change password for User
    """
    token = serializers.SerializerMethodField()
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    old_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['old_password', 'password', 'password2', 'token']

    def get_token(self, obj):
        token = get_tokens_for_user(obj)
        return token

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError(
                {"old_password": "Old password is not correct"})
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})
        if attrs['password'] == attrs['old_password']:
            raise serializers.ValidationError(
                {"password": "New password and old password are similar"}
            )
        return attrs

    def update(self, instance, validated_data):
        instance.set_password(validated_data['password'])
        instance.save()

        return instance


class UpdateUserSerializer(serializers.ModelSerializer):
    """
    Allow to change user's login 
    """
    login = serializers.CharField(required=False, min_length=10)

    class Meta:
        model = User
        fields = ['login', 'avatar']

    def validate_login(self, value):
        user = self.context['request'].user
        if User.objects.exclude(pk=user.pk).filter(login=value).exists():
            raise serializers.ValidationError(
                {"login": "This login is already in use."})
        return value

    def update(self, instance, validated_data):
        user = self.context['request'].user

        if user.pk != instance.pk:
            raise serializers.ValidationError(
                {"authorize": "You dont have permission for this user."})

        instance.login = validated_data.get('login', instance.login)
        instance.avatar = validated_data.get('avatar', instance.avatar)
        instance.save()

        return instance
