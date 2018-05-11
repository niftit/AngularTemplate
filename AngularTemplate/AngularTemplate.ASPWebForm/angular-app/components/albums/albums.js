'use strict';
(function () {
    angular.module(constants.appName).component('albums', {
        templateUrl: "/angular-app/components/albums/albums.html",
        controllerAs: "vm",
        controller: ["httpService", function (httpService) {
            var vm = this;
            vm.vars = {
                title: "Albums",
                albums: []
            }
            vm.fn = {

            }

            vm.$onInit = function () {
                httpService.getData("https://jsonplaceholder.typicode.com/albums").then(function (resp) {
                    vm.vars.albums = resp;
                });
            }

        }]
    });
})();