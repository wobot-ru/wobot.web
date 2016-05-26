;(function (module) {
    "use strict";
    module.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $stateProvider.state('theme', {
            url: '/theme',
            'abstract': true,
            template: '<div data-ui-view="" data-autoscroll="false"></div>',
            resolve: {
                service: ['themeService', function (service) {
                    return service;
                }],
                options: ['$stateParams', function ($stateParams) {
                    return {
                        title: '',
                        returnUrl: $stateParams.returnUrl || null
                    };
                }]
            }
        });
        $stateProvider.state('theme.list', {
            url: '/list?q',
            templateUrl: '/public/app/theme/partials/list.html',
            controller: 'ThemeListCtrl',
            resolve: {
                query: ['$stateParams', 'DefaultQuery', function ($stateParams, DefaultQuery) {
                    var q = new DefaultQuery();
                    q.paging.pagesize = 20;
                    return q.extend($stateParams);
                }],
                model: ['$stateParams', 'service', 'query', function ($stateParams, service, query) {
                    return service.list(query);
                }]
            }
        });

        $stateProvider.state('theme.add', {
            url: '/add',
            templateUrl: '/public/app/theme/partials/edit.html',
            controller: 'ThemeEditCtrl',
            resolve: {
                model: ['$stateParams', 'service', function ($stateParams, service) {
                    return service.getEmptyModel();
                }]
            }
        });

        $stateProvider.state('theme.edit', {
            url: '/edit/:id',
            templateUrl: '/public/app/theme/partials/edit.html',
            controller: 'ThemeEditCtrl',
            resolve: {
                model: ['$stateParams', 'service', function ($stateParams, service) {
                    return service.getById($stateParams.id);
                }]
            }
        });


        $urlRouterProvider.when('', ['$state', function ($state) {
            $state.go('theme.list');
        }]);

    }]);

})(window.app);
