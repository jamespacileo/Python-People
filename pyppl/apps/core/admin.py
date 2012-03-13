#from django.db import models
from django.contrib import admin
from core.models import *

class SMSAuditAdmin(admin.ModelAdmin):
	list_display = ('salutation', 'first_name', 'last_name', 'quote_ref', 'sms_number', 'sms_senderid', 'sms_message', 'sms_provider', 'datetime')
	fields = ('salutation', 'first_name', 'last_name', 'quote_ref', 'sms_number', 'sms_senderid', 'sms_message', 'sms_provider')
	readonly_fields = ('salutation', 'first_name', 'last_name', 'quote_ref', 'sms_number', 'sms_senderid', 'sms_message', 'sms_provider')

admin.site.register(SMSAudit, SMSAuditAdmin)

class SMSProviderAdmin(admin.ModelAdmin):
	list_display = ('provider', 'api_type', 'username', 'password', 'url_wsdl', 'url_endpoint', 'url_rest', 'datetime')
	fields = ('provider', 'api_type', 'username', 'password', 'url_wsdl', 'url_endpoint', 'url_rest')
	readonly_fields = ()

admin.site.register(SMSProvider, SMSProviderAdmin)