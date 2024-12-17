# quiz/admin.py
from django.contrib import admin
from .models import Package, Tag, Round, Theme, Question

@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'date', 'difficulty', 'author', 'current_step', 'last_modified', 'id', 'download_url', 'description')

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('tag_names', 'package_id', 'id')


@admin.register(Round)
class RoundAdmin(admin.ModelAdmin):
    list_display = ('round', 'package_id', 'order', 'id', 'final')

@admin.register(Theme)
class ThemeAdmin(admin.ModelAdmin):
    list_display = ('theme', 'round_id', 'comments', 'id')

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('theme_id', 'question', 'question_type', 'content_type', 'question_price', 'answer', 'id', 'order', 'question_file', 'question_transfer', 'real_price', 'answer_time')
