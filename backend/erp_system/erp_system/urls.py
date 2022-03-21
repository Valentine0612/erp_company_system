from django.contrib import admin
from django.urls import path, re_path
from django.urls.conf import include
from rest_framework_simplejwt import views as view
from django.conf import settings
from django.conf.urls.static import static
from documents.views import serve_protected_document

urlpatterns = [
    path('admin/', admin.site.urls),
    path('main/', include('main.urls')),
    path('tasks/', include('tasks.urls')),
    path('token/', view.TokenObtainPairView.as_view(), name='get_token_pair_url'),
    path('token/refresh/', view.TokenRefreshView.as_view(), name='refresh_token_url'),
    path('password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
    re_path(r'^images/(?!default_user)(?P<user>.*)/(?!avatar_)(?P<file>.*)$', serve_protected_document),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
