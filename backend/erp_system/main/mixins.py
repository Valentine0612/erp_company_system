from .models import User


class VerifiedUserMixin:    

    def get_queryset(self):
        is_verified = self.request.query_params.get('is_verified')
        queryset = User.objects.exclude(is_staff=True).exclude(is_manager=True)
        if is_verified:
            queryset = queryset.filter(is_verified=is_verified)
        return queryset
