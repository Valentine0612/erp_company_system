from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework import status
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from mailings.services import generate_email_with_task
from mailings.utils import check_otp_password
import main.permissions as custom_permissions
from main.counters import CLOSED, ISSUED
from main.utils import create_context_data_for_contract
from documents.services import (
    create_close_document_for_task,
    update_meta_data,
    write_sign_to_close_document_by_user
)
from main.serializers import ReadOnlyUserSerializerWithOTP

from .mixins import (
    TaskMixin, 
    TaskUserMixin, 
    ChangeStateMixin,
)
from .serializers import WriteTaskDocumentsSerializer, ReadOnlyTasksSerializer, ReadOnlyTaskWithCompanySerializer
from .models import Task, TaskDocument
from .services import (
    get_CompanyUser_model, 
    modify_data_for_task_document_model,
    check_id_in_request_data,
    save_deal_params,
)

from tinkoff_api.utils import create_deal_with_step
from tinkoff_api.api_urls import complete_deal, get_status_of_step

from billing.utils import increase_active_worker


class ListTaskView(TaskMixin, generics.ListCreateAPIView):
    """
    Get - Display all tasks in company for Manager
    Post - create new task for employee by Manager
    """
    permission_classes = [permissions.IsAuthenticated, custom_permissions.IsManager]
    
    def post(self, request):
        titles = dict(request.data).pop('titles[]', None)
        files = dict(request.data).pop('files[]', None)

        # convert list from value in str
        data = {k:str(v[0]) for k,v in dict(request.data).items()}

        try:
            user = get_CompanyUser_model(request, data['user'])
        except:
            user = None
        if not user:
            return Response({'Error':'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(data=data)
        documents = []
        if serializer.is_valid():
            task = serializer.save(user=user)
            
            flag = 1
            if titles and files:
                for title, file in zip(titles, files):
                    modify_data = modify_data_for_task_document_model(
                        task.pk, title, file)
                    serializer_task = WriteTaskDocumentsSerializer(data=modify_data, context={'request':request})
                    if serializer_task.is_valid():
                        document = serializer_task.save()
                        documents.append(document)
                        serializer.data['documents'].append(serializer_task.data)
                    else:
                        flag = 0
            if not flag:
                return Response({'Error':'Files was broken'}, status=status.HTTP_400_BAD_REQUEST)
            # Celery task
            generate_email_with_task(serializer.data, user.user, user.company, documents, request)
            
            deal_dict = create_deal_with_step(user.company, task.price)
            save_deal_params(task, deal_dict)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RetrieveTaskView(TaskMixin, generics.RetrieveUpdateDestroyAPIView):
    """
    View for modify info in Task
    """
    permisson_classes = [permissions.IsAuthenticated, 
                         custom_permissions.IsManager]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        task = self.get_object()
        context['status'] = get_status_of_step(task.deal_id, task.step_id)
        return context

    def patch(self, request, **kwargs):
        user_id = request.data.pop('user', None)
        if user_id:
            try:
                user = get_CompanyUser_model(request, user_id)
            except:
                user = None
            if not user:
                return Response({'Error':'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        instance = self.get_object()
        if instance.state != ISSUED:
            return Response({'Error':'Task has not state == ISSUED'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            if user_id:
                serializer.save(user=user)
            else:
                serializer.save()
            if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
                instance._prefetched_objects_cache = {}

            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangeStateOfTaskForManagerView(ChangeStateMixin, TaskMixin, APIView):
    """
    View for changing state of task for Manager
    """
    permission_classes = [permissions.IsAuthenticated,
                          custom_permissions.IsManager]
    serializer_class = ReadOnlyTasksSerializer
        

class ListAllTasksByCompanyView(TaskUserMixin, generics.ListAPIView):
    """
    Display all tasks for employee in every company
    """
    permission_classes = [permissions.IsAuthenticated,
                         custom_permissions.IsEmployee,
                         custom_permissions.IsVerified,
                         custom_permissions.IsBanned]


class ListAllTasksView(generics.ListAPIView):
    """
    Display all tasks for current user
    """
    permission_classes = [permissions.IsAuthenticated,
                         custom_permissions.IsEmployee,
                         custom_permissions.IsVerified, 
                         custom_permissions.IsBanned]
    serializer_class = ReadOnlyTaskWithCompanySerializer

    def get_queryset(self):
        queryset = Task.objects.filter(user__user=self.request.user)
        state = self.request.query_params.get('state',None)
        if state:
            queryset = queryset.filter(state=state)
        return queryset


class ChangeStateOfTaskView(ChangeStateMixin, TaskUserMixin, APIView):
    """
    View for changing state of Task for employee
    """
    permission_classes = [permissions.IsAuthenticated,
                          custom_permissions.IsEmployee]


class CreateDocumentForTaskView(APIView):
    """
    View for creation new document for exist Task
    """
    permission_class = [permissions.IsAuthenticated,
                        custom_permissions.IsManager]

    def post(self, request, **kwargs):
        task = get_object_or_404(Task, id=kwargs['pk'])
        if task.user.company != request.user.company.first():
            return Response({'Error':'You do not add file to this task'}, status=status.HTTP_400_BAD_REQUEST)
        request.data['task'] = task.pk
        serializer = WriteTaskDocumentsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, **kwargs):
        task = get_object_or_404(Task, id=kwargs['pk'])
        if task.user.company != request.user.company.first():
            return Response({'Error':'You do not add file to this task'}, status=status.HTTP_400_BAD_REQUEST)
        documents_id = request.data.pop('documents')
        if not check_id_in_request_data(task.documents.all(), documents_id):
            return Response({'detail':'Any documents is wrong'}, status=status.HTTP_400_BAD_REQUEST)
        TaskDocument.objects.filter(pk__in=documents_id).delete()
        return Response({'success':'documents deleted'},status=status.HTTP_204_NO_CONTENT)


class CreateClosedDocumentView(TaskMixin, APIView):
    """
    View for creation closed documents for completed Task
    """
    permission_classes = [permissions.IsAuthenticated,
                          custom_permissions.IsManager]

    def post(self, request):
        code = request.data.pop('code')
        manager = ReadOnlyUserSerializerWithOTP(request.user)
        if not check_otp_password(manager.data['otp_code'], code):
            return Response({"error": "code is invalid"}, status=status.HTTP_409_CONFLICT)
        tasks = self.get_queryset(state=CLOSED, id_set=request.data['tasks'])
        if not check_id_in_request_data(tasks, request.data['tasks']):
            return Response({'detail':'Any tasks is not completed'}, status=status.HTTP_400_BAD_REQUEST)

        context = create_context_data_for_contract(request)

        for task in tasks:
            create_close_document_for_task(task, context)
            # make worker active for current month
            if not task.user.is_active:
                increase_active_worker(task.user.company)
                task.user.is_active = True
                task.user.save()

        return Response(status=status.HTTP_200_OK)


class ConfirmCloseDocumentByUser(TaskUserMixin, generics.RetrieveAPIView):
    """
    View for confirmation close document for task
    """
    permission_classes = [permissions.IsAuthenticated,
                          custom_permissions.IsEmployee]

    def get(self, request, *args, **kwargs):
        task = self.get_object()
        status = None
        if task.is_completed:
            status = get_status_of_step(task.deal_id, task.step_id)
            if status == 'COMPLETED' and not task.is_paid:
                task.is_paid = True
                task.save()
        serializer = self.get_serializer(task, context={'status':status, 'request':request})
        return Response(serializer.data)

    def post(self, request, **kwargs):
        task = self.get_object()

        code = request.data.pop('code')
        user = ReadOnlyUserSerializerWithOTP(request.user)
        if not check_otp_password(user.data['otp_code'], code):
            return Response({"error": "code is invalid"}, status=status.HTTP_409_CONFLICT)
        
        if task.is_completed:
            document = task.documents.get(title='Закрывающий документ')
            context = update_meta_data(document, request.user)
            write_sign_to_close_document_by_user(task, context)
            # set task is_signed = True
            task.is_signed = True
            task.save()
            # perform payment from Company to worker
            complete_deal(task.deal_id, task.step_id)
            return Response(status=status.HTTP_200_OK)
        return Response({"detail":"Task is not completed"}, status=status.HTTP_400_BAD_REQUEST)
