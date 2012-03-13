ENVIRONMENT = 'DEV' # DEV, UAT, PROD
SERVE_STATIC = True
DEBUG = True
TEMPLATE_DEBUG = DEBUG
DEFAULT_SMS_PROVIDER = 'COLLSTREAM'


# Development
from conf.dev import *

# UAT Testing
#from conf.uat import *

# Production
#from conf.prod import *
