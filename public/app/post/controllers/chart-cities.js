;(function (module) {
    "use strict";

    var renderChart = function (params) {
        $('#chart').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'География упоминаний'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.2f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                name: 'Доля упоминаний',
                colorByPoint: true,
                data: params.data
            }]
        });
    };



    module.controller("PostsByCitiesChartCtrl", ['$scope', 'model', 'closeFn', function ($scope, model, closeFn) {
        $scope.close = function () {
            closeFn();
        };
        renderChart({data: model});
    }]);

})(window.app);