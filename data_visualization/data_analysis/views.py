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
    melb_sla_data = []
    melb_income_data = []
    melb_happiness_data = []
    melb_income_threshold = 100000000.0
    syd_sla_data = []
    syd_income_data = []
    syd_happiness_data = []
    syd_income_threshold = 100000000.0

    with open(ANALYSIS_PATH + "melb_income_happiness_report.csv") as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            income = float(row[1])
            if income < melb_income_threshold:
                melb_income_threshold = income
            melb_sla_data.append(row[0])
            melb_income_data.append(income)
            melb_happiness_data.append(row[2])

    new_melb_happiness_data = []
    for h in melb_happiness_data:
        new_melb_happiness_data.append(round(float(h) * melb_income_threshold, 3))

    with open(ANALYSIS_PATH + "sydney_income_happiness_report.csv") as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            income = float(row[1])
            if income < syd_income_threshold:
                syd_income_threshold = income
            syd_sla_data.append(row[0])
            syd_income_data.append(income)
            syd_happiness_data.append(row[2])

    new_syd_happiness_data = []
    for h in syd_happiness_data:
        new_syd_happiness_data.append(round(float(h) * syd_income_threshold, 3))

    response = {"melb_sla": melb_sla_data,
                "melb_income": melb_income_data,
                "melb_happiness": new_melb_happiness_data,
                "syd_sla": syd_sla_data,
                "syd_income": syd_income_data,
                "syd_happiness": new_syd_happiness_data,
                }

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
