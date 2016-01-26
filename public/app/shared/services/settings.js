;(function (module) {
    "use strict";

    /**
     * @name settings
     */
    module.constant('settings', {
        iso_8601_local_time_format: 'YYYY-MM-DDTHH:mm:ss±HH:mm',
        iso_8601_utc_time_format: 'YYYY-MM-DDTHH:mm:ssZ',

        date_format: 'DD.MM.YYYY',
        date_time_short_format: 'DD.MM.YYYY HH:mm',
        date_time_format: 'DD.MM.YYYY HH:mm:ss'
    });

})(window.modules.shared);