from rest_framework import serializers
from main.counters import READY, STATE_OF_PAYMENT
from main.serializers import ReadOnlyUserForManagerSerializer

from .models import *


class ReadOnlyDocumentSerializer(serializers.Serializer):
    """
    Display info about TaskDocument model
    """
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(read_only=True)
    file = serializers.FileField(read_only=True)


class ReadOnlyTasksSerializer(serializers.Serializer):
    """
    Display info about Task model
    """
    id = serializers.CharField(read_only=True)
    title = serializers.CharField(read_only=True)
    description = serializers.CharField(read_only=True)
    price = serializers.DecimalField(read_only=True, decimal_places=2, max_digits=10)
    from_date = serializers.DateField(read_only=True)
    to_date = serializers.DateField(read_only=True)
    is_completed = serializers.BooleanField(read_only=True)
    is_paid = serializers.BooleanField(read_only=True)
    is_signed = serializers.BooleanField(read_only=True)
    state = serializers.CharField(read_only=True)
    documents = ReadOnlyDocumentSerializer(many=True)

    def to_representation(self, instance):
        context = {
            'request':self.context.get('request',None),
            'company':self.context.get('company',None),
        }
        representation = super().to_representation(instance)
        status_of_payment = self.context.get('status')
        if status_of_payment:
            representation['status'] = STATE_OF_PAYMENT[status_of_payment]
        if context['company']:
            representation['user'] = ReadOnlyUserForManagerSerializer(instance.user.user, context=context).data
        return representation


class ReadOnlyTaskWithCompanySerializer(ReadOnlyTasksSerializer):
    """
    Display all task with company
    """

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['company_id'] = instance.user.company.pk
        representation['company'] = instance.user.company.full_name
        return representation


class TaskSerializer(serializers.ModelSerializer):
    """
    Serializer for creation new Task for Employee by Manager
    """
    state = serializers.CharField(read_only=True)

    def create(self, validated_data):
        if validated_data['user'].state != READY:
            raise serializers.ValidationError({'user':'User has not state=READY'})
        if validated_data['user'].user.is_banned:
            raise serializers.ValidationError({'user':'User is banned'})
        return super().create(validated_data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['user'] = instance.user.user.get_full_name()
        representation['documents'] = []
        return representation

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'price', 'from_date', 'to_date', 
                  'is_completed', 'is_paid', 'state']


class WriteTaskDocumentsSerializer(serializers.ModelSerializer):
    """
    Serializer for creation TaskDocument model
    """

    class Meta:
        model = TaskDocument
        fields = ['id', 'task', 'title', 'file']
