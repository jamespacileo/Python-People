import os, sys

# Django settings for pyppl project.

import os
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
PROJECT_DIR = ROOT_PATH = os.path.abspath(os.path.join(BASE_DIR, ".."))

# CherryPy HTTP Server

sys.path.append(os.path.join(ROOT_PATH, 'servers'))

ADMINS = (
     ('Dan Stephenson', 'daniel.stephenson@uk.rsagroup.com'),
)

MANAGERS = ADMINS

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',     # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'data/db/dev.db',                   # Or path to database file if using sqlite3.
        'USER': '',                                 # Not used with sqlite3.
        'PASSWORD': '',                             # Not used with sqlite3.
        'HOST': '',                                 # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '',                                 # Set to empty string for default. Not used with sqlite3.
    }
}

TIME_ZONE = 'Europe/London'

LANGUAGE_CODE = 'en-gb'

SITE_ID = 1

USE_I18N = True

USE_L10N = True

MEDIA_ROOT = os.path.join(ROOT_PATH, 'media')

MEDIA_URL = 'http://localhost:8002/static/'

LOGIN_REDIRECT_URL = '/'

STATIC_ROOT = os.path.join(ROOT_PATH, 'static')

STATIC_URL = '/static/'

ADMIN_MEDIA_PREFIX = STATIC_URL + 'grappelli/' #admin/

STATICFILES_DIRS = (
    os.path.join(ROOT_PATH, 'data/tmp'),
)

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

SECRET_KEY = '6ebduk_We_are_wh4t_w3_repeat3dly_do._Exc3llence,_th3n,_is_n0t_an_4ct,_but_4_hab1t.Ar1stotle99xve1zw'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.debug',
    'django.core.context_processors.i18n',
    'django.core.context_processors.media',
    'django.core.context_processors.static',
    'django.contrib.messages.context_processors.messages',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
)

ROOT_URLCONF = 'pyppl.urls'

TEMPLATE_DIRS = (
    os.path.join(ROOT_PATH, 'templates'),
)

INSTALLED_APPS = (
    'grappelli',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.admin',
    'django.contrib.admindocs',
    # apps
    'apps.annoying',
    'apps.core',
    'django_cpserver',
)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}
