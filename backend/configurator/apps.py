import os

from django.apps import AppConfig

from django.conf import settings


class ConfiguratorConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "configurator"

    def ready(self):
        import configurator.signals
        media_path = os.path.join(settings.MEDIA_ROOT, "packages")
        os.makedirs(media_path, exist_ok=True)