# Generated by Django 5.2 on 2025-04-19 15:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('gap', '0028_schoollibrarybookrental_returned_on'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='schoollibrarybookrental',
            name='returned_on',
        ),
    ]
