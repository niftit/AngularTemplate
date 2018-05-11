'use strict';
(function (define, angular) {
	angular.module(constants.appName)
		.factory("httpService", httpServiceFn);
	httpServiceFn.$inject = ['$http', '$q'];
	function httpServiceFn($http, $q) {

		//get data
		function getData(url, token) {
			// Create the deffered object
            var deferred = $q.defer();
			var request = $http({
				url: url,
				cache: false,
				method: "GET",
                headers: {
                    "accept": "application/json"
                }
			});

			request.then(
				function (resp) {
					deferred.resolve(resp.data);
				},
				function (resp) {
					deferred.reject(resp);
				}
			);
			return deferred.promise;
		}
		//update data
		function putData(url, data) {
			var deferred = $q.defer();
			var request = $http({
				url: url,
				method: "PUT",
				data: JSON.stringify(data),
                headers: {
                    "accept": "application/json"
                }
			});
			request.then(
				function (resp) {
					deferred.resolve(resp.data);
				},
				function (resp) {
					deferred.reject(resp);
				}
			);
			return deferred.promise;
		}
		//post data
		function postData(url, data) {
			var deferred = $q.defer();
			var request = $http({
				url: url,
				method: "POST",
				data: JSON.stringify(data),
                headers: {
                    "accept": "application/json"
                }
			});
			request.then(
				function (resp) {
					deferred.resolve(resp.data);
				},
				function (resp) {
					deferred.reject(resp);
				}
			);
			return deferred.promise;
		}
		//delete data
		function deleteData(url) {
			var deferred = $q.defer();
			var request = $http({
				url: url,
				method: "DELETE",
                headers: {
                    "accept": "application/json"
                }
			});
			request.then(
				function (resp) {
					deferred.resolve(resp.data);
				},
				function (resp) {
					deferred.reject(resp);
				}
			);
			return deferred.promise;
		}

		//patch Data
		function patchData(url, data) {
			var deferred = $q.defer();
			var headerdata = webAPIHeaders;
			var request = $http({
				url: url,
				method: "PATCH",
				data: JSON.stringify(data),
                headers: {
                    "accept": "application/json"
                }
			});
			request.then(
				function (resp) {
					deferred.resolve(resp.data);
				},
				function (resp) {
					deferred.reject(resp);
				}
			);
			return deferred.promise;
		}

		return {
			getData: getData,
			putData: putData,
			postData: postData,
			deleteData: deleteData,
            patchData: patchData
		};

	}
})(window.define, window.angular);
