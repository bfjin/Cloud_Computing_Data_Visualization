import csv
import os
from django.shortcuts import render
from django.http import JsonResponse

ANALYSIS_PATH = os.path.join(os.path.dirname(__file__), 'analysis_data/')


def index(request):
    return render(request,
                  'analysis/dashboard.html',
                  )


def visualize_income_data(request):
    return render(request,
                  'analysis/income_analysis.html',
                  )


def income_data(request):
    sla_data = []
    income_data = []
    happiness_data = []
    income_threshold = 100000000.0
    with open(ANALYSIS_PATH + "melb_income_happiness_report.csv") as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            income = float(row[1])
            if income < income_threshold:
                income_threshold = income
            sla_data.append(row[0])
            income_data.append(income)
            happiness_data.append(row[2])

    new_happiness_data = []
    for h in happiness_data:
        new_happiness_data.append(round(float(h) * income_threshold, 3))

    response = {"sla": sla_data,
                "income": income_data,
                "happiness": new_happiness_data}

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
