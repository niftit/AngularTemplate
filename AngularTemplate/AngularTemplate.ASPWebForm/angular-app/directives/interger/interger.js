
(function () {

    angular.module(constants.appName).directive("interger", integerDr);

    integerDr.$inject = ['$parse'];

    var INTEGER_REGEXP = /^\-?\d+$/;

    function integerDr($parse) {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, elm, attrs, ctrl) {
                var maxlength = 10;
                function formatNumber(nStr) {
                    nStr += '';
                    var x = nStr.split('.');
                    var x1 = x[0];
                    var x2 = x.length > 1 ? '.' + x[1] : '';
                    var rgx = /(-?\d+)(\d{3})/;
                    while (rgx.test(x1))
                        x1 = x1.replace(rgx, '$1' + ',' + '$2');
                    return x1 + x2;
                }

                function stripNonNumeric(str) {
                    str += '';
                    //integer
                    str = str.split('.')[0];
                    if (str.charAt(0) == '0' && str.length > 1) {
                        str = str.substring(1, str.length);
                    } else if (str.charAt(0) == '-' && str.charAt(1) == '0') {
                        str = "-" + str.substring(2, str.length)
                    }
                    /*******************/
                    var rgx = /^\d|\.|-$/;
                    var out = '';
                    for (var i = 0; i < str.length; i++) {
                        if (rgx.test(str.charAt(i))) {
                            if (!((str.charAt(i) == '.' && out.indexOf('.') != -1) ||
                                (str.charAt(i) == '-' && out.length != 0))) {
                                out += str.charAt(i);
                            }
                        }
                    }
                    return out;
                }

                attrs.$observe('ngModel', function (value) { // Got ng-model bind path here
                    scope.$watch(value, function (newVal) { // Watch given path for changes
                        var seperatedNumber = formatNumber(stripNonNumeric(newVal));
                        elm.val(seperatedNumber);
                        var number = seperatedNumber.replace(/,/g, "");

                        if (number != '-') {
                            number = number.substr(0, maxlength);
                            $parse(attrs.ngModel).assign(scope, number.length > 0 ? parseInt(number) : null);
                        }

                        if (ctrl.$viewValue == '--') {
                            ctrl.$setViewValue('-');
                        }
                    });
                });

                elm.on('blur', function () {
                    var parseNumber = parseInt(ctrl.$viewValue);
                    if (isNaN(parseNumber)) {
                        ctrl.$setViewValue(null);
                        $parse(attrs.ngModel).assign(scope, null);
                    }
                });
            }
        };
    };
})();