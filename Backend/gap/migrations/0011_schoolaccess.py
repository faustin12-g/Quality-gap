# Generated by Django 5.2 on 2025-04-16 16:18

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gap', '0010_customerhelp_created_at_customerhelp_replies_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='SchoolAccess',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('school_code', models.CharField(max_length=20, unique=True)),
                ('school_password', models.CharField(max_length=128)),
                ('is_active', models.BooleanField(default=True)),
                ('school', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gap.school')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
