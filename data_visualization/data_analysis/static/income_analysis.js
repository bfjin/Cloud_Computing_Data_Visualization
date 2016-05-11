(function() {
    var app = angular.module('charts', ['chart.js']);

    //Format a number, rounding to 2 decimal digits
    function formatNumber(number) {
        if (number) {
            return parseFloat(number).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        } else {
            return number;
        }
    }

    //Format a number, rounding to whole (no decimal digits).
    function formatNumberRound(number) {
        if (number) {
            return parseFloat(number).toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
        } else {
            return number;
        }
    }

    // Configure angular chart.
    app.config(['ChartJsProvider', function (ChartJsProvider) {
        ChartJsProvider.setOptions('Line', {
            scaleLabel: function(object) {
                return "     " + formatNumberRound(object.value);
            },

            // Settings for chart.
            responsive: true,
            scaleLineWidth: 2,
            scaleShowLabels: true,
            scaleFontStyle: "Arial",

            // Customise chart lines.
            scaleSteps: null,
            pointDot: true,
            scaleGridLineColor: "rgba(25,29,34,.05)",
            scaleShowHorizontalLines: false,
            scaleShowVerticalLines: false,
            scaleFontSize: 10,
            bezierCurve: true,
            pointDotRadius: 3,
            pointDotStrokeWidth: 3,
            pointHitDetectionRadius: 10,
            datasetFill: true,
            datasetStrokeWidth: 2,
            datasetStrokeWidth: 3,

            // Customise tooltip.
            showTooltips: true,
            tooltipFontFamily: 'Arial',
            tooltipFontSize: 10,
            customTooltips: false,
            multiTooltipTemplate: function (obj) {
                return obj.datasetLabel + ": " + formatNumber(obj.value);
            },

            // Legend.
            legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>; margin-top: 3px;\"></span><text class=\"legend-text\"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></text></li><%}%></ul>"
        });
    }]);

    app.controller("ChartController", ['$http', '$scope', '$log', '$window', '$rootScope',
        function($http, $scope, $log, $window, $rootScope){
        
        var chart = this;

        var incomeAnalysisEndpoint = "/get_analytics-1/";
        var incomeAnalysisPageEndpoint = "/analytics-1/";

        $scope.income_analysis_graph = {};
        $scope.income_analysis_graph.visible = true;
        $scope.income_analysis_graph.data = [[100,200,300,400,500], [50,51,52,53,54]];
        $scope.income_analysis_graph.labels = [11,12,13,14,15];
        $scope.income_analysis_graph.series = [0,0,0,0,0];

        $scope.income_analysis_graph.options = {
            animation: true
        } 

        Chart.defaults.global.colours = [
            {
                fillColor: "rgba(255,255,255,0)",
                strokeColor: "rgba(255,102,0,1)",
                pointColor: "rgba(255,102,0,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "rgba(255,102,0,1)",
                pointHighlightStroke: "rgba(255,102,0,1)"
            },
            {
                fillColor: "rgba(0,51,102,0)",
                strokeColor: "rgba(0,51,102,1)",
                pointColor: "rgba(0,51,102,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "rgba(0,51,102,1)",
                pointHighlightStroke: "rgba(0,51,102,1)",
            }
        ];


        $scope.getIncomeAnalysis = function() {
            $http({
                url: incomeAnalysisEndpoint,
                method: 'GET',
            }).then(function successCallback(response) {
                var chart_labels = response.data.sla;
                var chart_income_data = response.data.income;
                var chart_happiness_data = response.data.happiness;

                $scope.income_analysis_graph.labels = chart_labels;
                $scope.income_analysis_graph.data = [chart_income_data,
                                                     chart_happiness_data];

                $window.location.href = incomeAnalysisPageEndpoint;
            }, function errorCallback(response) {
                $scope.notify(response.data.error);
            });
        }
    }]);

})();