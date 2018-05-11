/**
 * @summary   All routes are configured here.
 * @since     2018.02.08
 * @author    Tuan Nguyen
 * @required  Run after all controllers, init.js files.
 */
'use strict';
(function (define, angular) {
    angular.module(constants.appName).config(["$httpProvider", "$locationProvider", "$stateProvider", "$urlRouterProvider",
        function ($httpProvider, $locationProvider, $stateProvider, $urlRouterProvider) {
            $locationProvider.html5Mode(true);
            /*For the case type wrong url*/
            $urlRouterProvider.otherwise('/index');

            /** States **/
            var states = [{
                name: "index",
                url: "/index",
                component: "albums"
            },
            {
                name: "album",
                url: "/albums/{id}",
                component: "albumDetail"
            }]

            _.each(states, function (state) {
                $stateProvider.state(state);
            })

        }])
})(window.define, window.angular);