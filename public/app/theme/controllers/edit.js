;(function (module) {
    "use strict";
    module.controller("ThemeEditCtrl", ['$scope', '$location', '$window', 'HTTP_STATUS_CODES', 'progress', 'dialogService', 'model', 'options', 'service',
        function ($scope, $location, $window, HTTP_STATUS_CODES, progress, dialogService, model, options, service) {

            $scope.currentUrl = $location.url();
            $scope.options = options;
            $scope.model = model;
            $scope.errors = {};

            $scope.navigateBack = function () {
                if ($scope.options.returnUrl) {
                    $location.url($scope.options.returnUrl);
                } else {
                    $window.history.back();
                }
            };

            $scope.cancel = function () {
                $scope.navigateBack();
            };

            $scope.clearErrors = function () {
                $scope.errors = {};
            };

            $scope.doSave = function () {
                return service.save($scope.model);
            };

            $scope.onSaveSuccess = function (data) {
                $scope.navigateBack();
            };

            $scope.save = function () {
                if (!service) {
                    throw new Error('Service is undefined');
                }
                progress.start();
                var op = $scope.doSave();
                op.success(function (data) {
                    $scope.onSaveSuccess(data);
                });
                op.error(function (response) {
                    if (response.status === HTTP_STATUS_CODES.BAD_REQUEST) {
                        $scope.errors = response.data;
                    }
                    else {
                        dialogService.alert(response.data, 'System error');
                    }
                });
                op.always(function () {
                    progress.stop();
                });
            };

        }]);

})(window.app);