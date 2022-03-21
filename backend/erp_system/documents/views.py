from main.models import UserDocument, CompanyUserDocument
from tasks.models import TaskDocument
from django.shortcuts import get_object_or_404
from django.http import FileResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def serve_protected_document(request, user, file):
    image_path = f'{user}/{file}'
    match user.count('/'):
        case 0:
            document = get_object_or_404(UserDocument, image=image_path)
            response=FileResponse(document.image)
        case 1:
            document = get_object_or_404(CompanyUserDocument, document=image_path)
            response=FileResponse(document.document)
        case 2:
            document = get_object_or_404(TaskDocument, file=image_path)
            response=FileResponse(document.file)
    return response
