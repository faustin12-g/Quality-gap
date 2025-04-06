# Generated by Django 5.2 on 2025-04-06 17:09

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gap', '0009_customerhelp'),
    ]

    operations = [
        migrations.AddField(
            model_name='customerhelp',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='customerhelp',
            name='replies',
            field=models.JSONField(default=list),
        ),
        migrations.AddField(
            model_name='customerhelp',
            name='status',
            field=models.CharField(choices=[('Pending', 'Pending'), ('In Progress', 'In Progress'), ('Resolved', 'Resolved')], default='Pending', max_length=20),
        ),
        migrations.AddField(
            model_name='customerhelp',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='customerhelp',
            name='name',
            field=models.CharField(max_length=100),
        ),
    ]
