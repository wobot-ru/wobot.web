;(function (module, $, angular) {
    "use strict";

    module.directive('ngTooltip', function () {
        var defaults = {placement: 'bottom', html: true};
        return {
            restrict: 'A',
            scope: {
                ngTooltip: '='
            },
            link: function (scope, el, attrs, formCtrl) {
               /* var options = angular.extend({}, defaults, scope.$eval(attrs.ngTooltip));*/
                var createTooltip = function () {
                    var options = angular.extend({}, defaults, scope.ngTooltip);
                    el.tooltip('destroy');
                    if (scope.ngTooltip) {
                        el.tooltip(options);
                    }
                };

                scope.$watch('ngTooltip', function () {
                    createTooltip();
                });

                //createTooltip();

            }
        };
    });

    /**
     * @name ngPopover
     */
    module.directive('ngPopover', function () {
        var counter = 0;
        return {
            restrict: 'A',
            scope: {
                ngPopoverTitle: '@',
                ngPopoverContent: '@',
                ngPlacement: '@'
            },
            link: function (scope, el, attrs, formCtrl) {

                var closeButtonId = 'btnPopoverClose' + (++counter);
                scope.ngPopoverTitle = scope.ngPopoverTitle || 'Info';
                scope.ngPlacement = scope.ngPlacement || 'top';

                el.popover({
                    title: scope.ngPopoverTitle + '<button style="font-size: 16px;" type="button" class="close" id="' + closeButtonId + '">×</button>',
                    content: scope.ngPopoverContent,
                    //content: scope.$eval(attrs.ngPopoverContent),
                    html: true,
                    placement: scope.ngPlacement
                });

                el.on('shown.bs.popover', function () {
                    var $el = $(this), $popup = $el.data('bs.popover').tip();
                    $('#' + closeButtonId).on('click', function () {
                        $el.popover('hide');
                        $popup.detach();
                    });
                });
            }
        };
    });

})(window.modules.shared, window.$, window.angular);
