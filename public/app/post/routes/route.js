;(function (module) {
    "use strict";
    module.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('search', {
            url: '/search?q',
            templateUrl: '/public/app/post/partials/search.html',
            controller: 'PostListCtrl',
            resolve: {
                service: ['postService', function (postService) {
                    return postService;
                }],
                query: ['$stateParams', 'DefaultQuery', function ($stateParams, DefaultQuery) {
                    var q = new DefaultQuery();
                    //q.filter.from = moment().add(-3, 'month').format('DD.MM.YYYY');
                    //q.filter.to = moment().format('DD.MM.YYYY');
                    return q.extend($stateParams);
                }],
                model: ['$stateParams', 'service', 'query', function ($stateParams, service, query) {
                    return service.search(query);
                }],
                options: ['$stateParams', function ($stateParams) {
                    return {
                        title: '',
                        returnUrl: $stateParams.returnUrl || null
                    };
                }]
            }
        });

        $stateProvider.state('search.chart', {
            url: '/chart?metric',
            templateUrl: '/public/app/post/partials/chart.html',
            controller: 'PostChartCtrl',
            resolve: {
                model: ['$stateParams', 'postService', 'query', function ($stateParams, postService, query) {
                    return postService.timeSeries(query);
                }],
                metric:['$stateParams', function($stateParams){
                    return $stateParams.metric;
                }],
                closeFn:['$state', '$stateParams', function ($state, $stateParams) {
                    return function () {
                        $state.go('search', {q: $stateParams.q});
                    };
                }]
            }
        });

        $urlRouterProvider.when('', ['$state', function ($state) {
            $state.go('search');
        }]);

    }]);

})(window.app);
