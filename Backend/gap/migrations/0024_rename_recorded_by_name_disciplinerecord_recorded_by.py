# Generated by Django 5.2 on 2025-04-18 16:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('gap', '0023_rename_recorded_by_disciplinerecord_recorded_by_name'),
    ]

    operations = [
        migrations.RenameField(
            model_name='disciplinerecord',
            old_name='recorded_by_name',
            new_name='recorded_by',
        ),
    ]
