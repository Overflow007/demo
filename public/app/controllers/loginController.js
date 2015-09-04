'use strict';

define(['app'], function (app) {

    var injectParams = ['$location', '$routeParams',  '$http','$cookies', 'authService','popupService'];

    var LoginController = function ($location, $routeParams,$http,$cookies,authService,popupService) {
        var vm = this,
            path = '/';

        vm.email = null;
        vm.password = null;
        vm.errorMessage = null;
        vm.guestLogin=function(){
            authService.guestLogin().error(function (data, status, headers, config) {
                //$localStorage.token = null;

                $http.defaults.headers.common.Authorization = $cookies.Authorization;
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

        }
        vm.login = function () {
            authService.login(vm.email, vm.password)
                .error(function (data, status, headers, config) {
                    //$localStorage.token = null;
                    $http.defaults.headers.common.Authorization = $cookies.Authorization;
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

    LoginController.$inject = injectParams;

    app.register.controller('LoginController', LoginController);

});