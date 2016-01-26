;(function (module) {
    "use strict";
    /**
     * @name BaseListCtrl
     */
    module.controller("BaseListCtrl", ['$scope', '$location', '$window', 'dialogService', 'model', 'query', 'options', 'service',
        function ($scope, $location, $window, dialogService, model, query, options, service) {

            $scope.model = model;
            $scope.query = query;
            $scope.options = options;
            $scope.currentUrl = $location.url();

            $scope.navigateBack = function () {
                if ($scope.options.returnUrl) {
                    $location.url($scope.options.returnUrl);
                } else {
                    $window.history.back();
                }
            };

            $scope.reload = function () {
                var search = {q: JSON.stringify($scope.query)};
                if ($scope.options.returnUrl) {
                    search.returnUrl = $scope.options.returnUrl;
                }
                $location.search(search);
            };

            $scope.changePage = function (page) {
                $scope.query.paging.page = page;
                $scope.reload();
            };

            $scope.filter = function () {
                $scope.query.paging.page = 1;
                $scope.reload();
            };

            $scope.sort = function (column) {
                var currOrder = $scope.query.order.items[0];
                if (currOrder.column === column) {
                    if (currOrder.dir === 'asc') {
                        currOrder.dir = 'desc';
                    } else {
                        currOrder.dir = 'asc';
                    }
                } else {
                    currOrder.column = column;
                    currOrder.dir = 'asc';
                }
                $scope.reload();
            };

            $scope.sortState = function (column) {
                var order = $scope.query.order.items.find(function (item) {
                    return item.column === column;
                });
                if (order) {
                    return order.dir;
                }
                return null;
            };

            $scope.remove = function (item) {
                dialogService.confirm('Удалить элемент?').ok(function () {
                    var action = service.remove(item.id);
                    action.success(function (data) {
                        $scope.model.items.remove(item);
                    });
                    action.error(function (response) {
                        window.alert('Не удалось удалить элемент?');
                    });
                });
            };


        }]);

})(window.modules.shared);