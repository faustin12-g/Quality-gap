# Generated by Django 5.2 on 2025-04-04 17:58

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gap', '0003_district_school'),
    ]

    operations = [
        migrations.CreateModel(
            name='Parents',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('firstName', models.CharField(max_length=200)),
                ('lastName', models.CharField(max_length=200)),
            ],
        ),
        migrations.AddField(
            model_name='school',
            name='code',
            field=models.CharField(default=django.utils.timezone.now, max_length=10, unique=True),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name='Students',
            fields=[
                ('studentNumber', models.CharField(max_length=20, primary_key=True, serialize=False, unique=True)),
                ('firstName', models.CharField(max_length=200)),
                ('lastName', models.CharField(max_length=200)),
                ('dateOfBirth', models.DateField()),
                ('gender', models.CharField(max_length=10)),
                ('parent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gap.parents')),
                ('school', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gap.school')),
            ],
        ),
    ]
