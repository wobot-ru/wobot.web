; (function () {

    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (searchElement, fromIndex) {
            if (this === undefined || this === null) {
                throw new TypeError('"this" is null or not defined');
            }

            var length = this.length >>> 0; // Hack to convert object.length to a UInt32

            fromIndex = +fromIndex || 0;

            if (Math.abs(fromIndex) === Infinity) {
                fromIndex = 0;
            }

            if (fromIndex < 0) {
                fromIndex += length;
                if (fromIndex < 0) {
                    fromIndex = 0;
                }
            }

            for (; fromIndex < length; fromIndex++) {
                if (this[fromIndex] === searchElement) {
                    return fromIndex;
                }
            }

            return -1;
        };
    }

    if (!Array.prototype.unique) {
        Array.prototype.unique = function () {
            var unique = [];
            for (var i = 0; i < this.length; i++) {
                if (unique.indexOf(this[i]) === -1) {
                    unique.push(this[i]);
                }
            }
            return unique;
        };
    }

    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
    if ('function' !== typeof Array.prototype.reduce) {
        Array.prototype.reduce = function (callback /*, initialValue*/) {
            'use strict';
            if (null === this || 'undefined' === typeof this) {
                throw new TypeError(
                    'Array.prototype.reduce called on null or undefined');
            }
            if ('function' !== typeof callback) {
                throw new TypeError(callback + ' is not a function');
            }
            var t = Object(this), len = t.length >>> 0, k = 0, value;
            if (arguments.length >= 2) {
                value = arguments[1];
            } else {
                while (k < len && !k in t) k++;
                if (k >= len)
                    throw new TypeError('Reduce of empty array with no initial value');
                value = t[k++];
            }
            for (; k < len ; k++) {
                if (k in t) {
                    value = callback(value, t[k], k, t);
                }
            }
            return value;
        };
    }

    if (!Array.prototype.filter) {
        Array.prototype.filter = function (predicate) {
            var result = [], len = this.length;
            for (var i = 0; i < len; ++i) {
                if (predicate(this[i])) {
                    result.push(this[i]);
                }
            }
            return result;
        };
    }

    if (!Array.prototype.forEach) {

        Array.prototype.forEach = function (callback) {
            var len = this.length;
            for (var i = 0; i < len; ++i) {
                callback(this[i]);
            }
        };
    }

    if (!Array.prototype.map) {
        Array.prototype.map = function (callback) {
            var result = [], len = this.length;
            for (var i = 0; i < len; ++i) {
                result.push(callback(this[i]));
            }
            return result;
        };
    }

    if (!Array.prototype.clear) {
        Array.prototype.clear = function () {
            while (this.length > 0) {
                this.pop();
            }
        };
    }

    if (!Array.prototype.find) {
        Array.prototype.find = function (predicate) {
            var element, i, len = this.length;
            for (i = 0; i < len; i++) {
                element = this[i];
                if (predicate(element)) {
                    return element;
                }
            }
            return null;
        };
    }

    if (!Array.prototype.some) {
        Array.prototype.some = function (predicate) {
            return !!this.find(predicate);
        };
    }

    if (!Array.prototype.remove) {
        Array.prototype.remove = function (item) {
            var i = this.indexOf(item);
            if (i != -1) {
                this.splice(i, 1);
            }

            return i;
        };
    }

    if (!Array.prototype.insert) {
        Array.prototype.insert = function (index, item) {
            this.splice(index, 0, item);
        };
    }

    if (!String.prototype.format) {
        String.prototype.format = function () {
            var result = this;
            for (var i = 0; i < arguments.length; i++) {
                var regexp = new RegExp('\\{' + i + '\\}', 'gi');
                result = result.replace(regexp, arguments[i]);
            }
            return result;
        };
    }

    if (!Date.prototype.getAge) {
        Date.prototype.getAge = function () {
            var nowDate = new Date();
            var birthDate = this;
            return nowDate.getFullYear() - birthDate.getFullYear() - (birthDate.getDayOfYear() < nowDate.getDayOfYear() ? 0 : 1);
        };
    }

    if (!Date.prototype.getDayOfYear) {
        Date.prototype.getDayOfYear = function () {
            var onejan = new Date(this.getFullYear(), 0, 1);
            return Math.ceil((this - onejan) / 86400000);
        };
    }

    if (!String.prototype.contains) {
        String.prototype.contains = function () {
            return String.prototype.indexOf.apply(this, arguments) !== -1;
        };
    }

    if (!String.prototype.isValidDate) {
        String.prototype.isValidDate = function () {
            var start = moment("01.01.1900", "DD.MM.YYYY"),
                end = moment("06.06.2079", "DD.MM.YYYY"),
                date = moment(this, ['YYYY-MM-DDTHH:mm:ssZ', 'DD.MM.YYYY']);

            if (date.isValid()) {
                if (date.diff(start) < 0) {
                    return false;
                }
                if (date.diff(end) > 0) {
                    return false;
                }

                return true;
            }
            return false;
        };
    }

    if (!String.prototype.getUrl) {
        String.prototype.getUrl = function (parameters) {
            var url = this;
            var qs = "";
            for (var key in parameters) {
                var value = parameters[key];
                if (value)
                    qs += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
            }
            if (qs.length > 0) {
                qs = qs.substring(0, qs.length - 1); //chop off last "&"
                url = url + "?" + qs;
            }
            return url;
        }
    }

    if (!String.prototype.isJson) {
        String.prototype.isJson = function (parameters) {
            var str = this;
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }
    }
})();



