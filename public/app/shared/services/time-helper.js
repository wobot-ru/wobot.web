;(function (module, moment) {
    "use strict";
    /**
     * @name timeHelper
     */
    module.service('timeHelper',['settings', function(settings){

        var parseFormats = [settings.iso_8601_utc_time_format, settings.date_format, settings.date_time_format];

        var utcToLocal = function(date, outputFormat){
            outputFormat = outputFormat || settings.date_time_format;
            var utcDate = moment.utc(date, parseFormats);
            if (!utcDate.isValid()){
                throw new Error('Invalid date: ' + date);
            }
            var localDate = moment(utcDate.toDate());
            return localDate.format(outputFormat);
        };

        var localToUtc = function(date, outputFormat){
            outputFormat = outputFormat || settings.date_time_format;
            var localDate = moment(date, parseFormats);
            if (!localDate.isValid()){
                throw new Error('Invalid date: ' + date);
            }
            var utcDate = localDate.utc();
            return utcDate.format(outputFormat);
        };

        return {
            utcToLocal: utcToLocal,
            localToUtc: localToUtc
        };

    }]);

})(window.modules.shared, window.moment);