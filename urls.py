import os
from django.conf.urls.defaults import patterns, include, url
from django.views.generic.simple import direct_to_template
from django.conf import settings
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('django.views.generic.simple',
    #(r'^$',            'direct_to_template', {'template': 'base.html'}),
)

urlpatterns += patterns('',
    url(r'^admin/',         include(admin.site.urls)),
    url(r'^grappelli/',     include('grappelli.urls')),
    url('',                 include('core.urls')),
)

if settings.DEBUG:

    urlpatterns += patterns('',
        (r'^static/(.*)$', 'django.views.static.serve', {'document_root': os.path.join(settings.ROOT_PATH, '', 'static')}),
        (r'^data/(.*)$', 'django.views.static.serve', {'document_root': os.path.join(settings.ROOT_PATH, '', 'data')}),
    )
