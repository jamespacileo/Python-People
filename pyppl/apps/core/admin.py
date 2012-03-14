#from django.db import models
from django.contrib import admin
from core.models import *

class LocationAdmin(admin.ModelAdmin):
	list_display = ('city', 'lng', 'lat')
	fields = ('city', 'lng', 'lat')

admin.site.register(Location, LocationAdmin)