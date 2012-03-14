from django.db import models

class Location(models.Model):
    city = models.CharField('Last name', max_length=100)
    lng = models.CharField('Longitude', max_length=50)
    lat = models.CharField('Latitude', max_length=50)
    datetime = models.DateTimeField('Sent', auto_now_add=True)

    class Admin:
        pass