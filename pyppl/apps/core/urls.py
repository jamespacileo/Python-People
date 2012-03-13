import os
from django.conf import settings
from django.conf.urls.defaults import patterns, include, url
from django.views.generic.simple import direct_to_template

urlpatterns = patterns('',
    (r'^$',                 'core.views.index'),
    (r'^profiles$',         'core.views.profiles'),
    (r'^profiles/edit/$',   'core.views.profiles'),
)