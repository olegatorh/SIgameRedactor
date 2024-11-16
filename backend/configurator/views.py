from rest_framework import generics, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Package, Tag, Round, Theme, Question
from .serializers import PackageSerializer, TagSerializer, RoundSerializer, ThemeSerializer, QuestionSerializer


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
    serializer_class = RoundSerializer

    def get(self, request, *args, **kwargs):
        print(self.kwargs)
        package_id = self.kwargs.get('pk')

        if package_id is None:
            return Response({'error': 'package id is required'}, status=status.HTTP_400_BAD_REQUEST)

        rounds = Round.objects.filter(package_id=package_id)
        serializer = self.serializer_class(rounds, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)