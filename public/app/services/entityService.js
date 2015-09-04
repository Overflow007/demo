'use strict';

define(['app'], function (app) {
    var injectParams = ['$http', '$q', 'dataService', 'popupService'];

    var entityFactory = function ($http, $q, dataService, popupService) {
        //gridview popupview listview form
        var entityService = {}
            , c = function (scope) {

            },serviceBase = 'api/crud/';
        

        entityService.cascade = function (entityName, chosenIds, functionName, multiselector) {
            var defer = $q.defer();
            var functionName = functionName ? "cascade" : functionName;
            var postParams = { postParams: functionName };

            var controller = function (scope)
            {
                scope.entityName=entityName;
                scope.multiselector=multiselector;
                if (multiselector) {
                    if (chosenIds) {
                        if (chosenIds instanceof Array) {
                            scope.chosenIds = chosenIds;
                        }
                        else {
                            scope.chosenIds = [chosenIds];
                        }
                    } else {
                        scope.chosenIds = [];
                    }
                } else {
                    if (!chosenIds) {
                        scope.chosenIds = '';
                    }
                    else {
                        scope.chosenIds = chosenIds;
                    }
                }

            }

            $http.post('angularRoute/'+functionName,  postParams,{withCredentials: true, responseType: 'json'}).then(function (rep)
            {
                var router =rep.data||{};
                var reqPath = router.templateUrl;

                if (reqPath == null) { reqPath ='list'}
                if(router.jsDependencies==null){router.jsDependencies=["app/controllers/uiListController.js"]}
                if (reqPath.indexOf('?') < 0)
                {
                    reqPath = reqPath+'?'
                }
                reqPath = reqPath + '&entityName=' + entityName + (multiselector == null ? '' : ('&multiselector=' + multiselector.toString()));
                popupService.pop({ popUrl: reqPath, popDependences: router.jsDependencies, popType: 2, controller: controller })
                .then(function (modalcontrolbody) {
                    defer.notify(modalcontrolbody);
                }
                , function ($event) {
                    defer.reject($event);
                }
                , function (data) {
                    defer.resolve(data);
                });
            });
            return defer.promise;
        };


        entityService.getAllModels = function () {
            return $http.post(serviceBase + 'getAllModels',null, { withCredentials: true }).then(
                function (results) {
                    return eval("("+results.data+")");
                });
        }

        entityService.getModel = function (modelName) {
            var postE = { modelName: modelName };

            return $http.post(serviceBase + 'getModel', postE).then(
                function (results) {
                    return JSONConvertor.parseJSON(results.data);
                });
        };

        entityService.saveModel = function (entityName,schema,opt,collection) {
            var postE = { entityName: entityName,schema:schema,opt:(opt?JSON.stringify(opt):null),collection:(collection?JSON.stringify(collection):null) };
            return $http.post(serviceBase + 'saveModel', postE);
        }

        return entityService;
    };

    entityFactory.$inject = injectParams;

    app.factory('entityService', entityFactory);

});