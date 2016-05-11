from django.conf import settings
from django.conf.urls import url
from django.views.defaults import bad_request, permission_denied, page_not_found, server_error
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^get_analytics-1/?$', views.income_data, name='income_data'),
    url(r'^analytics-1/?$', views.visualize_income_data, name='visualize_income_data'),

    #url(r'^get_analytics-2/?$', views.ancestry_politics_data, name='ancestry_politics_data'),
    url(r'^analytics-2/?$', views.visualize_ancestry_politics_data, name='visualize_ancestry_politics_data'),

    url(r'^analytics-3/?$', views.analytics3, name='analytics3'),
    url(r'^analytics-4/?$', views.analytics4, name='analytics4'),
    url(r'^reports/?$', views.reports, name='reports'),
    url(r'^team-profile/?$', views.profile, name='profile'),

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
