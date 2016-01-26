;(function (module, moment) {
    "use strict";
    module.service('postService', ['httpService', function (httpService) {
        var resource = '/api/post/';
        var url = function (action) {
            return resource + action;
        };
        return {
            search: function (query) {
                return httpService.get(url('search'), { params: { q: query } });
            }
        };

    }]);
})(window.app, window.moment);
