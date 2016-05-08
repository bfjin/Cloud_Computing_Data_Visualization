from django.conf import settings
from django.conf.urls import url
from django.views.defaults import bad_request, permission_denied, page_not_found, server_error
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^income_analysis/?$', views.visualize_income_data, name='visualize_income_data'),

]

if settings.DEBUG:
    # This allows the error pages to be debugged during development, just visit
    # these url in browser to see what these error pages look like.
    urlpatterns += [
        url(r'^400/$', bad_request),
        url(r'^403/$', permission_denied),
        url(r'^404/$', page_not_found),
        url(r'^500/$', server_error),
    ]
