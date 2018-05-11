/* global angular */
'use strict';

(function (define, angular) {

    angular.module(constants.appName)

        // Controller to featch data from config list
        .controller('SummernoteController', ['$scope', '$attrs', '$timeout', '$rootScope', function ($scope, $attrs, $timeout, $rootScope) {
            'use strict';

            var currentElement,
                summernoteConfig = angular.copy($scope.summernoteConfig) || {};

            //placeholder
            summernoteConfig.placeholder = $scope.placeholder || "";
            //disable drag and drop
            summernoteConfig.disableDragAndDrop = true;

            if (angular.isDefined($attrs.height)) { summernoteConfig.height = +$attrs.height; }
            if (angular.isDefined($attrs.minHeight)) { summernoteConfig.minHeight = +$attrs.minHeight; }
            if (angular.isDefined($attrs.maxHeight)) { summernoteConfig.maxHeight = +$attrs.maxHeight; }
            if (angular.isDefined($attrs.placeholder)) { summernoteConfig.placeholder = $attrs.placeholder; }
            if (angular.isDefined($attrs.focus)) { summernoteConfig.focus = true; }
            if (angular.isDefined($attrs.airmode)) { summernoteConfig.airMode = true; }
            if (angular.isDefined($attrs.dialogsinbody)) { summernoteConfig.dialogsInBody = true; }
            if (angular.isDefined($attrs.lang)) {
                if (!angular.isDefined($.summernote.lang[$attrs.lang])) {
                    throw new Error('"' + $attrs.lang + '" lang file must be exist.');
                }
                summernoteConfig.lang = $attrs.lang;
            }

            summernoteConfig.callbacks = summernoteConfig.callbacks || {};

            if (angular.isDefined($attrs.onInit)) {
                summernoteConfig.callbacks.onInit = function (evt) {
                    $scope.init({ evt: evt });
                };
            }
            if (angular.isDefined($attrs.onEnter)) {
                summernoteConfig.callbacks.onEnter = function (evt) {
                    $scope.enter({ evt: evt });
                };
            }
            if (angular.isDefined($attrs.onCtrlEnter)) {
                delete $.summernote.options.keyMap.pc["CTRL+ENTER"];
                delete $.summernote.options.keyMap.mac["CMD+ENTER"];
                summernoteConfig.callbacks.onEnter = function (evt) {

                    if (evt.ctrlKey) {
                        $scope.ctrlEnter({ evt: evt });
                    }
                };
            }
            if (angular.isDefined($attrs.onFocus)) {
                summernoteConfig.callbacks.onFocus = function (evt) {
                    $scope.focus({ evt: evt });
                };
            }
            if (angular.isDefined($attrs.onPaste)) {
                summernoteConfig.callbacks.onPaste = function (evt) {
                    $scope.paste({ evt: evt });
                };
            }
            if (angular.isDefined($attrs.onKeyup)) {
                summernoteConfig.callbacks.onKeyup = function (evt) {
                    $scope.keyup({ evt: evt });
                };
            }

            if (angular.isDefined($attrs.onKeydown)) {
                summernoteConfig.callbacks.onKeydown = function (evt) {
                    $scope.keydown({ evt: evt });
                };
            }

            if (angular.isDefined($attrs.onImageUpload)) {
                summernoteConfig.callbacks.onImageUpload = function (files) {
                    $scope.imageUpload({ files: files, editable: $scope.editable });
                };
            }
            if (angular.isDefined($attrs.onMediaDelete)) {
                summernoteConfig.callbacks.onMediaDelete = function (target) {
                    // make new object that has information of target to avoid error:isecdom
                    var removedMedia = { attrs: {} };
                    removedMedia.tagName = target[0].tagName;
                    angular.forEach(target[0].attributes, function (attr) {
                        removedMedia.attrs[attr.name] = attr.value;
                    });
                    $scope.mediaDelete({ target: removedMedia });
                };
            }

            this.activate = function (scope, element, ngModel) {
                var updateNgModel = function () {
                    var newValue = element.summernote('code');
                    if (element.summernote('isEmpty') && $('.btn-codeview.active').length == 0) { newValue = ''; }
                    if (ngModel && ngModel.$viewValue !== newValue) {
                        $timeout(function () {
                            ngModel.$setViewValue(newValue);
                        }, 0);
                    }
                };

                var originalOnChange = summernoteConfig.callbacks.onChange;
                summernoteConfig.callbacks.onChange = function (contents) {
                    $timeout(function () {
                        if (element.summernote('isEmpty')) {
                            contents = '';
                            //element.summernote("code", "<p><br></p>");
                        }
                        updateNgModel();
                    }, 0);
                    if (angular.isDefined($attrs.onChange)) {
                        $scope.change({ contents: contents, editable: $scope.editable });
                    } else if (angular.isFunction(originalOnChange)) {
                        originalOnChange.apply(this, arguments);
                    }
                };
                var originalOnEnter = summernoteConfig.callbacks.onEnter;
                summernoteConfig.callbacks.onEnter = function (evt) {
                    $timeout(function () {
                        updateNgModel();
                    }, 0);
                    if (angular.isFunction(originalOnEnter)) {
                        originalOnEnter.apply(this, arguments);
                    }
                };

                if (angular.isDefined($attrs.onBlur)) {
                    summernoteConfig.callbacks.onBlur = function (evt) {
                        (!summernoteConfig.airMode) && element.blur();
                        $scope.blur({ evt: evt });
                    };
                }

                //Check allow to mention
                if ($scope.allowToMention == true) {
                    // Hint for mention
                    var listUserMention = angular.copy($rootScope.users);
                    _.remove(listUserMention, function (user) {
                        return user.directoryID == $rootScope.currentUser.directoryID;
                    });

                    summernoteConfig.hint = {
                        mentions: listUserMention,
                        match: /\B@(\w*)$/,
                        search: function (keyword, callback) {
                            callback($.grep(this.mentions, function (item) {
                                var content = item.displayName;
                                return content.toLowerCase().indexOf(keyword.toLowerCase()) == 0;
                            }));
                        },
                        template: function (item) {
                            return '<img src="' + item.image + '"/> ' + item.displayName;
                        },
                        content: function (item) {
                            removeUserNoteMentioned();
                            return $('<span class="summernote-mention"><i user-id="' + item.directoryID + '" class="mention-users">@' + item.displayName + '</i>&nbsp;</span>')[0];
                        }
                    }
                }

                // remove user not mentioned
                function removeUserNoteMentioned() {
                    setTimeout(function () {
                        $('.note-editable').find(".summernote-mention").each(function (i, elm) {
                            if ($(elm)[0].innerText == "") {
                                $(elm).remove();
                            }
                        });
                    }, 500);
                }
                Array.prototype.insert = function (index, item) {
                    this.splice(index, 0, item);
                };
                //layout/template
                var customToolbar = angular.copy($.summernote.options.toolbar);
                customToolbar.push(["customLayout", ["layout", "template"]]);
                customToolbar.insert(3, ["fontsize", ["fontsize"]]);
                summernoteConfig.toolbar = customToolbar;

                element.summernote(summernoteConfig);

                var editor$ = element.next('.note-editor'),
                    unwatchNgModel;
                editor$.find('.note-toolbar').click(function () {
                    updateNgModel();

                    // sync ngModel in codeview mode
                    if (editor$.hasClass('codeview')) {
                        editor$.on('keyup', updateNgModel);
                        if (ngModel) {
                            unwatchNgModel = scope.$watch(function () {
                                return ngModel.$modelValue;
                            }, function (newValue) {
                                editor$.find('.note-codable').val(newValue);
                            });
                        }
                    } else {
                        editor$.off('keyup', updateNgModel);
                        if (angular.isFunction(unwatchNgModel)) {
                            unwatchNgModel();
                        }
                    }
                });


                //tab index
                var tabIndex = $attrs.tabindex;
                if (tabIndex) {
                    editor$.find(".note-editable").attr("tabindex", tabIndex);
                    delete $.summernote.options.keyMap.pc.TAB;
                    delete $.summernote.options.keyMap.mac.TAB;
                }

                //hide layout
                $('.note-customLayout').hide();

                if (ngModel) {
                    ngModel.$render = function () {
                        if (ngModel.$viewValue) {
                            element.summernote('code', ngModel.$viewValue);
                        } else {
                            element.summernote('empty');
                        }
                    };
                }

                // set editable to avoid error:isecdom since Angular v1.3
                if (angular.isDefined($attrs.editable)) {
                    $scope.editable = editor$.find('.note-editable');
                }
                if (angular.isDefined($attrs.editor)) {
                    $scope.editor = element;
                }

                currentElement = element;
                // use jquery Event binding instead $on('$destroy') to preserve options data of DOM
                element.on('$destroy', function () {
                    element.summernote('destroy');
                    $scope.summernoteDestroyed = true;
                });
            };

            $scope.$on('$destroy', function () {
                // when destroying scope directly
                if (!$scope.summernoteDestroyed) {
                    currentElement.summernote('destroy');
                }
            });
        }])
        .directive('summernote', [function () {
            'use strict';

            return {
                restrict: 'EA',
                transclude: 'element',
                replace: true,
                require: ['summernote', '?ngModel'],
                controller: 'SummernoteController',
                scope: {
                    summernoteConfig: '=config',
                    editable: '=',
                    editor: '=',
                    init: '&onInit',
                    enter: '&onEnter',
                    ctrlEnter: '&onCtrlEnter',
                    focus: '&onFocus',
                    blur: '&onBlur',
                    paste: '&onPaste',
                    keyup: '&onKeyup',
                    keydown: '&onKeydown',
                    change: '&onChange',
                    imageUpload: '&onImageUpload',
                    mediaDelete: '&onMediaDelete',
                    placeholder: '@',
                    allowToMention: '='
                },
                template: '<div></div>',
                link: function (scope, element, attrs, ctrls, transclude) {
                    var summernoteController = ctrls[0],
                        ngModel = ctrls[1];

                    if (!ngModel) {
                        transclude(scope, function (clone, scope) {
                            // to prevent binding to angular scope (It require `tranclude: 'element'`)
                            element.append(clone.html());
                        });
                        summernoteController.activate(scope, element, ngModel);
                    } else {
                        var clearWatch = scope.$watch(function () { return ngModel.$viewValue; }, function (value) {
                            clearWatch();
                            element.append(value);
                            summernoteController.activate(scope, element, ngModel);
                        }, true);
                    }
                    //$(element).summernote({
                    //    toolbar: [
                    //        ['style', ['style']],
                    //        ['font', ['bold', 'underline', 'clear']],
                    //        ['fontname', ['fontname']],
                    //        ['fontsize', ['fontsize']],
                    //        ['color', ['color']],
                    //        ['para', ['ul', 'ol', 'paragraph']],
                    //        ['table', ['table']],
                    //        ['insert', ['link', 'picture', 'video']],
                    //        ['view', ['fullscreen', 'codeview','help']]
                    //    ],
                    //    callbacks: {
                    //        onPaste: function (e) {

                    //        }
                    //    }
                    //});
                    
                }
            };
        }]);
})(window.define, window.angular)
