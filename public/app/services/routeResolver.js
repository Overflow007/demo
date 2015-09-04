/// <reference path="require.min.js" />
/// <reference path="../../basicscript/jquery/jquery-2.1.3.js" />

'use strict';

define([], function () {
    
    var routeResolverProvider = function () {
       
        this.$get = function () {
            
            return this;
        }
        

        this.routeConfig = function () {
            var viewsDirectory = 'app/views/',
                controllersDirectory = 'app/controllers/',

            setBaseDirectories = function (viewsDir, controllersDir) {
                viewsDirectory = viewsDir;
                controllersDirectory = controllersDir;
            },

            getViewsDirectory = function () {
                return viewsDirectory;
            },

            getControllersDirectory = function () {
                return controllersDirectory;
            };

            return {
                setBaseDirectories: setBaseDirectories,
                getControllersDirectory: getControllersDirectory,
                getViewsDirectory: getViewsDirectory
            };
        }();
        this.route = function (routeConfig) {

            var resolve = function (isServiceRoute, baseName, path, controllerAs, secure, hideNavbar) {

             
                if (!path) path = '';

                var routeDef = {};
                if (!isServiceRoute) {
                    var baseFileName = baseName.charAt(0).toLowerCase() + baseName.substr(1);
                    routeDef.templateUrl = routeConfig.getViewsDirectory() + path + baseFileName + '.html';
                    routeDef.controller = baseName + 'Controller';
                    if (controllerAs) routeDef.controllerAs = controllerAs;
                    if (hideNavbar === true) routeDef.hideNavbar = true;
                    routeDef.secure = (secure) ? secure : false;
                    routeDef.resolve = {
                        load: ['$q', '$rootScope', function ($q, $rootScope) {

                            var dependencies = [routeConfig.getControllersDirectory() + path + baseFileName + 'Controller.js'];
                            return resolveDependencies($q, $rootScope, dependencies);
                        }]

                    };
                }
                else {
                    
                    routeDef.isServiceRoute = true;

                    routeDef.resolverAgain = function (hash)
                    {
                        var postParams = { postParams: hash };
                        var hashStr = hash.replace(/^#/,'');
                        hashStr = hashStr.replace(/^\//,'');
                        hashStr = hashStr.replace(/^\\/,'');
                        var result = {};
                        var reps = $.ajax({
                            dataType: "json"
                             , type: "post"

                             , data: postParams
                            , url: "angularRoute/"+hashStr, async: false
                            , success: function (data, textStatus, jqXHR) {
                                result = data;
                                result.resolve = {
                                    load: ['$q', '$rootScope', function ($q, $rootScope) {
                                        if (result.jsDependencies && result.jsDependencies.length>0) {
                                            return resolveDependencies($q, $rootScope, result.jsDependencies);
                                        }
                                    }]
                                };

                            }
                            , error: function (XMLHttpRequest, textStatus, errorThrown) {

                                var a = textStatus;

                            }

                            
                        });
                        return result;
                    }
                }
                return routeDef;
            },
            resolveStatic=function(config){
                var result = config;

                result.resolve = {
                    load: ['$q', '$rootScope', function ($q, $rootScope) {
                        if (result.jsDependencies && result.jsDependencies.length>0) {
                            return resolveDependencies($q, $rootScope, result.jsDependencies);
                        }
                    }]
                };
                return result;
            }
                ,resolveDependencies = function ($q, $rootScope, dependencies) {
                var defer = $q.defer();
                //require(dependencies, function () {
                //    defer.resolve();
                //    $rootScope.$apply()
                //});

                if (dependencies) {
                    if (dependencies instanceof Array) {
                        resolveDependency(dependencies, defer, $rootScope);
                    } else
                    {
                        require(dependencies, function () {
                            defer.resolve();
                            $rootScope.$apply();
                        });
                    }
                } else
                {
                    defer.resolve();
                    $rootScope.$apply();
                }

                return defer.promise;
            };

            var resolveDependency = function (dependencies, defer, $rootScope) {
                if (dependencies.length > 0) {
                    var firstDependency = dependencies[0];
                    dependencies.removeAt(0);
                    require([firstDependency], function () {
                        resolveDependency(dependencies, defer, $rootScope);
                    });

                } else {
                    defer.resolve();
                    try{
                        $rootScope.$apply();
                    } catch (ex)
                    {

                    }
                    //$setTimeout(function ()
                    //{
                    //    $rootScope.$apply()
                    //});
                }
            };


            return {
                resolve: resolve
                ,resolveStatic:resolveStatic

            }
        }(this.routeConfig);


        
    };

    var servicesApp = angular.module('routeResolverServices', []);

    //Must be a provider since it will be injected into module.config()    
    servicesApp.provider('routeResolver', routeResolverProvider);


});
