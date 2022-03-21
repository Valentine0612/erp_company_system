from django.urls import path

from . import views

urlpatterns = [
    path('', views.ListTaskView.as_view()),
    path('<int:pk>/', views.RetrieveTaskView.as_view()),
    path('<int:pk>/documents/', views.CreateDocumentForTaskView.as_view()),
    path('close/',views.CreateClosedDocumentView.as_view()),
    path('user/', views.ListAllTasksByCompanyView.as_view()),
    path('user_all/', views.ListAllTasksView.as_view()),
    path('user/<int:pk>/', views.ConfirmCloseDocumentByUser.as_view()),
    path('state/', views.ChangeStateOfTaskView.as_view()),
    path('state_manager/', views.ChangeStateOfTaskForManagerView.as_view()),
]
