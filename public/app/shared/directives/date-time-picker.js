//https://github.com/Eonasdan/bootstrap-datetimepicker
//http://eonasdan.github.io/bootstrap-datetimepicker/
;(function (module, angular, moment) {
    "use strict";
    /**
     * @name ngDatePicker
     */
    /* module.directive('ngDatePicker', ['settings', function (settings) {
     var defaults = {
     format:settings.date_time_format,
     useCurrent: false
     };

     var utcToLocal = function(date){
     var utcDate = moment.utc(date, settings.date_time_format);
     var localDate = moment(utcDate.toDate());
     return localDate.format(settings.date_time_format);
     };

     var localToUtc = function(date){
     var localDate = moment(date, settings.date_time_format);
     var utcDate = localDate.utc();
     return utcDate.format(settings.date_time_format);
     };

     return {
     restrict: 'A',
     require: "ngModel",
     template: '<div class="input-group date">' +
     '<input type="text" class="form-control" ng-model="ngModel" ng-disabled="ngDisabled" ng-enter="ngEnter()">' +
     '<span ng-hide="ngDisabled" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>' +
     '</div>',
     replace: true,
     scope: {
     ngDisabled: '=',
     ngModel: '=',
     ngEnter: '&?'
     },
     link: function (scope, element, attrs, ctrl) {
     var options = angular.extend({}, defaults, scope.$eval(attrs.ngDatePicker));
     var input = element.children('input');

     input.attr('placeholder', attrs.placeholder);
     input.attr('id', attrs.id);
     input.attr('name', attrs.name);
     input.attr('validation-key', attrs['validation-key']);

     element.datetimepicker(options);
     element.bind("dp.change", function (e) {
     //console.log(e);
     input.trigger('change');
     });

     //from model into view
     /!*ctrl.$formatters.unshift(function(value){
     return utcToLocal(value);
     });*!/

     //view value to model
     /!*ctrl.$parsers.unshift(function(value){
     return localToUtc(value);
     });*!/

     }
     };
     }]);*/

    module.filter('date', ['settings', function(settings){

        return function(input, format){
            format = format || settings.date_time_format;
            var m = moment(input, [settings.iso_8601_utc_time_format, settings.date_format, settings.date_time_format]);
            if (!m.isValid()){
                return input;
            }
            return m.format(format);
        };

    }]);

    module.directive('ngDatePicker', ['settings', 'timeHelper', function (settings, timeHelper) {
        var defaults = {
            format: settings.date_time_format,
            useCurrent: false,
            //sideBySide: true,
            showTodayButton: true,
            showClear: true,
            showClose: true
        };
        return {
            restrict: 'A',
            require: "ngModel",
            link: function (scope, element, attrs, ctrl) {
                var options = angular.extend({}, defaults, scope.$eval(attrs.ngDatePicker));
                element.addClass('type-date');
                element.datetimepicker(options);
                element.bind("dp.change", function (e) {
                    element.trigger('change');
                });

                //from model into view
                ctrl.$formatters.unshift(function (value) {
                    var oldVal = ctrl.$viewValue;
                    try {
                        return timeHelper.utcToLocal(value);
                    }
                    catch (err) {
                        return oldVal;
                    }
                });

                //view value to model
                ctrl.$parsers.unshift(function (value) {
                    var oldVal = ctrl.$modelValue;
                    try {
                        return timeHelper.localToUtc(value);
                    }
                    catch (err) {
                        //return oldVal;
                        return null;
                    }
                });

            }
        };
    }]);

})(window.modules.shared, window.angular, window.moment);
