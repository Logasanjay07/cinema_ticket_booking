from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from user_details.views import reset_password

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('user_details.urls')),
    path('reset/', reset_password),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)