from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Tag, Round, Theme, Question, Package
from django.utils import timezone

@receiver(post_save, sender=Tag)
@receiver(post_delete, sender=Tag)
def update_package_last_modified_from_tag(sender, instance, **kwargs):
    instance.package_id.last_modified = timezone.now()
    instance.package_id.save(update_fields=['last_modified'])

@receiver(post_save, sender=Round)
@receiver(post_delete, sender=Round)
def update_package_last_modified_from_round(sender, instance, **kwargs):
    instance.package_id.last_modified = timezone.now()
    instance.package_id.save(update_fields=['last_modified'])

@receiver(post_save, sender=Theme)
@receiver(post_delete, sender=Theme)
def update_package_last_modified_from_theme(sender, instance, **kwargs):
    if instance.round_id:
        instance.round_id.package_id.last_modified = timezone.now()
        instance.round_id.package_id.save(update_fields=['last_modified'])

@receiver(post_save, sender=Question)
@receiver(post_delete, sender=Question)
def update_package_last_modified_from_question(sender, instance, **kwargs):
    if instance.theme_id and instance.theme_id.round_id:
        instance.theme_id.round_id.package_id.last_modified = timezone.now()
        instance.theme_id.round_id.package_id.save(update_fields=['last_modified'])
