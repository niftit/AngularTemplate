'use strict';
(function () {
    angular.module(constants.appName).component('photos', {
        templateUrl: "/angular-app/components/photos/photos.html",
        controllerAs: "vm",
        bindings: {
            albumId: "<"
        },
        controller: ["httpService", function (httpService) {
            var vm = this;
            vm.vars = {
                photos: []
            }
            vm.fn = {

            }

            vm.$onChanges = function () {
                httpService.getData("https://jsonplaceholder.typicode.com/photos?albumId=" + vm.albumId).then(function (resp) {
                    vm.vars.photos = resp;
                });
            }

        }]
    });
})();