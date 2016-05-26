var Order = function (sortColumn, sortOrder) {
    this.items = [{column: sortColumn || '_id', dir: sortOrder || 'asc'}];
};

var Query = function (data) {
    var self = this;
    if (!(self instanceof Query)) {
        return new Query(data);
    }
    if (typeof(data) === 'string'){
        data = JSON.parse(data);
    }

    data = data || {};
    self.ql = data.ql || false;
    self.filter  = data.filter || {};
    self.paging = data.paging || { page: 1, pagesize: 20 };
    self.order = data.order || new Order();

    return self;
};


Query.prototype.skip = function() {
    var paging = this.paging;
    return paging.pagesize * (paging.page - 1);
};

/*Query.prototype.from = function() {
    return this.skip() + 1;
};*/

Query.prototype.take = function() {
    var paging = this.paging;
    return paging.pagesize;
};

Query.prototype.sort = function() {
    var order = this.order.items[0];
    var result = {};
    result[order.column] = order.dir;
    return result;
};


module.exports = Query;