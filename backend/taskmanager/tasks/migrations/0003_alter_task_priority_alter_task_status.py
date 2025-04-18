# Generated by Django 5.1.7 on 2025-04-08 16:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0002_alter_task_due_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='priority',
            field=models.CharField(choices=[('Baja', 'Baja'), ('Media', 'Media'), ('Alta', 'Alta')], default='M', max_length=10),
        ),
        migrations.AlterField(
            model_name='task',
            name='status',
            field=models.CharField(choices=[('Pendiente', 'Pendiente'), ('En Progreso', 'En Progreso'), ('Completada', 'Completada')], default='PE', max_length=11),
        ),
    ]
