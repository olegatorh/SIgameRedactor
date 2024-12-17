import os

from django.conf import settings
from django.views.decorators.http import last_modified
from rest_framework import generics
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from django.db.models import Q
from .models import Package, Tag, Round, Theme, Question
from .serializers import PackageSerializer, TagSerializer, RoundSerializer, ThemeSerializer, QuestionSerializer, PackageDownloadSerializer
from .utils import create_archive



class BaseDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    lookup_field = 'pk'


class PackageCreateAPIView(generics.CreateAPIView):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PackageDetailAPIView(BaseDetailAPIView):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer


class TagCreateAPIView(generics.CreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


class TagDetailAPIView(BaseDetailAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


class RoundCreateAPIView(generics.CreateAPIView):
    queryset = Round.objects.all()
    serializer_class = RoundSerializer

class RoundDetailAPIView(BaseDetailAPIView):
    queryset = Round.objects.all()
    serializer_class = RoundSerializer


class ThemeCreateAPIView(generics.CreateAPIView):
    queryset = Theme.objects.all()
    serializer_class = ThemeSerializer


class ThemeDetailAPIView(BaseDetailAPIView):
    queryset = Theme.objects.all()
    serializer_class = ThemeSerializer


class QuestionCreateAPIView(generics.CreateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer


class QuestionDetailAPIView(BaseDetailAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer


class QuizRoundsAPIView(generics.RetrieveAPIView):
    queryset = Round.objects.all()
    serializer = RoundSerializer


class PackageDownloadAPIView(generics.RetrieveAPIView):

    def get(self, request, *args, **kwargs):
        package_id = kwargs.get('pk')
        package = get_object_or_404(Package, pk=package_id)
        serializer = PackageDownloadSerializer(package)
        package_link = create_archive(serializer.data)
        relative_path = os.path.relpath(package_link, settings.MEDIA_ROOT)
        download_url = request.build_absolute_uri(settings.MEDIA_URL + relative_path)
        package.current_step = 6
        package.download_url = download_url
        package.save()
        return Response({'download_url': download_url})



class CompletedPackagesAPIView(generics.ListAPIView):
    queryset = Package.objects.filter(current_step=6)
    serializer_class = PackageSerializer


class QuizDraftView(generics.RetrieveAPIView):
    def get(self, request, *args, **kwargs):
        quiz_id = request.query_params.get('id', None)
        get_all = request.query_params.get('all', None)
        if quiz_id:
            package = get_object_or_404(Package, pk=quiz_id)
            serializer = PackageDownloadSerializer(package)
            return Response(serializer.data)
        if get_all == 'True':
            packages = Package.objects.exclude(current_step=6)
            print(packages)
            serializer = PackageDownloadSerializer(packages, many=True)
            return Response(serializer.data)
        if get_all == 'False':
            packages = Package.objects.filter(~Q(current_step=6), user=request.user)
            serializer = PackageDownloadSerializer(packages, many=True)
            return Response(serializer.data)
        latest_package = Package.objects.filter(~Q(current_step=6), user=request.user).order_by('-last_modified').first()
        serializer = PackageDownloadSerializer(latest_package)
        return Response(serializer.data)
