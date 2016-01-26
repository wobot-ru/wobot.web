;(function (module) {
    "use strict";
    /**
    * @name HTTP_STATUS_CODES
    */
    module.constant('HTTP_STATUS_CODES', {
        BAD_REQUEST: 400,
        NOT_FOUND: 404,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        UNPROCESSABLE_ENTITY: 422,
        INTERNAL_SERVER_ERROR: 500
    });

    module.config(['$provide', function ($provide) {
        $provide.decorator('$q', ['$delegate', function ($delegate) {
            var defer = $delegate.defer;
            $delegate.defer = function () {
                var deferred = defer();

                //shorthand for promise.then(callback)
                deferred.promise.success = function (callback) {
                    deferred.promise.then(function (value) {
                        callback(value);
                    });
                    return deferred.promise;
                };
                //shorthand for promise.then(null, callback)
                deferred.promise.error = function (callback) {
                    deferred.promise.then(null, function (value) {
                        callback(value);
                    });
                    return deferred.promise;
                };
                //shorthand for promise.finally(callback)
                deferred.promise.always = function (callback) {
                    deferred.promise['finally'](function (value) {
                        callback(value);
                    });
                    return deferred.promise;
                };

                return deferred;
            };
            return $delegate;
        }]);
    }]);

    /**
    * @name httpService
    */
    module.factory('httpService', ['$http', '$q', function ($http, $q) {
        return {
            get: function (url, config) {
                var d = $q.defer();
                var request = $http.get(url, config);
                request.success(function (data) {
                    d.resolve(data);
                });
                request.error(function (data, status, headers, cfg) {
                    d.reject({ data: data, status: status, headers: headers, config: cfg });
                });
                return d.promise;
            },
            post: function (url, data, config) {
                var d = $q.defer();
                var request = $http.post(url, data, config);
                request.success(function (responseData) {
                    d.resolve(responseData);
                });
                request.error(function (responseData, status, headers, cfg) {
                    d.reject({ data: responseData, status: status, headers: headers, config: cfg });
                });
                return d.promise;
            }
        };
    }]);

})(window.modules.shared);