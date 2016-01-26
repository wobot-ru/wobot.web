;(function (module, $) {
    "use strict";
    //var templateUrl = '/public/app/shared/partials/dialogs/progress.html';
    var template = '<div class="spinner">' +
                        '<div class="bg"></div>' +
                        '<img src="/public/img/loader.gif" alt="Загрузка">' +
                    '</div>';

    /**
     * @name progress
     */
    module.service('progress', ['$http', '$templateCache', '$compile', function ($http, $templateCache, $compile) {

        var $el;
        return {
            start: function () {
              /*$http.get(templateUrl, { cache: $templateCache }).success(function (data) {
                    $el = $(data);
                    $el.appendTo('body');
                });*/
                $el = $(template);
                $el.appendTo('body');
            },
            stop: function () {
                if ($el){
                    $el.remove();
                }
            }
        };
    }]);

})(window.modules.shared, window.$);