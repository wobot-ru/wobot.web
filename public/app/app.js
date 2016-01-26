;(function (window, angular) {
    "use strict";

    var modules = {
        shared: angular.module('shared', [])
    };
    var app = angular.module('app', ['ui.router', modules.shared.name]);

    window.modules = modules;
    window.app = app;

    app.run(['$rootScope', '$timeout', 'progress','dialogService', function($rootScope, $timeout, progress, dialogService){

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            //console.log('$stateChangeStart');
            progress.start();
        });

        $rootScope.$on('$stateChangeSuccess', function (event, current) {
            //console.log('$stateChangeSuccess');
            //$timeout(function(){progress.stop();}, 1000);
            progress.stop();
            //$rootScope.title = current.title;
        });

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            progress.stop();
            dialogService.alert(error.data, 'System error');
            //httpErrorHandler.handle(error, {name: toState.name, params: toParams});
        });

    }]);

})(window, window.angular);