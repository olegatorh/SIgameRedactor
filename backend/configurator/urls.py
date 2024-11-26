from django.urls import path

from .models import Question
from .views import PackageCreateAPIView, PackageDetailAPIView, TagCreateAPIView, RoundCreateAPIView, ThemeCreateAPIView, \
    ThemeDetailAPIView, QuestionCreateAPIView, QuestionDetailAPIView, RoundDetailAPIView, TagDetailAPIView, \
    QuizRoundsAPIView, PackageDownloadAPIView, CompletedPackagesAPIView

urlpatterns = [
    path('packages/', PackageCreateAPIView.as_view(), name='package_create'),
    path('download/<int:pk>/', PackageDownloadAPIView.as_view(), name='package_download'),
    path('packages/<int:pk>/', PackageDetailAPIView.as_view(), name='package_detail'),
    path('tag/', TagCreateAPIView.as_view(), name='package_create'),
    path('tag/<int:pk>/', TagDetailAPIView.as_view(), name='package_detail'),
    path('round/', RoundCreateAPIView.as_view(), name='package_create'),
    path('round/<int:pk>/', RoundDetailAPIView.as_view(), name='package_detail'),
    path('rounds/<int:pk>/', QuizRoundsAPIView.as_view(), name='package_rounds'),
    path('theme/', ThemeCreateAPIView.as_view(), name='package_create'),
    path('theme/<int:pk>/', ThemeDetailAPIView.as_view(), name='package_detail'),
    path('question/', QuestionCreateAPIView.as_view(), name='package_create'),
    path('question/<int:pk>/', QuestionDetailAPIView.as_view(), name='package_detail'),
    path('completed/', CompletedPackagesAPIView.as_view(), name='complete_packages'),
]