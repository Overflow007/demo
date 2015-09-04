'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$rootScope', '$cookies', '$location'];

    var authFactory = function ($http, $rootScope, $cookies, $location) {
        var serviceBase = '',
            factory = {
                loginPath: 'authenticate',
                user: {
                    isAuthenticated: false,
                    roles: null,
                    Identification: ''
                }
            }
            , changeAuth = function (user) {
                $rootScope.$broadcast('loginAuthChanged', user);
            };

        factory.login = function (email, password) {
            var userLogin={ userName: email, password: password }
            return $http({ method: 'post', url: serviceBase + 'authenticate', data: userLogin, responseType: 'json' })
               /* .then(
                function (data) {
                    var ret =JSONConvertor.parseJSON(data);
                    $rootScope.user =null;

                    $http.defaults.headers.common.Authorization = ret.token;
                    $cookies.Authorization = escape(ret.token);// +";"+"domain=.tedguo.com;"
                    changeAuth($rootScope.user);
                },function(data){
                    popupService.alert(data);
                },function(data){
                    popupService.alert(data);
                });*/
            .success(function (data, status, headers, config) {
                //$localStorage.token = headers.Authorization;
              var ret =data;//JSONConvertor.parseJSON(data);
                $rootScope.user =ret.user;

                $http.defaults.headers.common.Authorization = 'Bearer ' +ret.token;
                $cookies.Authorization = escape(ret.token);// +";"+"domain=.tedguo.com;"
                changeAuth($rootScope.user);
            });

            
        };

        factory.register = function (email, password,name)
        {
            var userReg={ email: email, password: password,name:name }
            return $http({ method: 'post', url: serviceBase + 'register', data: userReg, responseType: 'json' })
                .success(function (data, status, headers, config) {
                    //$localStorage.token = headers.Authorization;
                    var ret =data;//JSONConvertor.parseJSON(data);
                    if(typeof(ret)=='string'){
                        ret =JSON.parse(ret);

                    }
                    $rootScope.user =ret.user;

                    $http.defaults.headers.common.Authorization = 'Bearer ' +ret.token;
                    $cookies.Authorization = escape(ret.token);// +";"+"domain=.tedguo.com;"
                    changeAuth($rootScope.user);
                });

        }

        factory.guestLogin=function(guestName){
            var userReg={ guestName: guestName }
            return $http({ method: 'post', url: serviceBase + 'guestLogin', data: userReg, responseType: 'json' })
                .success(function (data, status, headers, config) {
                    //$localStorage.token = headers.Authorization;
                    var ret =data;//JSONConvertor.parseJSON(data);
                    if(typeof(ret)=='string'){
                        ret =JSON.parse(ret);

                    }
                    $rootScope.user =ret.user;

                    $http.defaults.headers.common.Authorization = 'Bearer ' +ret.token;
                    $cookies.Authorization = escape(ret.token);// +";"+"domain=.tedguo.com;"
                    changeAuth($rootScope.user);
                });
        }
        var redirectToLogin = function () {
            var reg = /^\/login\/*/;
            var loginPath = window.cacheInstance.nextHash ? window.cacheInstance.nextHash : $location.path();
            if (reg.test(loginPath)) {
                //$location.path($location.path());
            }
            else {

                $location.path("/login" + $location.path());
            }
            //$rootScope.$broadcast('redirectToLogin', null);
        };

        factory.logout = function () {
            redirectToLogin();
            /*return $http.post(serviceBase + 'logout').then(
                function (results) {
                    $cookies.Authorization = null;
                    $http.defaults.headers.common.Authorization = null;
                    delete $rootScope.user;
                    var loggedIn = JSON.parse(results.data);

                    return loggedIn;
                });*/
        };

       
        factory.redirectToLogin=redirectToLogin;
        factory.changeAuth = changeAuth;

        return factory;
    };

    authFactory.$inject = injectParams;

    app.factory('authService', authFactory);

});
