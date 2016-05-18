/*
* Cluster and Cloud Computing assignment 2
* Author: Kimple Ke
*/

(function() {
    var app = angular.module('charts', ['chart.js', 'uiGmapgoogle-maps']);

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
            tooltipFontSize: 12,
            customTooltips: false,
            multiTooltipTemplate: function (obj) {
                return obj.datasetLabel + ": " + formatNumber(obj.value);
            },
        });
    }])
    .config(function(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            //    key: 'your api key',
            v: '3.20', //defaults to latest 3.X anyhow
            libraries: 'weather,geometry,visualization'
        });
    });

    app.controller("ChartController", ['$http', '$scope', '$log', '$window', '$rootScope', '$timeout',
        function($http, $scope, $log, $window, $rootScope, $timeout){

        var chart = this;

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

        var dashboardEndpoint = "/"
        var incomeAnalysisEndpoint = "/get_analytics-1/";
        var incomeAnalysisPageEndpoint = "/analytics-1/";
        var transportPoliticsAnalysisEndpoint = "/get_analytics-2/";
        var transportPoliticsAnalysisPageEndpoint = "/analytics-2/";
        var greenPlacesBBQAnalysisEndpoint = "/get_analytics-3/";
        var greenPlacesBBQAnalysisPageEndpoint = "/analytics-3/";
        var unemploymentAFLAnalysisEndpoint = "/get_analytics-4/";
        var unemploymentAFLAnalysisPageEndpoint = "/analytics-4/";
        var violenceIncomeAnalysisEndpoint = "/get_analytics-5/";
        var violenceIncomeAnalysisPageEndpoint = "/analytics-5/";


        $scope.incomeAnalysisGraphUnits = "Australian dollars";
        $scope.melb_income_analysis_graph = {};
        $scope.melb_income_analysis_graph.visible = true;
        $scope.melb_income_analysis_graph.series = ["Income", "Happiness"];
        $scope.melb_income_analysis_graph.options = {
            animation: true
        }

        $scope.syd_income_analysis_graph = {};
        $scope.syd_income_analysis_graph.visible = true;
        $scope.syd_income_analysis_graph.series = ["Income", "Happiness"];
        $scope.syd_income_analysis_graph.options = {
            animation: false
        }

        $scope.transport_politics_graph_unit = "Number of tweets per 1000 population";
        $scope.transport_politics_graph = {};
        $scope.transport_politics_graph.visible = true;
        $scope.transport_politics_graph.series = ["Transport trouble per 100 population"];
        $scope.transport_politics_graph.options = {
            animation: true
        }

        $scope.green_places_bbq_graph_unit = "Number of tweets per 1000 population";
        $scope.green_places_bbq_graph = {};
        $scope.green_places_bbq_graph.visible = true;
        $scope.green_places_bbq_graph.series = ["Green place visits per week per 100 population"];
        $scope.green_places_bbq_graph.options = {
            animation: true
        }

        $scope.unemployment_afl_graph_unit = "Number of tweets per 1000 population";
        $scope.unemployment_afl_graph = {};
        $scope.unemployment_afl_graph.visible = true;
        $scope.unemployment_afl_graph.series = ["Rate of unemployment"];
        $scope.unemployment_afl_graph.options = {
            animation: true
        }

        $scope.violence_income_map = {};


        /*
        *  send request to server for result of income happiness analysis
        */
        $timeout(getIncomeAnalysisHelper(), 1000);

        $scope.getIncomeAnalysis = function() {
            $window.location.href = incomeAnalysisPageEndpoint;
            getIncomeAnalysisHelper();
        }

        function getIncomeAnalysisHelper() {
            $http({
                url: incomeAnalysisEndpoint,
                method: 'GET',
            }).then(function successCallback(response) {
                var melb_chart_sla = response.data.melb_sla;
                var melb_chart_income_data = response.data.melb_income;
                var melb_chart_happiness_data = response.data.melb_happiness;
                var syd_chart_sla = response.data.syd_sla;
                var syd_chart_income_data = response.data.syd_income;
                var syd_chart_happiness_data = response.data.syd_happiness;

                //for melbourne.
                $scope.melb_income_analysis_graph.labels = melb_chart_sla;
                $scope.melb_income_analysis_graph.data = [melb_chart_income_data,
                                                          melb_chart_happiness_data];

                var income_analysis_table = [];
                var i;
                for(i=0; i<melb_chart_sla.length; i++){
                    income_analysis_table.push({sla:melb_chart_sla[i], income:melb_chart_income_data[i], happiness:melb_chart_happiness_data[i]});
                }
                $scope.melb_income_analysis_table = income_analysis_table;

                //for sydney.
                $scope.syd_income_analysis_graph.labels = syd_chart_sla;
                $scope.syd_income_analysis_graph.data = [syd_chart_income_data,
                                                         syd_chart_happiness_data];

                var income_analysis_table = [];
                var i;
                for(i=0; i<syd_chart_sla.length; i++){
                    income_analysis_table.push({sla:syd_chart_sla[i], income:syd_chart_income_data[i], happiness:syd_chart_happiness_data[i]});
                }
                $scope.syd_income_analysis_table = income_analysis_table;
            }, function errorCallback(response) {
                $window.location.href = dashboardEndpoint;
                alert(response.data.error);
            });
        }

        /*
        *   send request to server for analysis results of transport politics analysis
        */
        $timeout(getTransportPoliticsAnalysisHelper(), 1000);

        $scope.getTransportPoliticsAnalysis = function() {
            $window.location.href = transportPoliticsAnalysisPageEndpoint;
            getTransportPoliticsAnalysisHelper();
        }

        function getTransportPoliticsAnalysisHelper() {
            $http({
                url: transportPoliticsAnalysisEndpoint,
                method: 'GET',
            }).then(function successCallback(response) {
                var politics_tweets = response.data.tweets_num;
                var transport_trouble = response.data.transport_trouble;
                var sla = response.data.sla;

                $scope.transport_politics_graph.labels = transport_trouble;
                $scope.transport_politics_graph.data = [politics_tweets];
                var i;
                var table_data = []
                for(i=0; i<sla.length; i++) {
                    table_data.push({sla:sla[i], transport_trouble:transport_trouble[i], politics_tweets:politics_tweets[i]});
                }
                $scope.transport_politics_analysis_table = table_data;
            }, function errorCallback(response) {
                $window.location.href = dashboardEndpoint;
                alert(response.data.error);
            });
        }

        /*
        *   send request to server for analysis results of green places and bbq analysis
        */
        $timeout(getGreenPlacesBBQAnalysisHelper(), 1000);

        $scope.getGreenPlacesBBQAnalysis = function() {
            $window.location.href = greenPlacesBBQAnalysisPageEndpoint;
            getGreenPlacesBBQAnalysisHelper();
        }

        function getGreenPlacesBBQAnalysisHelper() {
            $http({
                url: greenPlacesBBQAnalysisEndpoint,
                method: 'GET',
            }).then(function successCallback(response) {
                var sla = response.data.sla;
                var aurin = response.data.aurin;
                var tweet_count = response.data.tweet_count;
                var aurin_per_100 = response.data.aurin_per_100;
                var tweets_per_1000 = response.data.tweets_per_1000;

                $scope.green_places_bbq_graph.labels = aurin_per_100;
                $scope.green_places_bbq_graph.data = [tweets_per_1000];
                var i;
                var table_data = []
                for(i=0; i<sla.length; i++) {
                    table_data.push({sla:sla[i], aurin:aurin[i], tweet_count:tweet_count[i], aurin_per_100:aurin_per_100[i], tweets_per_1000:tweets_per_1000[i]});
                }
                $scope.green_places_bbq_analysis_table = table_data;
            }, function errorCallback(response) {
                $window.location.href = dashboardEndpoint;
                alert(response.data.error);
            });
        }

        /*
        *   send request to server for analysis results of unemployment rate and afl analysis
        */
        $timeout(getUnemploymentAFLAnalysisHelper(), 1000);

        $scope.getUnemploymentAFLAnalysis = function() {
            $window.location.href = unemploymentAFLAnalysisPageEndpoint;
            getUnemploymentAFLAnalysisHelper();
        }

        function getUnemploymentAFLAnalysisHelper() {
            $http({
                url: unemploymentAFLAnalysisEndpoint,
                method: 'GET',
            }).then(function successCallback(response) {
                var sla = response.data.sla;
                var aurin = response.data.aurin;
                var tweet_count = response.data.tweet_count;
                var aurin_per_100 = response.data.aurin_per_100;
                var tweets_per_1000 = response.data.tweets_per_1000;

                $scope.unemployment_afl_graph.labels = aurin_per_100;
                $scope.unemployment_afl_graph.data = [tweets_per_1000];
                var i;
                var table_data = []
                for(i=0; i<sla.length; i++) {
                    table_data.push({sla:sla[i], aurin:aurin[i], tweet_count:tweet_count[i], aurin_per_100:aurin_per_100[i], tweets_per_1000:tweets_per_1000[i]});
                }
                $scope.unemployment_afl_analysis_table = table_data;
            }, function errorCallback(response) {
                $window.location.href = dashboardEndpoint;
                alert(response.data.error);
            });
        }

        /*
        *   send request to server for analysis results of violence and income analysis
        */
        $timeout(getViolenceIncomeAnalysisHelper(), 1000);

        $scope.getViolenceIncomeAnalysis = function() {
            $window.location.href = violenceIncomeAnalysisPageEndpoint;
            getViolenceIncomeAnalysisHelper();
        }

        function getViolenceIncomeAnalysisHelper() {
            $http({
                url: violenceIncomeAnalysisEndpoint,
                method: 'GET',
            }).then(function successCallback(response) {
                var sla = response.data.sla;
                var income = response.data.income;
                var score = response.data.score;
                var postcodes = response.data.postcodes;

                // maps data
                $scope.violence_income_map.zoom = 9;
                $scope.violence_income_map.center = {
                    latitude: -37.8152065,
                    longitude: 144.963937
                };
                $scope.violence_income_map.violences_data = [];

                // $scope.violence_income_map.violences_data = [
                //   {
                //       center: {
                //           latitude: -37.837037,
                //           longitude: 144.9588252
                //       },
                //       radius: 500,
                //       stroke: {
                //           color: '#FF0000',
                //           weight: 0.5,
                //           opacity: 1
                //       },
                //       fill: {
                //           color: '#FF0000',
                //           opacity: 0.5
                //       },
                //       geodesic: true, // optional: defaults to false
                //       clickable: true, // optional: defaults to true
                //       visible: true, // optional: defaults to true
                //       control: {}
                //   },
                //   {
                //     center: {
                //         latitude: -37.8255591,
                //         longitude: 144.9454207
                //     },
                //     radius: 500,
                //     stroke: {
                //         color: '#08B21F',
                //         weight: 0.5,
                //         opacity: 1
                //     },
                //     fill: {
                //         color: '#08B21F',
                //         opacity: 0.5
                //     },
                //     geodesic: true, // optional: defaults to false
                //     clickable: true, // optional: defaults to true
                //     visible: true, // optional: defaults to true
                //     control: {}
                //   }
                // ];
                //
                // setTimeout(function() {
                //   $scope.violence_income_map.violences_data.push({
                //     center: {
                //         latitude: -37.8147713,
                //         longitude: 144.9527324
                //     },
                //     radius: 500,
                //     stroke: {
                //         color: '#08B21F',
                //         weight: 0.5,
                //         opacity: 1
                //     },
                //     fill: {
                //         color: '#08B21F',
                //         opacity: 0.5
                //     },
                //     geodesic: true, // optional: defaults to false
                //     clickable: true, // optional: defaults to true
                //     visible: true, // optional: defaults to true
                //     control: {}
                // })
                // }, 10000);

                var googleMapEndPoint = "http://maps.googleapis.com/maps/api/geocode/json";
                //address=santa+cruz&components=postal_code:"+zipcode+"&sensor=false
                $http({
                  url:googleMapEndPoint + "?address=melbourne&components=postal_code:" + 3000 + "&sensor=false",
                  method: "POST"
                }).then(function successCallback(response) {
                  console.log(response);
                  var location = response.data.results[0].geometry.location;
                  console.log(location);
                }, function errorCallback(response) {
                  $window.location.href = dashboardEndpoint;
                  alert(response.data.error);
                });

                $scope.unemployment_afl_graph.labels = aurin_per_100;
                $scope.unemployment_afl_graph.data = [income, score];
                var i;
                var table_data = []
                for(i=0; i<sla.length; i++) {
                    table_data.push({sla:sla[i], aurin:aurin[i], tweet_count:tweet_count[i], aurin_per_100:aurin_per_100[i], tweets_per_1000:tweets_per_1000[i]});
                }
                $scope.unemployment_afl_analysis_table = table_data;
            }, function errorCallback(response) {
                $window.location.href = dashboardEndpoint;
                alert(response.data.error);
            });
        }
    }]);

})();
