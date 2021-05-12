from django.db import models
from rest_framework.authtoken.admin import User


class Curso(models.Model):
    nombre = models.CharField(max_length=50)


class Carrera(models.Model):
    nombre = models.CharField(max_length=150)


class Usuario(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    carrera_id = models.ForeignKey(Carrera, null=True, on_delete=models.SET_NULL)


class Amistad(models.Model):
    # No se podía poner llaves primarias así que aquí va una unique de dos
    class Meta:
        unique_together = (('amigo1_id', 'amigo2_id'),)
    # TODO asegurarme que el primer usuario tenga un carné menor al segundo
    amigo1_id = models.ForeignKey(Usuario, related_name='friend1_to_users', on_delete=models.CASCADE)
    amigo2_id = models.ForeignKey(Usuario, related_name='friend2_to_users', on_delete=models.CASCADE)


class Hobby(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(max_length=2500)


class PlataformaSocial(models.Model):
    nombre = models.CharField(max_length=50)
    base_link = models.CharField(max_length=100)
    profile_link = models.CharField(max_length=100)


class RedSocial(models.Model):
    nombre = models.CharField(max_length=100)
    plataforma_id = models.ForeignKey(PlataformaSocial, on_delete=models.CASCADE)
    usuario_id = models.ForeignKey(Usuario, on_delete=models.CASCADE)


class UsuarioAsisteCurso(models.Model):
    class Meta:
        unique_together = (('curso_id', 'usuario_id'),)
    curso_id = models.ForeignKey(Curso, on_delete=models.CASCADE)
    usuario_id = models.ForeignKey(Usuario, on_delete=models.CASCADE)


class UsuarioTieneHobbies(models.Model):
    class Meta:
        unique_together = (('hobby_id', 'usuario_id'),)
    hobby_id = models.ForeignKey(Hobby, on_delete=models.CASCADE)
    usuario_id = models.ForeignKey(Usuario, on_delete=models.CASCADE)
