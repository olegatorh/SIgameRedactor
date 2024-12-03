import os

from PIL import Image
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models, transaction
from django.conf import settings
from moviepy import VideoFileClip, AudioFileClip
from rest_framework.exceptions import ValidationError



def upload_to(instance, filename):
    return f'questions/{instance.theme_id_id}/{filename}'



class Package(models.Model):

    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('completed', 'Completed'),
    ]

    title = models.CharField(max_length=255)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    difficulty = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)], help_text="value should be from 1 to 10")
    author = models.CharField(max_length=255)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    last_modified = models.DateTimeField(auto_now=True)
    download_url = models.URLField(max_length=500, blank=True, null=True)
    description = models.TextField(blank=True, null=True)


    def __str__(self):
        return self.title

class Tag(models.Model):
    tag_names = models.CharField(max_length=100)
    package_id = models.ForeignKey(Package, related_name='tags', on_delete=models.CASCADE)


class Round(models.Model):
    round = models.CharField(max_length=255)
    package_id = models.ForeignKey(Package, related_name='rounds', on_delete=models.CASCADE)
    order = models.PositiveIntegerField(editable=False, blank=True,
                                        null=True)
    final = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        with transaction.atomic():
            rounds_count = Round.objects.select_for_update().filter(package_id=self.package_id).count()
            if rounds_count >= 10:
                raise ValidationError("You can only add up to 10 rounds per package.")
            self.order = rounds_count + 1
            super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        max_order = Round.objects.filter(package_id=self.package_id).aggregate(models.Max('order'))['order__max']
        print(max_order)
        if self.order != max_order:
            raise ValidationError("Only the last round can be deleted.")

        super().delete(*args, **kwargs)

    def __str__(self):
        return self.round

class Theme(models.Model):
    theme = models.CharField(max_length=255)
    round_id = models.ForeignKey(Round, related_name='themes', on_delete=models.CASCADE)
    comments = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.theme




# сейвить шлях в моделі без назви питання

class Question(models.Model):
    CONTENT_CHOICES = [
        (1, 'TEXT'),
        (2, 'IMAGE'),
        (3, 'AUDIO'),
        (4, 'VIDEO'),
    ]

    TYPE_CHOICES = [
        (1, 'simple'),
        (2, 'stake'),
        (3, 'secret'),
        (4, 'secretPublicPrice'),
        (5, 'noRisk'),
    ]

    TRANSFER_CHOICES = [
        (1, 'All'),
        (2, 'All_except_you')
    ]


    theme_id = models.ForeignKey(Theme, related_name='questions', on_delete=models.CASCADE)
    question = models.CharField(max_length=255)
    content_type = models.IntegerField(choices=CONTENT_CHOICES, default=1)
    question_type = models.IntegerField(choices=TYPE_CHOICES, default=1)
    question_price = models.PositiveIntegerField()
    answer = models.CharField(max_length=255)
    order = models.PositiveIntegerField(editable=False, blank=True, null=True)
    question_file = models.FileField(upload_to=upload_to, null=True, blank=True)
    question_transfer = models.IntegerField(choices=TRANSFER_CHOICES, blank=True, null=True)
    real_price = models.PositiveIntegerField(blank=True, null=True)
    answer_time = models.PositiveIntegerField(blank=True, null=True, default=30)

    def process_file(self):
        if self.content_type == 2:  # IMAGE
            self.question_file = self.process_image()
        elif self.content_type == 3:  # AUDIO
            self.question_file =self.process_audio()
        elif self.content_type == 4:  # VIDEO
            self.question_file = self.process_video()

    def process_image(self):
        img = Image.open(self.question_file.path)
        if img.mode == 'RGBA':
            img = img.convert('RGB')
        img = img.resize((800, 800))
        new_path = os.path.splitext(self.question_file.path)[0] + ".jpg"
        img.save(new_path, format='JPEG', quality=80)
        self.question_file.name = upload_to(self, os.path.basename(new_path))
        return self.question_file

    def process_audio(self):
        file_path = self.question_file.path
        target_bitrate = 320
        max_size = 1 * 1024 * 1024
        audio = AudioFileClip(file_path)
        audio_duration = audio.duration
        desired_time = min(self.answer_time, audio_duration)
        trimmed_audio = audio.subclipped(0, desired_time)
        new_path = os.path.splitext(file_path)[0] + ".mp3"
        while True:
            compressed_path = os.path.splitext(file_path)[0] + f"_{target_bitrate}kbps.mp3"

            trimmed_audio.write_audiofile(
                compressed_path,
                codec="libmp3lame",
                bitrate=f"{target_bitrate}k"
            )

            if os.path.getsize(compressed_path) <= max_size or target_bitrate <= 64:
                if os.path.exists(file_path):
                    os.remove(file_path)
                os.rename(compressed_path, new_path)
                break

            os.remove(compressed_path)
            target_bitrate -= 32

        self.question_file.name = upload_to(self, os.path.basename(new_path))
        return self.question_file

    def process_video(self):
        file_path = self.question_file.path
        new_path = os.path.splitext(file_path)[0] + "_processed.mp4"
        video = VideoFileClip(file_path)
        video_duration = video.duration
        desired_time = min(self.answer_time, video_duration)
        trimmed_video = video.subclipped(0, desired_time)
        trimmed_video.write_videofile(new_path, codec="libx264", bitrate="800k",  audio_codec="aac")
        if os.path.exists(file_path):
            os.remove(file_path)
        self.question_file.name = upload_to(self, os.path.basename(new_path))
        return self.question_file


    def save(self, *args, **kwargs):
        with transaction.atomic():
            rounds_count = Question.objects.select_for_update().filter(theme_id=self.theme_id).count()
            if rounds_count >= 10:
                raise ValidationError("You can only add up to 10 questions per theme.")
            self.order = rounds_count + 1
            if not self.real_price :
                self.real_price = self.question_price
            super().save(*args, **kwargs)
            if self.question_file:
                self.process_file()
                if self.question_file:
                    super().save(update_fields=['question_file'])






    def delete(self, *args, **kwargs):
        max_order = Question.objects.filter(theme_id=self.theme_id).aggregate(models.Max('order'))['order__max']
        print(max_order)
        if self.order != max_order:
            raise ValidationError("Only the last question can be deleted.")
        super().delete(*args, **kwargs)

    def __str__(self):
        return self.round
    def __str__(self):
        return self.question