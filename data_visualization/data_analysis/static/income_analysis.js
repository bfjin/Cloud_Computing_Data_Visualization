(function() {
    var app = angular.module('charts', ['chart.js']);

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

    app.controller("ChartController", ['$http', '$scope', '$log', function($http, $scope, $log){
        var chart = this;

        var incomeAnalysisEndpoint = "/analytics-1/";

        $scope.getIncomeAnalysis = function() {
            $http({
                url: incomeAnalysisEndpoint,
                method: 'GET',
            }).then(function successCallback(response) {
                var chart_labels = response.data.sla;
                var chart_income_data = response.data.income;
                var chart_happiness_data = response.data.happiness;

                console.log(chart_labels);
                console.log(chart_income_data);
                console.log(chart_happiness_data);

            }, function errorCallback(response) {
                $scope.notify(response.data.error);
            });
        }
    }]);

})();