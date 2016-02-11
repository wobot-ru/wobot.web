;(function (module, _) {
    "use strict";
    module.filter('trusted', ['$sce', function($sce){
        return function(val) {
            return $sce.trustAsHtml(val);
        };
    }]);

    module.filter('decimal', function () {
        return function (obj, sep) {
            //todo: check if obj is number
            sep = sep || ',';
            var str = obj.toFixed(2);
            return str.replace('.', sep);
        };
    });

    module.filter('percentage', function () {
        return function (obj, sep) {
            //todo: check if obj is number
            sep = sep || ',';
            obj = obj * 100;
            var str = obj.toFixed(2);
            return str.replace('.', sep) + '%';
        };
    });

    module.controller("PostListCtrl", ['$scope', '$controller', '$location', '$state', 'model', 'query', 'options', 'service', 'progress', function ($scope, $controller, $location,$state, model, query, options, service, progress) {

        if (model.posts && model.posts.total && model.posts.total > 10000){
            model.posts.total = 10000;
        }

        $scope.model = model;
        $scope.query = query;
        $scope.options = options;
        $scope.currentUrl = $location.url();
        $scope.lastPhrase = $scope.query.filter.phrase;

        $scope.reload = function () {
            var search = {q: JSON.stringify($scope.query)};
            if ($scope.options.returnUrl) {
                search.returnUrl = $scope.options.returnUrl;
            }
            $location.search(search);
        };

        $scope.applyFilter = function () {
            $scope.query.paging.page = 1;
            $scope.reload();
        };

        $scope.searchByPhrase = function(){
            var phrase = $scope.query.filter.phrase;
            $scope.query.filter = {phrase: phrase};
            $scope.query.order.items = [{column: '_score', dir: 'desc'}];
            $scope.applyFilter();
        };

        $scope.filterByDate = function(){
            $scope.query.filter.profiles = [];
            $scope.query.filter.sources = [];
            $scope.query.filter.cities = [];
            $scope.applyFilter();
        };

        $scope.clearDateFilter = function(){
            $scope.query.filter.from = null;
            $scope.query.filter.to = null;
            $scope.applyFilter();
        };

        $scope.filterBySource = function(source){
            var sources = $scope.query.filter.sources = $scope.query.filter.sources || [];
            if (_.includes(sources, source)){
                _.remove(sources, function(x){return x === source;});
            }
            else {
                sources.push(source);
            }
            $scope.query.filter.profiles = [];
            $scope.applyFilter();
        };

        $scope.filterByCity = function(city){
            var cities = $scope.query.filter.cities = $scope.query.filter.cities || [];
            if (_.includes(cities, city)){
                _.remove(cities, function(x){return x === city;});
            }
            else {
                cities.push(city);
            }
            $scope.query.filter.profiles = [];
            $scope.applyFilter();
        };

        $scope.filterByProfile = function(profile){
            var profiles = $scope.query.filter.profiles = $scope.query.filter.profiles || [];
            if (_.includes(profiles, profile)){
                _.remove(profiles, function(x){return x === profile;});
            }
            else {
                profiles.push(profile);
            }
            $scope.applyFilter();
        };

        $scope.changePage = function (page) {
            $scope.query.paging.page = page;
            $scope.reload();
        };

        $scope.cityIsSelected = function(city){
            var cities = $scope.query.filter.cities || [];
            return _.includes(cities, city);
        };

        $scope.sourceIsSelected = function(source){
            var sources = $scope.query.filter.sources || [];
            return _.includes(sources, source);
        };

        $scope.profileIsSelected = function(profile){
            var profiles = $scope.query.filter.profiles || [];
            return _.includes(profiles, profile);
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
                currOrder.dir = 'desc';
            }
            $scope.reload();
        };

        $scope.sortState = function (column) {
            var order = _.find($scope.query.order.items, function(x){return x.column === column;});
            if (order) {
                return 'active ' + order.dir;
            }
            return null;
        };

        $scope.postsChart = function(){
            $state.go('search.chart', {q:  JSON.stringify($scope.query), metric: 'posts'});
        };

        $scope.profilesChart = function(){
            $state.go('search.chart', {q:  JSON.stringify($scope.query), metric: 'profiles'});
        };

        $scope.reachChart = function(){
            $state.go('search.chart', {q:  JSON.stringify($scope.query), metric: 'reach'});
        };

        $scope.engagementChart = function(){
            $state.go('search.chart', {q:  JSON.stringify($scope.query), metric: 'engagement'});
        };

        $scope.citiesChart = function(){
            $state.go('search.chartCities', {q:  JSON.stringify($scope.query)});
        };

    }]);
})(window.app, window._);
