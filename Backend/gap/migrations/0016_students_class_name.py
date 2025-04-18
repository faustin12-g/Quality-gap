# Generated by Django 5.2 on 2025-04-17 17:43

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gap', '0015_remove_class_year_class_level'),
    ]

    operations = [
        migrations.AddField(
            model_name='students',
            name='class_name',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='gap.class'),
            preserve_default=False,
        ),
    ]
