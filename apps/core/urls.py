import os
from django.conf import settings
from django.conf.urls.defaults import patterns, include, url
# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'edocs.views.home', name='home'),
    # url(r'^edocs/', include('edocs.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)

urlpatterns = patterns('',
	(r'^$',				'core.views.index'),

	# test
	(r'^test/$',		'core.views.test'),
)


if settings.SERVE_STATIC:

    urlpatterns += patterns('',
        (r'^static/(.*)$', 'django.views.static.serve', {'document_root': os.path.join(settings.ROOT_PATH, '', 'static')}),
        (r'^data/(.*)$', 'django.views.static.serve', {'document_root': os.path.join(settings.ROOT_PATH, '', 'data')}),
    )