var moment = require('moment');
var _ = require('lodash');
var auth = 'es:Elastic777';

const MONTHS = 6;

var calculateIndexName = function (months) {
    // return 'wobot33';
    var now = moment.utc();
    var parts = [];
    parts.push({year: now.year(), month: now.month()});

    _.times(months - 1, function () {
        now.subtract(1, 'months');
        parts.push({year: now.year(), month: now.month()});
    });

    return parts.map((x)=>'wobot-monthly-y' + x.year + '*m' + (x.month + 1)).join(',');
};


module.exports = {
    es: {
        hosts: [
            {host: '91.218.113.136', port: 9200, auth: auth},
            {host: '91.210.105.210', port: 9200, auth: auth}
        ],
        // hosts: [
        //     {host: '127.0.0.1', port: 9200, auth: auth}
        // ],
        get index() {
            return calculateIndexName(MONTHS);
        }
    },
    mongo: {
        url: 'mongodb://91.218.113.211:27018/focus_crawl_db'
    },
    app: {
        port: 3001
    }
};