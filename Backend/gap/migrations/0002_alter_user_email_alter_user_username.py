# Generated by Django 5.2 on 2025-04-04 15:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gap', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(max_length=255, unique=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(max_length=50, unique=True),
        ),
    ]
