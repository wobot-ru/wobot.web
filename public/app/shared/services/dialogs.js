;(function (module, angular) {
    "use strict";
    /**
     * @name dialogService
     */
    module.service('dialogService', ['$http', '$templateCache', '$compile', '$rootScope', function ($http, $templateCache, $compile, $rootScope) {

        var confirmDialogTemplate = '/public/app/shared/partials/dialogs/confirm.html';
        var alertDialogTemplate = '/public/app/shared/partials/dialogs/alert.html';

        var openDialog = function ($el) {
            $el.modal({ show: true, backdrop: false });
        };

        var closeDialog = function ($el) {
            $el.modal('hide');
            $el.remove();
        };

        var confirm = function (message, title) {
            var $dialog,
                okCallback,
                cancelCallback,

                result = {
                    ok: function (callback) {
                        okCallback = callback;
                        return result;
                    },
                    cancel: function (callback) {
                        cancelCallback = callback;
                        return result;
                    }
                },

                scope = angular.extend($rootScope.$new(true), {
                    title: title || 'Confirm',
                    message: message,
                    ok: function () {
                        closeDialog($dialog);
                        if (okCallback) {
                            okCallback();
                        }
                    },
                    cancel: function () {
                        closeDialog($dialog);
                        if (cancelCallback) {
                            cancelCallback();
                        }
                    }
                })
                ;

            $http.get(confirmDialogTemplate, { cache: $templateCache }).success(function (data) {
                var link = $compile(data);
                $dialog = link(scope);
                openDialog($dialog);
            });

            return result;
        };

        var alert = function (message, title) {
            var $dialog,
                okCallback,
                
                result = {
                    ok: function (callback) {
                        okCallback = callback;
                        return result;
                    }
                },

                scope = angular.extend($rootScope.$new(true), {
                    title: title || 'Alert',
                    message: message,
                    close: function () {
                        closeDialog($dialog);
                        if (okCallback) {
                            okCallback();
                        }
                    }
                })
                ;

            $http.get(alertDialogTemplate, { cache: $templateCache }).success(function (data) {
                var link = $compile(data);
                $dialog = link(scope);
                openDialog($dialog);
            });

            return result;

        };

        return {
            alert: alert,
            confirm: confirm
        };
    }]);

})(window.modules.shared, window.angular);