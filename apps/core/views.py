<<<<<<< HEAD
import os
=======
import os, datetime
from os.path import join, getsize
>>>>>>> 6cd950d53bfbd25aed36ceb2612fa3f7262dfefb
from django.http import HttpResponseRedirect, HttpResponse, HttpRequest
from django.template import loader, Context
from django import forms
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from annoying.decorators import render_to
from annoying.functions import get_object_or_None
<<<<<<< HEAD
=======
from django.contrib.auth import views as auth_views
import urllib2, suds
from suds.client import Client
>>>>>>> 6cd950d53bfbd25aed36ceb2612fa3f7262dfefb

from core.models import *
#from django.contrib.auth.models import User


<<<<<<< HEAD
@render_to('pages/index.html')
def index(request):
    return {}
=======
@csrf_exempt
@render_to('pages/index.html')
def sms(request):
	if request.POST:
		response = request.POST
		sms_audit = SMSAudit(
		salutation=response.get('salutation'),
		first_name=response.get('first_name'),
		last_name=response.get('last_name'),
		quote_ref=response.get('quote_ref'),
		sms_number=response.get('sms_number'),
		sms_senderid=response.get('sms_senderid'),
		sms_message=response.get('sms_message'),
		sms_provider=sms_provider('test'),
		sms_clientip=request.META.get('HTTP_X_FORWARDED_FOR','') or request.META.get('REMOTE_ADDR'))
		sms_audit.save()

		sms = False
		if sms_audit:
			if sms_audit.sms_provider.api_type == 'SOAP':
				response = soap_sms(sms_audit)
				if response:
					sms = True  # NEED TO RETURN sms_audit obj with flash changed
			elif sms_audit.sms_provider.api_type == 'REST':
				response = rest_sms(sms_audit)
				if response:
					sms = True  # NEED TO RETURN sms_audit obj with flash changed
		else:
			sms = False

		if not response:
			sms = False

		return {
			'soap': response,
			'repsonse': sms
		}

	return {}
>>>>>>> 6cd950d53bfbd25aed36ceb2612fa3f7262dfefb


@render_to('test/index.html')
def test(request):
<<<<<<< HEAD
    return {}
=======
	return {}
>>>>>>> 6cd950d53bfbd25aed36ceb2612fa3f7262dfefb
