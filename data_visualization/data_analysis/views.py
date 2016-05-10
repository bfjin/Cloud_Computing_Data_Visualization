from django.shortcuts import render
from django.http import HttpResponse

from .scenarios_analysis.income_analysis import search_data


def index(request):
    return render(request,
                  'analysis/dashboard.html',
                  )


def visualize_income_data(request):
    aurin_data = "/references/sla_income.csv"
    output_path = "/analysis_data/income_happiness_report.csv"
    search_data('coormelbourne',
                'income_analysis',
                aurin_data,
                output_path)
    

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
