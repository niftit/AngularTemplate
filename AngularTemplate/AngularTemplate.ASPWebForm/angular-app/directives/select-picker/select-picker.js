'use strict';
// Controller to featch data from config list
(function () {

    angular.module(constants.appName)
        .directive("selectPicker", selectPickerFn);
    selectPickerFn.$inject = ['$timeout'];
    function selectPickerFn($timeout) {
        return {
            restrict: 'AE',
            scope: {
                data: '=',
                selectedItem: '=',
                deselectable: '@'

            },
            link: function (scope, element, attrs, ngModelCtrl) {
                var deselectLabel = "-Deselect-";
                var deselectable = scope.deselectable == "true" ? true : false;
                if (deselectable) {
                    attrs.$observe('title', function () {
                        var selectTitle = $(element).attr("title");
                        if (selectTitle) {
                            if ($(element).find("option[value='']").length == 0) {
                                $(element).prepend("<option class='deselect' value='' title='" + selectTitle + "'>" + deselectLabel + "</option>")
                            }
                            else {
                                $($(element).find("option[value='']")[0]).addClass("deselect");
                                $($(element).find("option[value='']")[0]).attr("title", selectTitle);
                                $($(element).find("option[value='']")[0]).text(deselectLabel);
                            }
                        }
                    });
                }


                $(element).selectpicker({
                    size: 5
                });


                scope.$watchCollection("data", function () {
                    setTimeout(function () {
                        $(element).selectpicker('refresh');
                        if (scope.selectedItem) {
                            $(element).selectpicker('val', scope.selectedItem);
                        }
                    });

                });

                scope.$watch("selectedItem", function () {
                    if (deselectable) {
                        if (!scope.selectedItem || scope.selectedItem.length == 0) {
                            $(element).find("option[value=''].deselect").hide();
                        }
                        else {
                            $(element).find("option[value=''].deselect").show();
                        }
                        $(element).selectpicker('refresh');
                    }
                    if (scope.selectedItem) {
                        $(element).selectpicker('val', scope.selectedItem);
                    }
                });

                attrs.$observe('disabled', function (val) {
                    $(element).selectpicker('refresh');
                })

            }
        }
    }

    angular.module(constants.appName).directive('convertToNumber', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function (val) {
                    return parseInt(val, 10);
                });
                ngModel.$formatters.push(function (val) {
                    return '' + val;
                });
            }
        };
    });

})();
