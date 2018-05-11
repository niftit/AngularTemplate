'use strict';
(function (define, angular) {
	angular.module(constants.appName, ['ui.router', 'ui.bootstrap', 'ngSanitize']);

	angular.module(constants.appName).config(['$compileProvider',
		function ($compileProvider) {
			$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data|blob|webcal):/);
		}
	]);

	angular.module(constants.appName).config(['$qProvider', function ($qProvider) {
		$qProvider.errorOnUnhandledRejections(false);
	}]);

})(window.define, window.angular);
