;(function(module, $) {
    "use strict";
    
    module.controller('FormErrorsController', ['$scope', function ($scope) {
        var self = this;
        self.errors = [];
        $scope.$watch(function () { return $scope.ngFormErrors; }, function (errors) {
            self.errors = errors;
        });
    }]);

    module.directive('ngFormErrors',function () {
        return {
            restrict: 'A',
            scope: {
                ngFormErrors: '='
            },
            controller: 'FormErrorsController'
        };
    });

    module.directive('ngValidationFor', function () {

        var getInput = function (key) {
            var $input = $('[id="' + key + '"]');

            if (!$input.length) {
                $input = $('[name="' + key + '"]');
            }
            if (!$input.length) {
                $input = $('[data-validation-key="' + key + '"]');
            }
            if (!$input.length) {
                $input = $('[validation-key="' + key + '"]');
            }
            return $input;
        };

        return {
            restrict: 'A',
            require: '^ngFormErrors',
            scope: {
                ngRender: '=?ngRender'
            },
            replace: true,
            template: '<span class="field-validation-error" ng-show="visible()" >{{error.message}}</span>',
            link: function (scope, el, attrs, formErrorsCtrl) {
                var key = attrs.ngValidationFor;

                scope.visible = function () {
                    return scope.ngRender && scope.error;
                };

                scope.$watch(function () { return formErrorsCtrl.errors; }, function (errors) {
                    var $input;
                    var message = errors && errors[key] && errors[key].errors && errors[key].errors.length && errors[key].errors[0].errorMessage ? errors[key].errors[0].errorMessage : null;
                    if (message) {
                        scope.error = { key: key, message: message };
                        $input = getInput(key);
                        if ($input.length) {
                            $input.addClass('input-validation-error');
                            $input.attr('title', message);
                        }
                    }
                    else {
                        scope.error = null;
                        $input = getInput(key);
                        if ($input.length) {
                            $input.removeClass('input-validation-error');
                            $input.attr('title', '');
                        }
                    }
                });

            }
        };
    });

})(window.modules.shared, window.$);