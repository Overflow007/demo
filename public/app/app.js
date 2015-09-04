/// <reference path="require.min.js" />
/// <reference path="../javascripts/angular/angular-1.4.0-beta.4.min.js" />
/// <reference path="../javascripts/jquery/jquery-2.1.3.js" />
/// <reference path="../javascripts/basicscript.js" />

'use strict';

define(['services/routeResolver'], function () {
    var app = angular.module('gobelApp', ['ngRoute', 'routeResolverServices', 'ngCookies'
        //,'ui.bootstrap'
    ]);
    app.config(['$routeProvider', 'routeResolverProvider', '$controllerProvider',
                '$compileProvider', '$filterProvider', '$provide', '$httpProvider',

        function ($routeProvider, routeResolverProvider, $controllerProvider,
                  $compileProvider, $filterProvider, $provide, $httpProvider) {

            //Change default views and controllers directory using the following:
            //routeResolverProvider.routeConfig.setBaseDirectories('/app/views', '/app/controllers');

            app.register =
            {
                controller: $controllerProvider.register,
                directive: $compileProvider.directive,
                filter: $filterProvider.register,
                factory: $provide.factory,
                service: $provide.service
            };

            ////Define routes - controllers will be loaded dynamically
            var route = routeResolverProvider.route;

            $routeProvider
                //route.resolve() now accepts the convention to use (name of controller & view) as well as the 
                //path where the controller or view lives in the controllers or views folder if it's in a sub folder. 
                //For example, the controllers for customers live in controllers/customers and the views are in views/customers.
                //The controllers for orders live in controllers/orders and the views are in views/orders
                //The second parameter allows for putting related controllers/views into subfolders to better organize large projects
                //Thanks to Ton Yeung for the idea and contribution
                //.when('/customers', route.resolve('Customers', 'customers/', 'vm'))
                //.when('/customerorders/:customerId', route.resolve('CustomerOrders', 'customers/', 'vm'))
                //.when('/customeredit/:customerId', route.resolve('CustomerEdit', 'customers/', 'vm', true))
                //.when('/orders', route.resolve('Orders', 'orders/', 'vm'))
                //.when('/about', route.resolve('About', '', 'vm'))
                //.when('/login/:redirect*?', route.resolve('Login', '', 'vm'))
                //.otherwise({ redirectTo: '/customers' });

            //.when('/list', route.resolve(false,'List'))
            //.when('/list/:p', route.resolve(false,'Grid'))
            .when('/', route.resolveStatic({
                    "functionName": "Dashboard",
                    "templateUrl": "app/views/dashboard.html",
                    "hideNavbar": false,
                    "secure": false,
                    "jsDependencies": [
                        "app/components/sourthParkGuide/sourthParkGuide.js",
                        "app/controllers/dashboardController.js"
                    ],
                    "css": [
                        "app/components/sourthParkGuide/sourthParkGuide.css"
                    ]
                })
            )
            .when("/demo",route.resolveStatic({
                    "functionName": "demo",
                    "templateUrl": "app/views/demo.html",
                    "hideNavbar": false,
                    "secure": false,
                    "jsDependencies": [
                        "app/controllers/demoController.js"
                    ],
                    "css": [
                        "app/themes/css/demo.css"
                    ]
            }))
            .when('/login/:redirect*?', route.resolve(false, 'Login', '', 'vm', false, true))
            .when('/login', route.resolve(false,'Login', '', 'vm',false,true))
            .when('/register/:redirect*?', route.resolve(false,'Register', '', 'vm',false,true))
            .when('/register', route.resolve(false,'Register', '', 'vm',false,true))
            .when('/:s*', route.resolve(true))
            //{ redirectTo: ['$location', function ($location) { console.log($location.absUrl()); }] });

            //$httpProvider.defaults.useXDomain = true;
            //$httpProvider.defaults.withCredentials = true;
            $httpProvider.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
            $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
            $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

            // Override $http service's default transformRequest
            $httpProvider.defaults.transformRequest = [function (data) {
                /**
                 * The workhorse; converts an object to x-www-form-urlencoded serialization.
                 * @param {Object} obj
                 * @return {String}
                 */
                var param = function (obj, headersGetter) {
                    var query = '';
                    var name, value, fullSubName, subName, subValue, innerObj, i;

                    for (name in obj) {
                        value = obj[name];

                        if (value instanceof Array) {
                            for (i = 0; i < value.length; ++i) {
                                subValue = value[i];
                                fullSubName = name + '[' + i + ']';
                                innerObj = {};
                                innerObj[fullSubName] = subValue;
                                query += param(innerObj) + '&';
                            }
                        } else if (value instanceof Object) {
                            for (subName in value) {
                                subValue = value[subName];
                                fullSubName = name + '[' + subName + ']';
                                innerObj = {};
                                innerObj[fullSubName] = subValue;
                                query += param(innerObj) + '&';
                            }
                        } else if (value !== undefined && value !== null) {
                            query += encodeURIComponent(name) + '='
                                    + encodeURIComponent(value) + '&';
                        }
                    }

                    return query.length ? query.substr(0, query.length - 1) : query;
                };

                return angular.isObject(data) && String(data) !== '[object File]'
                        ? param(data)
                        : data;
            }];
            $httpProvider.defaults.transformResponse = [function (value, headersGetter, status) {

                var contextType = headersGetter('Content-Type')
                if(!String.isNullOrEmpty(contextType)&&contextType.indexOf('application/json')>=0&&typeof(value)==="string"){
                    value=JSON.parse(value);
                }

                return value;
            }];

            $httpProvider.interceptors.push(function ($rootScope, $q) {

                return {
                    //'request': function (config) {
                    //    // console.log('request:' + config);
                    //    return config || $q.when(config);
                    //},
                    //'requestError': function (rejection) {
                    //    // console.log('requestError:' + rejection);
                    //    return rejection;
                    //},
                    ////success -> don't intercept
                    //'response': function (response) {
                    //    // console.log('response:' + response);
                    //    return response || $q.when(response);
                    //},
                    //error -> if 401 save the request and broadcast an event
                    'responseError': function (response) {
                        console.log('responseError:' + response);
                        if (response.status === 401) {

                                  /* var req = {
                                        config: response.config,
                                        deferred: deferred
                                    };*/
                            //$rootScope.requests401.push(req);
                            $rootScope.$broadcast('redirectToLogin',null);
                           // return deferred.promise;
                        }
                        //return $q.reject(response);
                        return $q.reject(response);
                    }

                };
            });
        }]);
    app.run(['$rootScope', '$location', 'authService', '$cookies', '$http',
      function ($rootScope, $location, authService, $cookies, $http) {

          //Client-side security. Server-side framework MUST add it's 
          //own security as well since client-based security is easily hacked
          $rootScope.$on("$routeChangeStart", function (event, next, current) {
              
              
              
                  if (next && next.$$route && next.$$route.hideNavbar) {
                      $rootScope.hideNavbar = true;
                      angular.element('#navbar').scope().hideNavbar = true;
                  } else {
                      $rootScope.hideNavbar = false;
                      angular.element('#navbar').scope().hideNavbar = false;
                      
                  }
              


              if (next && next.$$route && next.$$route.isServiceRoute) {
                  var hash = window.cacheInstance.nextHash ? window.cacheInstance.nextHash : window.location.hash;

                  var newRoute = next.$$route.resolverAgain(hash);
                  window.cacheInstance.nextHash = null;
                  if (next.$$route.templateUrl != null) {
                      delete next.$$route.templateUrl;
                  }
                  if (next.$$route.jsDependencies != null)
                  delete next.$$route.jsDependencies;
                  if (next.$$route.css != null)
                  delete next.$$route.css;
                  if (next.$$route.resolve != null)
                  delete next.$$route.resolve;
                  if (next.$$route.secure != null)
                  delete next.$$route.secure;
                  //-----
                  

                  var queryParamsIndex =hash.indexOf('?');
                  var queryParams = queryParamsIndex === -1 ? '' : hash.substr(queryParamsIndex + 1);
                  if (!String.isNullOrEmpty(queryParams)&&!String.isNullOrEmpty(newRoute.templateUrl)) {
                      var newTemplateUrl = newRoute.templateUrl.indexOf('?') === -1 ? (newRoute.templateUrl + "?" + queryParams) : (newRoute.templateUrl + "&" + queryParams);
                      next.$$route.templateUrl = newTemplateUrl;
                  }
                  else {
                      next.$$route.templateUrl = newRoute.templateUrl;
                  }
                  next.$$route.jsDependencies = newRoute.jsDependencies;

                  next.$$route.css = newRoute.css;

                  next.$$route.resolve = newRoute.resolve;

                  next.$$route.secure = newRoute.secure;
              }
              
              if (next && next.$$route && next.$$route.secure) {
                  if (!$cookies.Authorization && !$http.defaults.headers.common.Authorization) {
                      $rootScope.$evalAsync(function () {
                          authService.redirectToLogin();
                      });
                  } else if ($cookies.Authorization) {
                  
                      $http.defaults.headers.common.Authorization = 'Bearer ' +$cookies.Authorization;
                  }
              }
          });

          $rootScope.$on("$locationChangeStart", function (event, newUrl, oldUrl) {

              var index = newUrl.indexOf('#');
              var hash = index === -1 ? '' : newUrl.substr(index + 1);

              window.cacheInstance.nextHash = hash;
          });

          $rootScope.$on('redirectToLogin', function () {

              authService.redirectToLogin();
          });
      }]);


    app.directive('includeRecursion', ['$compile', '$http', function ($compile, $http) {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs) {
                var replace = typeof $attrs.replace !== 'undefined';
                var getter = function () { return $attrs.includeRecursion };
                $scope.$watch(getter, function (newValue, oldValue, scope) {
                    if (!newValue) return;
                    $http.get(newValue).then(function (html) {
                        var content = $compile(html.data)(scope);
                        if (replace) $element.replaceWith(content);
                        else $element.html(content);
                    });
                });
            }
        };
    }]);

    app.directive('head', ['$rootScope', '$compile',
    function ($rootScope, $compile) {
        return {
            restrict: 'E',
            link: function (scope, elem) {
                var html = '<link rel="stylesheet" ng-repeat="(routeCtrl, cssUrl) in routeStyles" ng-href="{{cssUrl}}" />';
                elem.append($compile(html)(scope));
                scope.routeStyles = {};
                $rootScope.$on('$routeChangeStart', function (e, next, current) {



                    if (current && current.$$route && current.$$route.css) {
                        if (!angular.isArray(current.$$route.css)) {
                            current.$$route.css = [current.$$route.css];
                        }
                        angular.forEach(current.$$route.css, function (sheet) {
                            delete scope.routeStyles[sheet];
                        });
                    }
                    if (next && next.$$route && next.$$route.css) {
                        if (!angular.isArray(next.$$route.css)) {
                            next.$$route.css = [next.$$route.css];
                        }
                        angular.forEach(next.$$route.css, function (sheet) {
                            scope.routeStyles[sheet] = sheet;
                        });
                    }
                });
            }
        };
    }
    ]);

    //app.directive('toggle', function ($document) {
    //    return {
    //        restrict: 'A',
    //        link: function (scope, elem, attrs) {
    //            if (String.compare(attrs.toggle, "tooltip", true)) {
    //                $(elem).tooltip('destroy')
    //                $(elem).tooltip();
    //            }
    //            //else if (String.compare(attrs.toggle, "collapse", true))
    //            //{
    //            //    $(elem).collapse();
    //            //}
    //        }
    //    };
    //});
    app.directive('pwCheck', [function () {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var firstPassword = '#' + attrs.pwCheck;
                elem.add(firstPassword).on('keyup', function () {
                    scope.$apply(function () {
                        var v = elem.val()===$(firstPassword).val();
                        ctrl.$setValidity('pwmatch', v);
                    });
                });
            }
        }
    }]);

    app.directive('ngDraggable', function ($document) {

        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                require(["javascripts/jquery-ui-1.11.4/jquery-ui.min.js"], function () {
                    //var offset = $(elem).offset();
                    $(elem).draggable({ grid: [20, 20] });
                    //$(elem).offset(offset);
                });
            }
        };
    });

    app.directive('ngDrag', function ($document) {

        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var stopDefault = function stopDefault( e ) {
                    //阻止默认浏览器动作(W3C)
                    if ( e && e.preventDefault )
                        e.preventDefault();
                    //IE中阻止函数器默认动作的方式
                    else
                        window.event.returnValue = false;
                    return false;
                }
                element.mousedown(function (event) {
                    element.prevEvent = event;
                    stopDefault(event);

                }).mouseup(function (event) {
                    element.prevEvent = null;
                    stopDefault(event);
                }).mousemove(function (event) {
                    if (!element.prevEvent) {
                        return;
                    }
                    stopDefault(event);
                    /*将 element 拖移事件传递到 scope 上*/
                    scope.$eval(attrs['myMousedrag'], {
                        $event: event,
                        $deltaX: event.clientX - element.prevEvent.clientX,
                        $deltaY: event.clientY - element.prevEvent.clientY
                    });

                    /*通知 scope 有异动发生*/
                    scope.$digest();

                    element.prevEvent = event;
                });

                /*在 destroy 时清除事件注册*/
                scope.$on('$destroy', function () {
                    element.off('mousedown mouseup mousemove');
                });
            }
        };
    });


    app.directive('ngCleanconnector', function ($document) {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs) {
                require(["jsplumb", 'services/jsPlumbHelperService'], function (jsPlumb, jsPlumbHelperService) {
                    delete window.cacheInstance.jsPlumbHelperInstance;


                });
            }
        }
    });

    app.directive('ngConnector', function ($document) {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs) {


                if ($attrs.ngConnector=="true") {
                    //var getter = function () { return $attrs.jsPlumbConnector };
                    //$scope.$watch(getter, function (newValue, oldValue, scope) {}
                    require(["jsplumb", 'services/jsPlumbHelperService'], function (jsPlumb, jsPlumbHelperService) {
                        jsPlumb.ready(function () {
                            var instance = null;

                            if (!window.cacheInstance.jsPlumbHelperInstance)
                            {
                                instance = window.cacheInstance.jsPlumbHelperInstance = jsPlumb.getInstance({
                                    // default drag options
                                    DragOptions: { cursor: 'pointer', zIndex: 2000 },
                                    // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
                                    // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
                                    ConnectionOverlays: [
                                        ["Arrow", { location: 1 }],
                                        ["Label", {
                                            location: 0.1,
                                            id: "label",
                                            cssClass: "aLabel"
                                        }]
                                    ],
                                    Container: "entitiesFrame"
                                });
                            } else
                            {
                                instance = window.cacheInstance.jsPlumbHelperInstance;
                            }

                                //jsPlumb.getInstance({
                                //                        // default drag options
                                //                        DragOptions: { cursor: 'pointer', zIndex: 2000 },
                                //                        // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
                                //                        // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
                                //                        ConnectionOverlays: [
                                //                            ["Arrow", { location: 1 }],
                                //                            ["Label", {
                                //                                location: 0.1,
                                //                                id: "label",
                                //                                cssClass: "aLabel"
                                //                            }]
                                //                        ],
                                //                        Container: "entitiesFrame"
                                //                    });
                            var elementId = $($element).attr('Id');
                            var sourceUUID = elementId + "RightMiddle"

                            instance.addEndpoint(elementId, jsPlumbHelperService.sourceEndpoint, {
                                anchor: "LeftMiddle", uuid: sourceUUID
                            });


                            var targetUUID = elementId + "LeftMiddle";
                            instance.addEndpoint(elementId, jsPlumbHelperService.targetEndpoint, { anchor: "RightMiddle", uuid: targetUUID });
                            //$($element).parents('.entityDiv').draggable({ grid: [20, 20] });
                            instance.draggable(instance.getSelector(".entityDiv"), { grid: [20, 20] });
                        });
                    });
                }
            }
        };
    });
    
    app.directive('relationship', function () {
        return {
            restrict: 'E',
            template: "<div></div>",
            replace: true,
            transclude: true,
            
            link: function ($scope, $element, $attrs, ngModel) {
                var hasRef = ($scope.a.ref!=null)

                if (hasRef) {

                    var ac = $scope.a;
                    var model=$scope.m;
                    var ref=ac.ref;

                    var pAnchor = model.name + '_' + $scope.attrName;
                    var exAnchor = ref + '_id';
                    var sourceUUID = pAnchor + "RightMiddle"
                    var targetUUID = exAnchor + "LeftMiddle";
                    require(["jsplumb"], function (jsPlumb) {
                        jsPlumb.ready(function () {
                            window.cacheInstance.jsPlumbHelperInstance.connect({ uuids: [sourceUUID, targetUUID], editable: true }).getOverlay("label").setLabel( '1:*');
                        });
                    });

                }
            }
        };
    });

    app.directive('query',function(){
        return {
            restrict: 'E',
            //controller: 'DatepickerController',
            //controllerAs: 'dp',
            replace: true,
            template: "<input type='text' class='form-control input-medium search-query' placeholder='Search' ng-model='ngQuery'>",
            scope: {
                'ngBindObj': '='
                ,'ngQuery':''
            },
            link: function ($scope, $element, $attrs) {
                //mark
                //    var getter = function () { return $attrs.ngPrimaryname };
                $scope.$watch("ngBindObj", function (newValue, oldValue, scope){
                     //$parse($attrs['ngModel']).assign($scope, newValue);
                    //scope.ngBindObj
                    //scope.ngQuery
                });
                $scope.$watch("ngQuery", function (newValue, oldValue, scope){

                    //scope.ngBindObj
                    //scope.ngQuery
                });
            }
        }
    })

    //<cascade ng-bind-obj="heheda.person" ng-entityname="person" ng-displayname="name"></cascade>
    app.directive('cascade', ['$compile', 'entityService', function ($compile, entityService) {
        return {
            restrict: "E",
            template: "<div class='input-group'type='cascade'></div>",
            replace: true,
            transclude: true,
            scope: { bindingModel: '=ngBindObj', entityName: '@ngEntity', functionName: '@ngFunctionname',ngDisplay: '@ngDisplay'},

            link: function (scope, element, attrs, controller) {
                var disp = "bindingModel."+attrs.ngDisplay; if (String.isNullOrEmpty(attrs.ngDisplay)) { disp = 'bindingModel._id' }

                            scope.cascade = function () {
                                var chosenId = scope.bindingModel ? scope.bindingModel._id : null;
                                entityService.cascade(scope.entityName, chosenId, scope.functionName, false).then(null, null, function (data) {

                                    scope.bindingModel = data;

                                });
                            };
                            element.append(
                                $compile("<input type='text' readonly='readonly' class='form-control camouflage ng-pristine ng-untouched ng-valid' ng-model='" + disp + "'/><span class='input-group-addon' ng-click='bindingModel={}'><span class='glyphicon glyphicon-remove'></span></span><span class='input-group-addon btn camouflage' ng-click='cascade()'><span class='glyphicon glyphicon-search'></span></span>")
                                (scope)
                                );
            }


            //link: function ($scope, $element, $attrs) {
            //    var a = 1;
            //    var getter = function () { return $attrs.ngPrimaryname };
            //    $scope.$watch(getter, function (newValue, oldValue, scope){
            //        $parse($attrs['ngModel']).assign($scope, newValue);
            //    });
            //    //var a = $compile("<div>{{bindingModel.caocao}}</div>")($scope);
            //    //$element.append(a);
            //}
        };


    }]);

    app.directive('datepicker', function () {
        return {
            restrict: 'E',
            controller: 'DatepickerController',
            controllerAs: 'dp',
            replace: true,
            templateUrl: 'app/views/datepicker.html',
            scope: {
                'value': '='
            },
            link: function (scope, $element, $attrs) {

                $($element).datetimepicker({ autoclose: true, todayHighlight: true,todayBtn:true,forceParse:false,container:$($element).parent() });
            }
        };
    });


    app.directive('number', ['$parse',function ($parse) {
        return {
            restrict: 'E',
            //controller: 'NumberController',
            //controllerAs: 'nc',
            require: '?ngModel',
            replace: true,
            template: "<input type='text'  />",//ng-pattern='/(^\d+\.\d+$)|(^\d*$)/'
            //scope: {
            //    'value': '=value'
            //},
            link: function (scope, $element, $attrs, ngModel) {
                //if (ngModel) {
                //$parse($attrs['ngModel'])
                //    var getter = function () { return $element.value }
                var getter = $parse($attrs['ngModel']);
                    scope.$watch($attrs['ngModel'], function (newValue, oldValue, scope) {
                       
                        var precision = $attrs.precision
                            var aValue = parseFloat(newValue);

                            if (precision && !isNaN(aValue) && isFinite(precision)) {
                                precision = Math.round(precision);
                                if (!isNaN(aValue) && isFinite(newValue)) {
                                    getter.assign(scope, aValue.toFixed(precision));
                                }

                            }


                            if (isNaN(aValue) || !isFinite(newValue)) {
                                getter.assign(scope, 0)
                            }
                    }
                     );
                //}
            }
        };
    }]);


    app.directive("editbtn", function () {
        return {
            restrict: "E"
            , template: "<span class='glyphicon glyphicon-pencil'></span><span ng-transclude></span>"
            , replace: true
            , transclude: true
            , require: 'ngModel'
        }
    });
    app.directive("updatebtn", function () {
        return {
            restrict: "E"
            , template: "<span class='glyphicon glyphicon glyphicon-floppy-disk'></span><span ng-transclude></span>"
            , replace: true
            , transclude: true
        }
    });

    app.directive("deletebtn", function () {
        return {
            restrict: "E"
            , template: "<span class='glyphicon glyphicon-remove'></span><span ng-transclude></span>"
            , replace: true
            , transclude: true
        }
    });

    app.directive("cancelbtn", function () {
        return {
            restrict: "E"
            , template: "<span class='glyphicon glyphicon glyphicon-remove-circle'></span><span ng-transclude></span>"
            , replace: true
            , transclude: true
            , require: 'ngModel'
            //,link: function(scope,element,attrs,ngModel){
            //    element.bind("click",function(){
            //        scope.$apply(function () {
            //            ngModel.$modelValue= angular.copy(scope.master );
            //        });

            //    })
            //}
        }
    });
    app.directive("text", function () {
        return {
            restrict: "E"
            , template: "<input type='text'/>"
            , replace: true
            , transclude: true
        }
    });

    app.directive("checkbox", function () {
        return {
            restrict: "E"
            , template: "<input type='checkbox'/>"
            , replace: true
            , transclude: true
        }
    });
    app.directive("datetime", function () {
        return {
            restrict: "E"
            , template: "<input type='datetime'/>"
            , replace: true
            , transclude: true
        }
    });

    // <div class="col-xs-2" datepicker value="birthday">
    


    app.directive("date", function () {
        return {
            restrict: "E"
            , template: "<input type='date'/>"
            , replace: true
            , transclude: true
        }
    });
    app.directive("time", function () {
        return {
            restrict: "E"
            , template: "<input type='time'/>"
            , replace: true
            , transclude: true
        }
    });

    return app;
});