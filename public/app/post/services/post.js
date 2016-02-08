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
            },
            timeSeries: function(query, interval){
                return httpService.get(url('time-series'), { params: { q: query, interval:interval} });
            }
        };

    }]);
})(window.app, window.moment);
