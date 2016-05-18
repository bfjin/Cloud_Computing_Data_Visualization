"""
Team: Cluster and Cloud Computing Team 3
Contents: Assigment 2
Authors: Kimple Ke
"""

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

    response = {
        "melb_sla": melb_sla_data,
        "melb_income": melb_income_data,
        "melb_happiness": new_melb_happiness_data,
        "syd_sla": syd_sla_data,
        "syd_income": syd_income_data,
        "syd_happiness": new_syd_happiness_data,
    }

    return JsonResponse(response)


def visualize_transportation_politics_data(request):
    return render(request,
                  'analysis/transportation_politics_analysis.html',
                  )


def transportation_politics_data(request):
    transport_trouble = []
    politics_tweets_num = []
    sla = []

    with open(ANALYSIS_PATH + 'results_transport_politics.csv') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            transport_trouble.append(round(float(row[1]), 5))
            politics_tweets_num.append(round(float(row[2]), 5))
            sla.append(row[0])

    response = {
        "tweets_num": politics_tweets_num,
        "transport_trouble": transport_trouble,
        "sla": sla
    }

    return JsonResponse(response)


def visualize_green_places_bbq_data(request):
    return render(request,
                  'analysis/greenplaces_bbq_analysis.html',
                  )


def green_places_bbq_data(request):
    sla = []
    aurin = []
    tweet_count = []
    aurin_per_100 = []
    tweets_per_1000 = []

    with open(ANALYSIS_PATH + 'green_place_visit_bbq_correlation.csv') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            sla.append(row[0])
            aurin.append(row[1])
            tweet_count.append(row[2])
            aurin_per_100.append(round(float(row[3]), 5))
            tweets_per_1000.append(round(float(row[4]), 5))

    response = {
        "sla": sla,
        "aurin": aurin,
        "tweet_count": tweet_count,
        "aurin_per_100": aurin_per_100,
        "tweets_per_1000": tweets_per_1000
    }

    return JsonResponse(response)


def visualize_unemployment_afl_data(request):
    return render(request,
                  'analysis/unemployment_afl_analysis.html',
                  )


def unemployment_afl_data(request):
    sla = []
    aurin = []
    aurin_per_100 = []
    tweet_count = []
    tweets_per_1000 = []

    with open(ANALYSIS_PATH + 'unemplyed_afl_correlation.csv') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            sla.append(row[0])
            aurin.append(row[1])
            aurin_per_100.append(round(float(row[2]), 5))
            tweet_count.append(row[3])
            tweets_per_1000.append(round(float(row[4]), 5))

    response = {
        "sla": sla,
        "aurin": aurin,
        "tweet_count": tweet_count,
        "aurin_per_100": aurin_per_100,
        "tweets_per_1000": tweets_per_1000
    }

    return JsonResponse(response)


def visualize_violence_income_data(request):
    return render(request,
                  'analysis/violence_income_analysis.html',
                  )


def violence_income_data(request):
    sla = []
    score = []
    income = []
    postcodes = []

    with open(ANALYSIS_PATH + 'violence.csv') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            sla.append(row[0])
            score.append(round(float(row[3]), 5))
            income.append(round(float(row[4]), 5))
            postcodes.append(row[5])

    response = {
        "sla": sla,
        "score": score,
        "income": income,
        "postcodes": postcodes
    }

    return JsonResponse(response)


def reports(request):
    return render(request,
                  'analysis/reports.html'
                  )


def demo(request):
    return render(request,
                  'analysis/demo.html'
                  )


def profile(request):
    return render(request,
                  'analysis/team_profile.html'
                  )
