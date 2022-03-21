import pyotp
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.core.validators import MinValueValidator
from django_resized import ResizedImageField
import uuid
from decimal import Decimal

from .validators import *
from .managers import UserManager
from .counters import CHECK, LLC, STATE, TYPE_OF_EMPLOYEES, NATURAL_PERSON, TYPE_OF_COMPANY
from .helpers import create_user_hash, create_file_name


def create_directory_path(instance, filename):
    """
    Generate user directory for uploaded documents
    """
    hash = create_user_hash(
        instance.profile.user.created_at,
        instance.profile.user.open_code
    )
    file_name = create_file_name(instance.title, filename)
    return 'user_{0}/{1}'.format(hash, file_name)


def create_directory_path_for_company(instance, filename):
    """
    Generate user directory for generated documents from Company
    """
    hash = create_user_hash(
        instance.company_document.user.created_at,
        instance.company_document.user.open_code
    )
    file_name = create_file_name(instance.title, filename)
    company_code = instance.company_document.company.code
    return 'user_{0}/{1}/{2}'.format(hash, company_code, file_name)


def create_avatar_path(instance, filename):
    """
    Generate url directory for uploaded avatar
    """
    hash = create_user_hash(instance.created_at, instance.open_code)
    file_name = create_file_name('avatar', filename)
    return 'user_{0}/{1}'.format(hash, file_name)


class Country(models.Model):
    """
    Country model with One to Many rel with Profile model
    """
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=2, null=True)

    def __str__(self) -> str:
        return self.name.title()

    class Meta:
        db_table = 'country'
        verbose_name = 'countrie'


class Company(models.Model):
    """
    Company model is main object of System
    """
    full_name = models.CharField(max_length=200, unique=True)
    short_name = models.CharField(max_length=100, db_index=True)
    email = models.EmailField()
    address = models.CharField(max_length=500)
    company_type = models.CharField(
        choices=TYPE_OF_COMPANY, default=LLC, max_length=30)
    owner = models.CharField(max_length=200, default='')
    code = models.CharField(max_length=10, unique=True, null=True)
    phone = models.CharField(validators=[phone_regex], max_length=15)
    inn = models.CharField(validators=[inn_regex], max_length=20)
    kpp = models.CharField(
        validators=[kpp_regex], max_length=20, blank=True, null=True)
    ogrn = models.CharField(validators=[ogrn_regex], max_length=20)
    okpo = models.CharField(validators=[okpo_regex], max_length=20)
    rs = models.CharField(validators=[rs_regex], max_length=22)
    ks = models.CharField(validators=[ks_regex], max_length=20)
    bik = models.CharField(validators=[bik_regex], max_length=9)
    bank_info = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    beneficiary_id = models.UUIDField(null=True)
    bankDetails_id = models.UUIDField(null=True)
    total_price = models.DecimalField(decimal_places=2, max_digits=10, validators=[MinValueValidator(Decimal('0.00'))], default=0.00)
    receipt_data = models.CharField(max_length=300, default='', null=True)

    def __str__(self):
        return self.full_name

    def save(self, *args, **kwargs):
        code = self.code
        if not code:
            code = uuid.uuid4().hex[:10].upper()
        while Company.objects.filter(code=code).exclude(pk=self.pk).exists():
            code = uuid.uuid4().hex[:10].upper()
        self.code = code
        super(Company, self).save(*args, **kwargs)

    class Meta:
        db_table = 'company'
        verbose_name = 'companie'


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom User model
    """
    company = models.ManyToManyField(
        Company, through='CompanyUser', related_name='user')
    email = models.EmailField(unique=True)
    login = models.CharField(max_length=200, unique=True)
    avatar = ResizedImageField(
        size=[300, 300],
        crop=['middle', 'center'],
        upload_to=create_avatar_path,
        default='/default_user/user.png'
    )
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    patronymic = models.CharField(max_length=100, blank=True)
    phone = models.CharField(validators=[phone_regex], max_length=15)
    is_manager = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    is_banned = models.BooleanField(default=False)
    open_code = models.CharField(
        default='', blank=True, max_length=32, editable=False)
    otp_code = models.CharField(
        default='', blank=True, max_length=32, editable=False)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)

    objects = UserManager()

    USERNAME_FIELD = 'login'
    REQUIRED_FIELDS = ['email']

    class Meta:
        db_table = 'user'

    def __str__(self):
        return self.login

    def get_full_name(self):
        return f'{self.surname} {self.name} {self.patronymic}'

    def save(self, *args, **kwargs):
        open_code = self.open_code
        if not open_code:
            open_code = pyotp.random_base32()
        while User.objects.filter(open_code=open_code).exclude(pk=self.pk).exists():
            open_code = pyotp.random_base32()
        self.open_code = open_code
        otp_code = self.otp_code
        if not otp_code:
            otp_code = pyotp.random_base32()
        while User.objects.filter(otp_code=otp_code).exclude(pk=self.pk).exists():
            otp_code = pyotp.random_base32()
        self.otp_code = otp_code
        super(User, self).save(*args, **kwargs)


class CompanyUser(models.Model):
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name='get_company')
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='get_user')
    state = models.CharField(choices=STATE, default=CHECK, max_length=30)
    about = models.TextField(blank=True, null=True)
    contract = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.company.full_name} {self.user.login}'

    class Meta:
        db_table = 'company_user'
        unique_together = ('company', 'user')
        ordering = ['company', 'user__is_manager']


class Profile(models.Model):
    """
    Model One-to-One relation with User model
    contains personal info about User
    """
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, primary_key=True)
    citizenship = models.ForeignKey(
        Country, related_name='profiles', on_delete=models.PROTECT, to_field='name', default='Российская Федерация')
    type = models.CharField(choices=TYPE_OF_EMPLOYEES,
                            default=NATURAL_PERSON, max_length=2)
    passport = models.CharField(max_length=20, null=True)
    issued = models.DateField(null=True)
    issued_code = models.CharField(
        validators=[issued_code_regex], default='', max_length=7, null=True, blank=True)
    place_of_issue = models.CharField(max_length=300, default='', null=True)
    inn = models.CharField(validators=[inn_regex], max_length=20)
    snils = models.CharField(
        validators=[snils_regex], max_length=14, null=True)
    dob = models.DateField(null=True)
    pob = models.CharField(max_length=200, null=True)
    residence = models.CharField(max_length=200)
    ogrnip = models.CharField(
        validators=[ogrnip_regex], max_length=15, default='', null=True, blank=True)
    registration_date = models.DateField(null=True)
    beneficiary_id = models.UUIDField(null=True)
    bankDetails_id = models.UUIDField(null=True)

    def __str__(self):
        return self.user.login

    class Meta:
        db_table = 'profile'


class BankDetail(models.Model):
    """
    Model One-to-One relation with Profile model
    """
    profile = models.OneToOneField(
        Profile, on_delete=models.CASCADE, primary_key=True)
    cardholder_name = models.CharField(max_length=150, blank=True)
    bik = models.CharField(validators=[bik_regex], max_length=9, blank=True)
    card = models.CharField(validators=[card_regex], max_length=19, blank=True)
    rs = models.CharField(validators=[rs_regex], max_length=22, blank=True)
    ks = models.CharField(validators=[ks_regex], max_length=20, blank=True)
    bank_info = models.CharField(max_length=300, blank=True)

    class Meta:
        db_table = 'bank_detail'

    def __str__(self):
        return self.profile.user.login


class UserDocument(models.Model):
    """
    Model with Many-to-One relation with Profile model
    """
    profile = models.ForeignKey(
        Profile, on_delete=models.CASCADE, related_name='documents')
    title = models.CharField(max_length=100, default='')
    image = models.FileField(upload_to=create_directory_path,
                             validators=[validate_file_extension])

    def __str__(self):
        return self.profile.user.login

    class Meta:
        db_table = 'user_documents'


class CompanyUserDocument(models.Model):
    """
    Model for serve documents with each Company
    """
    company_document = models.ForeignKey(
        CompanyUser, on_delete=models.CASCADE, related_name='documents')
    title = models.CharField(max_length=100, default='')
    document = models.FileField(upload_to=create_directory_path_for_company,
                                validators=[validate_file_extension])

    def __str__(self) -> str:
        return str(self.company_document)
    
    class Meta:
        db_table = 'company_user_document'


class MetaDataUserDocument(models.Model):
    """
    Save Meta-data for CompanyUserDocuments model
    """
    document = models.OneToOneField(
        CompanyUserDocument, on_delete=models.CASCADE, primary_key=True)
    document_uuid = models.UUIDField(default=uuid.uuid4, unique=True)
    data = models.JSONField()

    def __str__(self):
        return self.document.company_document.user.login

    class Meta:
        db_table = 'metadata_user_document'


class ManagerComment(models.Model):
    """
    Model with Many-to-One relation with CompanyUser model
    for display Manager's comment about User
    """
    user = models.ForeignKey(
        CompanyUser,
        on_delete=models.CASCADE,
        related_name='comments', default=''
    )
    body = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.user.user.login

    class Meta:
        db_table = 'comment'
