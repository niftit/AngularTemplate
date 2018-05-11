'use strict';
(function () {
    angular.module(constants.appName).directive("datetimePicker", datetimePickerFn);
    datetimePickerFn.$inject = ['$rootScope'];
    function datetimePickerFn($rootScope) {
        return {
            restrict: 'AE',
            require: 'ngModel',
            scope: {
                format: '=',
                invalidCondition: '@',
                viewValue: '='
            },
            templateUrl: "/angular-app/directives/datetime-picker/datetime-picker.html", //constants.rootAssetsUrl + 
            link: function (scope, element, attrs, ngModelCtrl) {

                scope.vars = {
                    viewValue: ""
                }

                var dtFormat = constants.dateFormat;//$rootScope.settings.dateTimeFormat
                var disabledHours = [];
                var disabledHoursTemp = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
                var stepping = 1;

                $(element).datetimepicker({
                    format: dtFormat,
                    locale: 'en',
                    useCurrent: false
                });

                scope.$watch("format", function () {
                    if (scope.format) {
                        dtFormat = scope.format;
                    }

                    if (ngModelCtrl.$modelValue) {
                        ngModelCtrl.$setViewValue(moment(ngModelCtrl.$modelValue).format(dtFormat));
                        $(element).data("DateTimePicker").format(dtFormat);
                    }

                });

                $(element).on('dp.change', function (e) {
                    scope.$apply(function () {
                        var datetime = e.date;
                        if (datetime) {
                            ngModelCtrl.$setViewValue(moment(datetime._d).format(dtFormat));
                        }
                    });
                });

                scope.$watch("vars.viewValue", function () {
                    ngModelCtrl.$setViewValue(scope.vars.viewValue);
                })

                ngModelCtrl.$formatters.push(function (modelValue) {
                    if (modelValue) {
                        return moment(modelValue).format(dtFormat)
                    }
                    return "";
                });

                ngModelCtrl.$render = function () {
                    scope.vars.viewValue = ngModelCtrl.$viewValue;
                };

                ngModelCtrl.$parsers.push(function (viewValue) {
                    if (viewValue) {
                        var date = moment(viewValue, dtFormat);
                        if (date) {
                            return date._d;
                        }
                        return null;
                    }
                    return null;
                });

            }
        }
    }
})();