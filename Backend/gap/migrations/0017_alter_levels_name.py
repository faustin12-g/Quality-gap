# Generated by Django 5.2 on 2025-04-18 07:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gap', '0016_students_class_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='levels',
            name='name',
            field=models.CharField(choices=[('Advanced level', 'Advanced level'), ('Ordinary level', 'Ordinary level')], default='Advanced level', max_length=200),
        ),
    ]
