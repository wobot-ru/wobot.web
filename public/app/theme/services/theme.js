;(function (module, moment) {
    "use strict";
    module.service('themeService', ['httpService', function (httpService) {
        var resource = '/api/theme/';
        var url = function (action) {
            return resource + action;
        };
        return {
            getEmptyModel: function() {
                return {
                    id: null,
                    name: '',
                    yandex: {query: '', pages: 10},
                    google: {query: '', pages: 10}
                };
            },
            list: function (query) {
                return httpService.get(url('list'), { params: { q: query } });
            },
            getById: function(id){
                return httpService.get(url('get'), { params: { id: id } });
            },
            remove: function(id){
                return httpService.post(url('remove'), null, { params: { id: id } });
            },
            save: function(model){
                return httpService.post(url('save'), model);
            }
        };

    }]);
})(window.app, window.moment);
