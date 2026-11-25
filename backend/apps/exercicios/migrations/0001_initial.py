import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Exercicio',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=120)),
                ('objetivo', models.CharField(max_length=200)),
                ('fundamento', models.CharField(choices=[('ARREMESSO', 'Arremesso'), ('DRIBLE', 'Drible'), ('PASSE', 'Passe'), ('DEFESA', 'Defesa'), ('REBOTE', 'Rebote'), ('CONDICIONAMENTO_FISICO', 'Condicionamento físico')], db_index=True, max_length=30)),
                ('orientacoes', models.TextField(blank=True)),
                ('criado_em', models.DateTimeField(auto_now_add=True)),
                ('atualizado_em', models.DateTimeField(auto_now=True)),
                ('criado_por', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='exercicios_criados', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'exercício',
                'verbose_name_plural': 'exercícios',
                'ordering': ['nome'],
            },
        ),
    ]
