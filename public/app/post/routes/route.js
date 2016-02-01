;(function (module) {
    "use strict";
    module.config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('search', {
            url: '?q',
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
    }]);

})(window.app);
