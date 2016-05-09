from django.shortcuts import render
from django.http import HttpResponse


def index(request):
    return render(request,
                  'analysis/dashboard.html',
                  )


def visualize_income_data(request):
    return render(request,
                  'analysis/income_analysis.html',
                  )


def visualize_ancestry_politics_data(request):
    return render(request,
                  'analysis/ancestry_politics_analysis.html',
                  )


def analytics3(request):
    return render(request,
                  'analysis/analytics3.html',
                  )


def analytics4(request):
    return render(request,
                  'analysis/analytics4.html',
                  )


def reports(request):
    return render(request,
                  'analysis/reports.html',
                  )


def profile(request):
    return render(request,
                  'analysis/team_profile.html'
                  )
