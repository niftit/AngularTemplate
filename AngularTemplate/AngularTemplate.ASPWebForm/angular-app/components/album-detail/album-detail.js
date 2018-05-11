'use strict';
(function () {
    angular.module(constants.appName).component('albumDetail', {
        templateUrl: "/angular-app/components/album-detail/album-detail.html",
        controllerAs: "vm",
        controller: ["httpService", "$stateParams", function (httpService, $stateParams) {
            var vm = this;
            vm.vars = {
                album: {}
            }
            vm.fn = {

            }

            vm.$onInit = function () {
                var albumId = $stateParams.id;
                httpService.getData("https://jsonplaceholder.typicode.com/albums/" + albumId).then(function (resp) {
                    vm.vars.album = resp;
                });
            }

        }]
    });
})();