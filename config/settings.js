var auth = 'es:Elastic777';

module.exports = {
    es:{
        // hosts: ['127.0.0.1:9200'],
        hosts: [
            {host: '91.218.113.136', port: 9200, auth: auth},
            {host: '91.210.105.210', port: 9200, auth: auth}
        ],
        // log: 'trace',
        index: 'wobot33'
    },
    mongo:{
        // url: 'mongodb://localhost:27017/focus_crawl_db',
        url: 'mongodb://91.218.113.211:27035/focus_crawl_db'
    },
    app:{
        port:3001
    }
};
