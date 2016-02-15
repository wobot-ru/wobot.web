;(function (module, $) {
    "use strict";

    /* module.factory('DefaultOrder', function () {
         var DefaultOrder = function (sortColumn, sortOrder) {
             this.column = sortColumn || 'id';
             this.dir = sortOrder || 'asc';
         };
         return DefaultOrder;
     });
 
     module.factory('DefaultQuery', ['DefaultOrder', function (DefaultOrder) {
         var DefaultQuery = function (sortColumn, sortOrder) {
             this.filter = {};
             this.paging = { page: 1, pagesize: 20 };
             this.order = [new DefaultOrder(sortColumn, sortOrder)];
         };
         return DefaultQuery;
     }]);*/

    module.provider('DefaultOrder', function () {
        var DefaultOrder = function (sortColumn, sortOrder) {
            this.items = [{column: sortColumn || '_score', dir: sortOrder || 'desc'}];
           /* this.column = sortColumn || 'created';
            this.dir = sortOrder || 'asc';*/
        };
        return {
            $get: function () {
                return DefaultOrder;
            }
        };

    });
    /**
     * @name DefaultQuery
     */
    module.provider('DefaultQuery', ['DefaultOrderProvider', function (DefaultOrderProvider) {
        var DefaultOrder = DefaultOrderProvider.$get(),
             pageSize= 10,
            DefaultQuery = function (sortColumn, sortOrder) {

                var self = this;
                if (!(self instanceof DefaultQuery)) {
                    return new DefaultQuery();
                }

                self.ql = false;
                self.filter = {};
                self.paging = { page: 1, pagesize: pageSize };
                self.order = new DefaultOrder(sortColumn, sortOrder);
                return this;
            };

        DefaultQuery.prototype.extend = function(stateParams) {
            var q = stateParams.q ? JSON.parse(stateParams.q) : {};
            return $.extend(true, this, q);
        };

        return {
            setPageSize: function (size) {
                pageSize = size;
            },
            $get: function () {
                return DefaultQuery;
            }
        };
    }]);
})(window.modules.shared, window.$);