import csv

from django.shortcuts import render
from django.http import JsonResponse

from .scenarios_analysis.income_analysis import search_data


def index(request):
    return render(request,
                  'analysis/dashboard.html',
                  )


def visualize_income_data(request):
    return render(request,
                  'analysis/income_analysis.html',
                  )


def income_data(request):
    #aurin_data = "/references/sla_income.csv"
    #output_path = "/analysis_data/melb_income_happiness_report.csv"
    #search_data('coormelbourne',
    #            'income_analysis',
    #            aurin_data,
    #            output_path)
    #sla_data = []
    #income_data = []
    #happiness_data = []
    #with open(output_path) as csvfile:
    #    reader = csv.reader(csvfile)
    #    for row in reader:
    #        sla_data.append(row[0])
    #        income_data.append(row[1])
    #        happiness_data.append(row[2])

    sla_data = [11,12,13,14,15]
    income_data = [100,200,300,400,500]
    happiness_data = [50,51,52,53,54]

    response = {"sla": sla_data,
                "income": income_data,
                "happiness": happiness_data}

    return JsonResponse(response)


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
