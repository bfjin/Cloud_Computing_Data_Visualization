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

        $scope.violence_income_graph_unit = "$ or level of violence"
        $scope.violence_income_graph = {};
        $scope.violence_income_graph.visible = true;
        $scope.violence_income_graph.series = ["Income", "Level of violence"]
        $scope.violence_income_graph.options = {
            animation: true
        }

        $scope.violence_income_map = {};
        $scope.violence_income_map.violences_data = [];

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
                var table_data = [];
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
                var table_data = [];
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
                var table_data = [];
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

        var googleMapEndPoint = "https://maps.googleapis.com/maps/api/geocode/json";
        function populateLocation(data, index) {
            if (index >= data.length || index < 0) {
                return;
            }

            $http({
                url:googleMapEndPoint + "?key=AIzaSyB6YXV_7HWWXjIeD5o-qzDQHpHCZsvTbBk&address=melbourne&components=postal_code:" + data[index].code + "&sensor=false",
                method: "POST"
            }).then(function successCallback(response) {
                console.log(response);
                var location = response.data.results[0].geometry.location;
                var avg_score = data[index].sum / data[index].num
                var red_weight = '00';
                var green_weight = 'FF';
                if (avg_score < 4) {
                    red_weight = '00';
                } else {
                    red_weight = Math.floor(255 / 10 * avg_score).toString(16).toUpperCase();
                    red_weight = red_weight.length == 1? 0 + red_weight: red_weight;
                }

                if (10 - avg_score <= 6) {
                  green_weight = '00';
                } else {
                  green_weight = Math.floor(255 / 10 * (10 - avg_score)).toString(16).toUpperCase();
                  green_weight = green_weight.length == 1? 0 + green_weight: green_weight;
                }
                var color = '#' +  red_weight + '00' + green_weight;
                console.log(color);
                console.log(location);
                $scope.violence_income_map.violences_data.push({
                    center: {
                        latitude: location.lat,
                        longitude: location.lng
                    },
                    radius: 500,
                    stroke: {
                        color: color,
                        weight: 0.5,
                        opacity: 1
                    },
                    fill: {
                        color: color,
                        opacity: 0.5
                    },
                    geodesic: true, // optional: defaults to false
                    clickable: true, // optional: defaults to true
                    visible: true, // optional: defaults to true
                    control: {}
                });
            });

            setTimeout(populateLocation(data, index+1), 100);
        }

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
                var base_income = income[0];

                // maps data
                $scope.violence_income_map.zoom = 10;
                $scope.violence_income_map.center = {
                    latitude: -37.8152065,
                    longitude: 144.963937
                };
                var postcodes_violences = {};
                postcodes.forEach(function(codes) {
                  var str = codes.replace(/[^0-9,]|/g, '');
                  str.split(',').forEach(function(code) {
                    postcodes_violences[code] = {
                      code: code,
                      num: 0,
                      sum: 0,
                    }
                  });
                });

                postcodes.forEach(function(codes, index) {
                  var str = codes.replace(/[^0-9,]|/g, '');
                  str.split(',').forEach(function(code) {
                    postcodes_violences[code].num = postcodes_violences[code].num + 1;
                    postcodes_violences[code].sum = postcodes_violences[code].sum + score[index];
                  });
                });

                violences_data = [];

                for (code in postcodes_violences) {
                    violences_data.push(postcodes_violences[code]);
                }

                populateLocation(violences_data, 0);

                // graph data
                $scope.violence_income_graph.labels = sla;
                var amplified_score = [];
                for(k=0; k<score.length; k++){
                    amplified_score.push(score[k]*base_income/10);
                }
                $scope.violence_income_graph.data = [income, amplified_score];
                var i;
                var table_data = [];
                for(i=0; i<sla.length; i++) {
                    table_data.push({sla:sla[i], income:income[i], score:score[i]});
                }
                $scope.violence_income_analysis_table = table_data;
            }, function errorCallback(response) {
                $window.location.href = dashboardEndpoint;
                alert(response.data.error);
            });
        }
    }]);

})();
