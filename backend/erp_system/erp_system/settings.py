from pathlib import Path
from datetime import timedelta
import environ
from celery.schedules import crontab

env = environ.Env()
environ.Env.read_env()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env('DEBUG')

ALLOWED_HOSTS = env('ALLOWED_HOSTS')

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'django_rest_passwordreset',
    'main.apps.MainConfig',
    'mailings.apps.MailingsConfig',
    'documents.apps.DocumentsConfig',
    'tasks.apps.TasksConfig',
    'billing.apps.BillingConfig',
    'django_cleanup.apps.CleanupConfig',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ORIGIN_WHITELIST = [
    'http://localhost:3000',
]

AUTH_USER_MODEL = 'main.User'

ROOT_URLCONF = 'erp_system.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [ BASE_DIR / 'templates' ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'erp_system.wsgi.application'

# REST Framework Settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DATETIME_FORMAT': '%s.%f',
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'PAGE_SIZE': 10
}

#Settings for JWT-token
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=2),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': False,
}

# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': env('DB_NAME'),
        'USER': env('DB_USER'),
        'PASSWORD': env('DB_PASSWORD'),
        'HOST': env('DB_HOST'),
        'PORT': '',
    }
}


# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Europe/Moscow'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'static'

MEDIA_URL = 'images/'
MEDIA_ROOT = BASE_DIR / 'static/images'

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# SMTP Settings
EMAIL_BACKEND ='django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = env('EMAIL_HOST')
EMAIL_USE_TLS = True
EMAIL_PORT = 587
EMAIL_HOST_USER = env('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL')


# Redis Settings
REDIS_HOST = 'localhost'
REDIS_PORT = '6379'
BROKER_URL = 'redis://' + REDIS_HOST + ':' + REDIS_PORT + '/0'
BROKER_TRANSPORT_OPTIONS = {'visibility_timeout': 3600} 
CELERY_RESULT_BACKEND = 'redis://' + REDIS_HOST + ':' + REDIS_PORT + '/0'


# Resized Image
DJANGORESIZED_DEFAULT_SIZE = [1920, 1080]
DJANGORESIZED_DEFAULT_QUALITY = 90
DJANGORESIZED_DEFAULT_KEEP_META = True
DJANGORESIZED_DEFAULT_FORCE_FORMAT = 'JPEG'
DJANGORESIZED_DEFAULT_FORMAT_EXTENSIONS = {'JPEG': ".jpg", "PNG":".png"}
DJANGORESIZED_DEFAULT_NORMALIZE_ROTATION = True

# Password Reset sittings
DJANGO_REST_MULTITOKENAUTH_RESET_TOKEN_EXPIRY_TIME = 3
DJANGO_REST_PASSWORDRESET_TOKEN_CONFIG = {
    "CLASS": "django_rest_passwordreset.tokens.RandomStringTokenGenerator",
    "OPTIONS": {
        "min_length": 50,
        "max_length": 60
    }
}


# PyOTP settings
CODE_LIFETIME = 30
CODE_LENGTH = 6


# Dadata API and Secret keys
DADATA_API_KEY = env('DADATA_API_KEY')
DADATA_SECRET_KEY = env('DADATA_SECRET_KEY')


# Tinkoff API params
TINKOFF_API_URL = 'https://business.tinkoff.ru/openapi/sandbox/secured'
TINKOFF_API_TOKEN = env('TINKOFF_API_TOKEN')
TINKOFF_NOMINAL_ACCOUNT = env('TINKOFF_NOMINAL_ACCOUNT')


# Billing settings
AMOUNT_PER_MONTH = 1500 # рублей за 1 месяц использования
AMOUNT_PER_WORKER = 200 # рублей за 1 активного исполнителя
SYSTEM_COMMISSION = 0.01 # коммиссия (в процентах) с каждой выплаты исполнителю


#Data of main Company
BENEFICIARY_ID = '2082edd8-9094-4428-a680-fe22c7ce0d86'
BANKDETAILS_ID = '2082edd8-9094-4428-a680-fe22c7ce0d86'


# CELERY Settings
CELERY_TIMEZONE = 'Europe/Moscow'
CELERY_ENABLE_UTC = False
CELERYBEAT_SCHEDULE = {
    'update_billing_system_every_1st_day_of_month': {
        'task': 'billing.tasks.update_billing_system',
        'schedule': crontab(hour=3, minute=0, day_of_month=1),
    },
    'create_receipt_every_5th_day_of_month': {
        'task': 'billing.tasks.create_deals_and_steps',
        'schedule': crontab(hour=3, minute=0, day_of_month=5),
    },
    'retry_billing_payment_every_hour': {
        'task': 'billing.tasks.retry_billing_payment',
        'schedule': crontab(minute=0),
    },
    'clear_empty_folders_every_month': {
        'task': 'billing.tasks.clear_empty_folder',
        'schedule': crontab(hour=4, minute=0, day_of_month=1),
    },
    'call_to_api_every_hour': {
        'task': 'tasks.tasks.call_to_api_every_hour',
        'schedule': crontab(minute=0),
    }
}
