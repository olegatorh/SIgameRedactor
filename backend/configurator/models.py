from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models, transaction
from django.conf import settings
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

    def save(self, *args, **kwargs):
        with transaction.atomic():
            rounds_count = Question.objects.select_for_update().filter(theme_id=self.theme_id).count()
            print(rounds_count, 'rounds_count')
            if rounds_count >= 10:
                raise ValidationError("You can only add up to 10 questions per theme.")
            self.order = rounds_count + 1

            if not self.real_price :
                self.real_price = self.question_price
            super().save(*args, **kwargs)

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