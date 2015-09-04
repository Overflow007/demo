'use strict';

define(['app'], function (app) {

    var injectParams = ['$location', '$routeParams',  '$http', 'authService','popupService'];

    var RegisterController = function ($location, $routeParams,$http,authService,popupService) {
        var vm = this,
            path = '/';

        vm.email = null;
        vm.password = null;
        vm.repeatPassword = null;
        vm.name = null;
        vm.errorMessage = null;

        vm.register = function () {
            authService.register(vm.email, vm.password, vm.name)
                .error(function (data, status, headers, config) {
                    //$localStorage.token = null;
                    $http.defaults.headers.common.Authorization = null;
                    vm.errorMessage = data;//'Unable to login';
                    popupService.alert(data);
                }).then(function (data) {
                    //$routeParams.redirect will have the route
                    //they were trying to go to initially
                    if (!$http.defaults.headers.common.Authorization) {
                        vm.errorMessage = 'Unable to login';
                        return;
                    }

                    if ($http.defaults.headers.common.Authorization && $routeParams && $routeParams.redirect) {
                        path = path + $routeParams.redirect;
                    }

                    $location.path(path);
                });

        };
    };

    RegisterController.$inject = injectParams;

    app.register.controller('RegisterController', RegisterController);

});