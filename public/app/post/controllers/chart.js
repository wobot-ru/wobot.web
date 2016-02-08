;(function (module, moment) {
    "use strict";

    var renderChart = function (params) {
        //workaround for bug in version 4.2.2
        //http://stackoverflow.com/questions/35201995/uncaught-typeerror-cannot-read-property-mouseisdown-of-undefined
        var el = $('#inner');
        if (el.length) {
            el.remove();
        }
        el = $('<div id="inner" />');
        $('#chart').append(el);

        $(el).highcharts({
            chart: {
                zoomType: 'x'
            },
            title: {
                text: params.title
            },
            /*subtitle: {
             text: document.ontouchstart === undefined ?
             'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
             },*/
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: params.yAxisTitle
                },
                min: 0
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },

            series: [{
                type: 'area',
                name: params.seriesName,
                data: params.data
            }]
        });
    };

    var INTERVALS = {
        'd': 'дней',
        'w': 'недель',
        'm': 'месяцев'
    };

    var INTERVAL_NUM = 10;

    module.controller("PostChartCtrl", ['$scope', '$location', '$state', 'model', 'query', 'metric', 'interval', 'options', 'closeFn', 'service', 'progress', function ($scope, $location, $state, model, query, metric, interval, options, closeFn, service, progress) {
        $scope.model = model;
        $scope.query = query;
        $scope.options = options;
        $scope.currentUrl = $location.url();

        $scope.currentInterval = interval || 'd';

        $scope.close = function () {
            closeFn();
        };

        $scope.strInterval = function (i) {
            return INTERVAL_NUM + ' ' + INTERVALS[i];
        };

        $scope.renderPosts = function () {
            $scope.currentMetric = 'posts';
            renderChart({
                data: $scope.model.posts,
                title: "Количество упоминаний за последние " + $scope.strInterval($scope.currentInterval),
                yAxisTitle: 'Упоминания',
                seriesName: "Упоминания"
            });

        };

        $scope.renderProfiles = function () {
            $scope.currentMetric = 'profiles';
            renderChart({
                data: $scope.model.profiles,
                title: "Количество авторов за последние " + $scope.strInterval($scope.currentInterval),
                yAxisTitle: 'Авторы',
                seriesName: "Авторы"
            });
        };

        $scope.renderReach = function () {
            $scope.currentMetric = 'reach';
            renderChart({
                data: $scope.model.reach,
                title: "Охват за последние " + $scope.strInterval($scope.currentInterval),
                yAxisTitle: 'Охват',
                seriesName: "Охват"
            });
        };

        $scope.renderEngagement = function () {
            $scope.currentMetric = 'engagement';
            renderChart({
                data: $scope.model.engagement,
                title: "Вовлеченность за последние " + $scope.strInterval($scope.currentInterval),
                yAxisTitle: 'Вовлеченность',
                seriesName: "Вовлеченность"
            });
        };

        $scope.render = function (metric) {
            if (metric === 'posts') return $scope.renderPosts();
            if (metric === 'profiles') return $scope.renderProfiles();
            if (metric === 'reach') return $scope.renderReach();
            if (metric === 'engagement') return $scope.renderEngagement();
            return $scope.renderPosts();
        };

        $scope.byDay = function () {
            $state.go('search.chart', {q: JSON.stringify($scope.query), metric: $scope.currentMetric, interval: 'd'});
        };

        $scope.byWeek = function () {
            $state.go('search.chart', {q: JSON.stringify($scope.query), metric: $scope.currentMetric, interval: 'w'});
        };
        $scope.byMonth = function () {
            $state.go('search.chart', {q: JSON.stringify($scope.query), metric: $scope.currentMetric, interval: 'm'});
        };

        $scope.render(metric);


    }]);

})(window.app, window.moment);