/// <reference path="../../basicscript/require.min.js" />
'use strict';

define(['app'], function (app) {

    var injectParams = [ '$compile','$http','$q'];

    var popupFactory = function ($compile, $http, $q) {
        var factory = {
        }
        , alertControllerProvider = function (text)
        {
            return function (scope) {scope.AlertText=text };
        }
        , confirmControllerProvider = function (text) {
            return function (scope){
                scope.ConfirmText = text;
                scope.btnPrimaryClick = function (event)
                {
                    var target = event.currentTarget;
                    scope.defer.resolve(true);
                    var modalmain = $(target).parents("div[name = 'modalmain']");

                    modalmain.modal("hide");
                }
            };
        }
        , innerPop = function (config) {
            var popscope = angular.element('#poplayer').scope();
            var popUrl = config.popUrl, popDependences = config.popDependences, controller = config.controller, body = config.body, popType = config.popType, footer = config.footer, id = config.id, template = config.template;

            var newScope = popscope.$new();
            newScope.btnCloseName = "Close";
            newScope.Modaltitle = "0.0";
            newScope.btnPrimaryName = "Ok";
            newScope.scopeType = 'pop';
            var defer = $q.defer();
            newScope.defer = defer;

            if (controller && $.isFunction(controller)) {
                controller(newScope, $http);
            }

            var modalcontrol = (template && template !== '') ?
                $(template)
                : $("<div class='modal fade' name='modalmain' ><div class='modal-dialog'><div class='modal-content'><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-label='Close'  ng-click='btnCloseClick($event);'><span aria-hidden='true'>&times;</span></button><h4 class='modal-title'>{{Modaltitle}}</h4></div><form novalidate name='popupForm'><div class='modal-body'></div><div class='modal-footer'></div></form></div></div></div>");
            var modalfooter = modalcontrol.find("div[class='modal-footer']");
            var modalbody = modalcontrol.find("div[class='modal-body']");

            if (id && id !== '') {
                //var modalmain = modalcontrol.find("div[name='modalmain']");
                modalcontrol.attr('id', id);
            }



            if (!popType || popType == 1) {
                modalfooter.append("<button type='button' class='btn btn-default' data-dismiss='modal' ng-click='btnCloseClick($event);'>{{btnCloseName}}</button>");
            } else if (popType == 2) {
                modalfooter.append("<button type='button' class='btn btn-default' data-dismiss='modal' ng-click='btnCloseClick($event);' >{{btnCloseName}}</button><button type='button' class='btn btn-primary' type='submit'  ng-disabled='popupForm.$invalid' ng-click='btnPrimaryClick($event);'>{{btnPrimaryName}}</button>");
            } else if (footer) {
                modalfooter.append(footer);
            }

           
            if (!String.isNullOrEmpty(popUrl)) {

                if (popDependences) {
                    if (!(popDependences instanceof Array)) {
                        popDependences = [popDependences];
                    }
                }
                else {
                    popDependences = [];
                }

                require(popDependences, function () {
                    $http.get(popUrl).then(function (html) {
                        modalbody.append(html.data);
                        var compiledmodalcontrol = $compile(modalcontrol)(newScope);
                        
                        if (!newScope.btnCloseClick) {
                            newScope.btnCloseClick = function ($event) {
                                defer.reject($event);

                                $(compiledmodalcontrol).modal("hide");
                                //compiledmodalcontrol.remove();
                            }
                        }

                        $('#poplayer').append(compiledmodalcontrol);
                        $(compiledmodalcontrol).on("hidden.bs.modal", function (e) {
                            //debugger;
                            angular.element(e.target).remove();
                        });
                        $(compiledmodalcontrol).modal();
                        //defer.notify(compiledmodalcontrol);
                    });
                });
            }
            else {
                if (body) {
                    modalbody.append(body);
                }
                var compiledmodalcontrol = $compile(modalcontrol)(newScope);

                if (!newScope.btnCloseClick) {
                    newScope.btnCloseClick = function ($event) {
                        defer.reject($event);
                        $(compiledmodalcontrol).modal("hide");
                        //compiledmodalcontrol.remove();
                    }
                }

                $('#poplayer').append(compiledmodalcontrol);
                $(compiledmodalcontrol).on("hidden.bs.modal", function (e) {
                    //debugger;
                    angular.element(e.target).remove();
                });
                $(compiledmodalcontrol).modal();
                //defer.notify(compiledmodalcontrol);

            }
            return defer.promise;
        };
        factory.pop = innerPop;
        factory.alert = function (text, path,popDependences) {
            var _path = path;
            if (_path)
            {
                return innerPop({ popUrl: path, popDependences: popDependences, controller: alertControllerProvider(text) });
            }
            else {
                return innerPop({ body: '<p>{{AlertText}}</p>', controller: alertControllerProvider(text) });
            }
        };
        factory.confirm = function (text, path, popDependences) {
            var _path = path;
            if (_path) {
                return innerPop({ popUrl: path, popDependences: popDependences, controller: confirmControllerProvider(text), popType: 2 });
            }
            else {
                return innerPop({ body: '<p>{{ConfirmText}}</p>', controller: confirmControllerProvider(text), popType: 2 });
            }
        };

        
        return factory;
    };

    popupFactory.$inject = injectParams;

    app.factory('popupService', popupFactory);

});
