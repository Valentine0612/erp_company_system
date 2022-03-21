from rest_framework import serializers
from django.conf import settings


class ReadOnlyReceiptSerializer(serializers.Serializer):
    """
    Display info about Receipt model
    """
    from_period = serializers.DateField(read_only=True)
    to_period = serializers.DateField(read_only=True)
    active_workers = serializers.IntegerField(read_only=True)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['total'] = instance.active_workers*settings.AMOUNT_PER_WORKER
        return representation
