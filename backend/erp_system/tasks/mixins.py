from rest_framework.exceptions import NotFound
from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from main.models import Company, CompanyUser
from main.utils import get_company_id

from .services import change_task_state
from .models import Task
from .serializers import (
    ReadOnlyTasksSerializer,
    TaskSerializer
)


class TaskMixin:

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['company'] = Company.objects.get(
            id=get_company_id(self.request))
        return context

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ReadOnlyTasksSerializer
        return TaskSerializer
    
    def get_queryset(self, state=None, id_set=None):
        company = Company.objects.get(id=get_company_id(self.request))
        queryset = Task.objects.filter(user__company=company)
        user = self.request.query_params.get('user', None)
        state_query_params = self.request.query_params.get('state', None)
        if user:
            queryset = queryset.filter(user__user=user)
        if state and id_set:
            queryset = queryset.filter(state=state).filter(id__in=id_set).filter(is_completed=False)
        if state_query_params:
            queryset = queryset.filter(state=state_query_params)
        return queryset


class TaskUserMixin:

    serializer_class = ReadOnlyTasksSerializer

    def get_queryset(self):
        if self.request.data.get('company_id', None):
            company_id = self.request.data.get('company_id', None)
        else:
            company_id = self.request.query_params.get('company_id', None)
        try:
            company_user = CompanyUser.objects.get(user=self.request.user, company=company_id)
        except:
            company_user = None
        if company_user:
            queryset = company_user.tasks.all()
            return queryset
        raise NotFound()


class ChangeStateMixin:

    def post(self, request):
        queryset = self.get_queryset()
        instance = get_object_or_404(queryset, id=request.data['task_id'])
        change_task_state(instance, request.user)
        serializer = self.serializer_class(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)    
