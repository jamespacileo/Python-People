from django.db import models

class User(models.Model):
	first_name = models.CharField('First name', max_length=100)
	last_name = models.CharField('Last name', max_length=100)
	email = models.EmailField('Email', max_length=40, null=True)
	location = models.ForeignKey('Location', on_delete=models.CASCADE)
	sms_clientip = models.CharField('Client IP Address', max_length=20, null=True)
	datetime = models.DateTimeField('Sent', auto_now_add=True)

	class Admin:
		pass


class Location(models.Model):
	location = models.CharField('Location', max_length=10)
	api_type = models.CharField('API Type', max_length=20, choices=API_TYPES)
	username = models.CharField('Username', max_length=100)
	password = models.CharField('Password', max_length=100)
	url_wsdl = models.URLField('WSDL Url', max_length=250, blank=True, null=True)
	url_endpoint = models.URLField('Endpoint Url', max_length=250, blank=True, null=True)
	url_rest = models.URLField('REST Url', max_length=250, blank=True, null=True)
	datetime = models.DateTimeField('Created', auto_now_add=True)

	class Admin:
		pass