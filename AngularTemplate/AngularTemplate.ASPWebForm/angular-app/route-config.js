'use strict';
(function () {
    angular.module(constants.appName).config(["$locationProvider", "$stateProvider", "$urlRouterProvider",
        function ($locationProvider, $stateProvider, $urlRouterProvider) {
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
})();