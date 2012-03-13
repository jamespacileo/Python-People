from django import template
from django.template.defaultfilters import stringfilter
register = template.Library()

@register.filter
@stringfilter
def decimalise(value, pos):
	return str(value)[:-pos] + '.' + str(value)[-pos:]