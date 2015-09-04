'use strict';

define(['app'], function (app) {

    var injectParams = ['$rootScope', '$scope', '$location', '$cookies', '$http', 'authService', 'dataService'];

    var NavbarController = function ($rootScope, $scope, $location, $cookies, $http, authService, dataService) {
        var vm = this,
            appTitle = 'Customer Management';
        
        vm.isCollapsed = false;
        vm.appTitle = appTitle;
        vm.highlight = function (path) {
            return $location.path().substr(0, path.length) === path;
        };

        //vm.loginOrOut = function () {
        //    setLoginLogoutText();
        //    var isAuthenticated = authService.user.isAuthenticated;
        //    if (isAuthenticated) { //logout 
        //        authService.logout().then(function () {
        //            $location.path('/');
        //            return;
        //        });
        //    }
        //    authService.redirectToLogin();
        //};
        vm.logout = function () {
            authService.logout();
        }

        if ($cookies.Authorization) {

            $http.defaults.headers.common.Authorization = 'Bearer ' +$cookies.Authorization;
            if (!$rootScope.user)
            {
                dataService.getCurrentUser().then(function (res)
                {
                    $rootScope.user = res.data;
                });
            }
        }


        $scope.$rootScope = $rootScope;
        $scope.$location = $location;
        $scope.$on('loginAuthChanged', function (userInfo) {
            //setLoginLogoutText(userInfo);
        });
        
        //$scope.$on('redirectToLogin', function () {
        //    redirectToLogin();
        //});

        //function setLoginLogoutText(userInfo) {
        //    vm.loginLogoutText = userInfo?"heheda":"Login";//userInfo.Properties.UserName
        //}

        //setLoginLogoutText();

    };

    NavbarController.$inject = injectParams;


    //Loaded normally since the script is loaded upfront 
    //Dynamically loaded controller use app.register.controller
    app.controller('NavbarController', NavbarController);

});