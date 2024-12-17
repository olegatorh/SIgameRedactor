from .models import Package, Question, Theme, Round, Tag
from rest_framework import serializers


class PackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Package
        fields = '__all__'
        read_only_fields = ['user']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'


class RoundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Round
        fields = '__all__'
        read_only_fields = ['order']

    def validate(self, data):
        package_id = data.get('package_id')
        rounds_count = Round.objects.filter(package_id=package_id).count()
        if rounds_count >= 10:
            raise serializers.ValidationError("You can only add up to 10 rounds per package.")
        return data


class ThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theme
        fields = '__all__'


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'
        read_only_fields = ['order']

    def validate(self, data):
        theme_id = data.get('theme_id')
        themes_count = Theme.objects.filter(id=theme_id.id).count()
        if themes_count >= 10:
            raise serializers.ValidationError("You can only add up to 10 questions  per theme.")
        return data


class ThemeDownloadSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Theme
        fields = ['id', 'theme', 'comments', 'questions']


class RoundDownloadSerializer(serializers.ModelSerializer):
    themes = ThemeDownloadSerializer(many=True, read_only=True)

    class Meta:
        model = Round
        fields = ['id', 'round', 'order', 'themes']


class PackageDownloadSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    rounds = RoundDownloadSerializer(many=True, read_only=True)

    class Meta:
        model = Package
        fields = '__all__'

