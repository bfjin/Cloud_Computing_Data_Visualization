from django.shortcuts import render
from django.http import HttpResponse


def index(request):
    return render(request,
                  'analysis/dashboard.html',
                  )


def visualize_income_data(request):
    return HttpResponse("income analysis!")
