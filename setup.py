from distutils.core import setup
 
setup(
    name="MoreThan NetBanxUI",
    version="0.1",
    description="Management commands for serving Django via CherryPy's built-in WSGI server",
    author="Dan Stephenson",
    author_email="daniel.stephenson@uk.rsagroup.com",
    url="http://127.0.0.1/netbanxui",
    packages=[
        "django_cpserver",
        "django_cpserver.management",
        "django_cpserver.management.commands",
    ],
)
