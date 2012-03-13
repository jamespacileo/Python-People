import os
from django.http import HttpResponseRedirect, HttpResponse, HttpRequest
from django.template import loader, Context
from django import forms
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from annoying.decorators import render_to
from annoying.functions import get_object_or_None

from core.models import *
#from django.contrib.auth.models import User


@render_to('pages/index.html')
def index(request):
    return {}

@render_to('test/index.html')
def profiles(request):
    return {}

