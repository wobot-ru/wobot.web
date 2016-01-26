;(function (module) {
    "use strict";
    
    var generatePages = function (currentPage, pageSize, totalItems) {
        var visiblePagesCount = 10,
            totalPagesCount = Math.ceil(totalItems / pageSize),
            i, first, last, half = Math.floor(visiblePagesCount / 2);

        var pages = [];

        if (currentPage - visiblePagesCount < 0) {
            last = visiblePagesCount;
            first = last - visiblePagesCount + 1; //1;
        } else if (currentPage + visiblePagesCount > totalPagesCount) {
            last = totalPagesCount;
            first = last - visiblePagesCount + 1;
        } else {
            last = currentPage + half;
            first = currentPage - half;
        }

        if (last > totalPagesCount) {
            last = totalPagesCount;
        }

        //first, prev
        pages.push({ text: '«', val: 1, active: false, disabled: currentPage <= 1, title: 'First page' });
        pages.push({ text: '‹', val: currentPage - 1, active: false, disabled: currentPage <= 1, title: 'Previous page' });

        //prev dots
        if (first > 1) {
            pages.push({ text: '...', val: first - 1, active: false, disabled: false, title: (first - 1) });
        }

        //pages
        for (i = first; i <= last; ++i) {
            pages.push({ text: i, val: i, active: currentPage === i, disabled: false, title: i });
        }

        //final dots
        if (last < totalPagesCount) {
            pages.push({ text: '...', val: last + 1, active: false, disabled: false, title: (last + 1) });
        }
        //next, last
        pages.push({ text: '›', val: currentPage + 1, active: false, disabled: currentPage >= totalPagesCount, title: 'Next page' });
        pages.push({ text: '»', val: totalPagesCount, active: false, disabled: currentPage >= totalPagesCount, title: 'Last page' });

        return pages;
    };

    /**
     * @name ngPager
     */
    module.directive('ngPager', function () {

        var calculatePages = function (scope) {
            scope.visible = scope.ngPageSize < scope.ngTotal;
            scope.pages = generatePages(scope.ngCurrentPage, scope.ngPageSize, scope.ngTotal);
        };

        return {
            restrict: 'A',
            scope: {
                ngCurrentPage: '=',
                ngTotal: '=',
                ngPageSize: '=?',
                ngPageClick: '&'
            },
            replace: true,
            templateUrl: '/public/app/shared/partials/pager/pager.html',
            link: function (scope, el, attrs, formCtrl) {

                if (scope.ngPageSize === undefined) {
                    scope.ngPageSize = 20;
                }

                scope.visible = scope.ngTotal > scope.ngPageSize;

                scope.$watch(function () { return scope.ngCurrentPage; }, function () {
                    calculatePages(scope);
                });

                scope.$watch(function () { return scope.ngTotal; }, function () {
                    calculatePages(scope);
                });

                scope.$watch(function () { return scope.ngPageSize; }, function () {
                    calculatePages(scope);
                });
            }
        };
    });
    
    module.directive('ngPageSizeSelector', function () {

        return {
            restrict: 'AE',
            scope: {
                ngPageSize: '=',
                ngSizeChange: '&'
            },
            replace: true,
            templateUrl: '/public/app/shared/partials/pager/page-size-selector.html',
            link: function (scope, el, attrs, formCtrl) {
            }
        };
    });

})(window.modules.shared);
