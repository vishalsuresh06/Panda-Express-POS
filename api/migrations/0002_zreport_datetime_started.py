# Generated by Django 5.0 on 2024-12-06 18:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='zreport',
            name='datetime_started',
            field=models.DateTimeField(null=True),
        ),
    ]
