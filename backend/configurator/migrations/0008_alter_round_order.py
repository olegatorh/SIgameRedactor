# Generated by Django 5.1.2 on 2024-11-14 14:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('configurator', '0007_round_order'),
    ]

    operations = [
        migrations.AlterField(
            model_name='round',
            name='order',
            field=models.PositiveIntegerField(blank=True, editable=False, null=True),
        ),
    ]
