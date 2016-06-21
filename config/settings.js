module.exports = {
    es:{
        // hosts: ['91.218.113.136:9200'],
        hosts: ['127.0.0.1:9200'],
        //log: 'trace',
        // index: 'wobot33',
        index: 'wobot_ok'
    },
    mongo:{
        url: 'mongodb://localhost:27017/focus_crawl_db'
    },
    app:{
        port:3001
    }
};
