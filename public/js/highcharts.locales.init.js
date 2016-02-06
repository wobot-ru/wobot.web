;(function(Highcharts){
    "use strict";
    Highcharts.setOptions({
        lang: {
            months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            shortMonths: ['янв', 'фев', 'март', 'апр', 'май', 'июнь',  'июль', 'авг', 'сен', 'окт', 'нояб', 'дек'],
            weekdays: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
        },
        global: {
            //getTimezoneOffset: func...
            useUTC: false
        }
    });
})(window.Highcharts);
