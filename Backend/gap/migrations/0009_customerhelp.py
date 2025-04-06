# Generated by Django 5.2 on 2025-04-06 08:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gap', '0008_requestedmembership'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomerHelp',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20)),
                ('email', models.EmailField(max_length=254)),
                ('description', models.TextField()),
            ],
        ),
    ]
