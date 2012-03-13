from django.db import models

class PythonPerson(models.Model):
	first_name = models.CharField('First name', max_length=100)
	last_name = models.CharField('Last name', max_length=100)
	email = models.EmailField('Email', max_length=40, null=True)
	#location = models.ForeignKey('Location', on_delete=models.CASCADE)
	sms_clientip = models.CharField('Client IP Address', max_length=20, null=True)
	datetime = models.DateTimeField('Sent', auto_now_add=True)

	class Admin:
		pass
