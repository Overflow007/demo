/// <reference path="../libs/JSONConvertor.js" />
'use strict';

define(['app'], function (app) {
    var injectParams = ['$http', '$q'];

    var dataFactory = function ($http, $q) {
        var serviceBase = 'api/crud/',
            factory = {};

        factory.getCurrentUser = function () {
            return $http.post(serviceBase + 'getCurrentUser',null, { withCredentials: true, responseType: 'json' })
        }

        factory.getNewEntity = function (entityName) {
            var postE = { entityName: entityName};
            return $http.post(serviceBase + 'getNewEntity', postE)
        }

        factory.copyEntity = function (source, target) {
            if (!source) return null;

            var newE = _.cloneDeep(source);
            if(target){
               /* newE = $.extend(target,newE);*/
                for(var name in target){
                    target[name]=newE[name];
                }

                for(var name in newE){
                    target[name]=newE[name];
                }
                newE=target;
            }
            return newE;
        }

        factory.getEntities = function (entityName, where,populate)
        {
            var postE = { entityName: entityName ,where:(where? JSON.stringify( where):null),populate:populate};
            return $http.post(serviceBase + 'getEntities', postE,{withCredentials: true, responseType: 'json'})
        };

        factory.getEntitiesWithPaging = function (entityName, where, pageSize, pageNum,populate) {
            var postE = { entityName: entityName, where: (where? JSON.stringify( where):null), pageSize: pageSize, pageNum: pageNum,populate:populate };
            return $http.post(serviceBase + 'getEntities', postE,{withCredentials: true, responseType: 'json'});
        };

        factory.updateEntity = function (entityName,entity) {
            var postE = {entityName:entityName, entity: JSON.stringify( entity) };
            return $http.post(serviceBase + 'updateEntity', postE ,{withCredentials: true, responseType: 'json'});
        }

        factory.getEntityById = function (entityName, entityId) {
            var postE = { entityName: entityName, entityId: entityId };
            
            return $http.post(serviceBase + 'getEntityById', postE,{withCredentials: true, responseType: 'json'});
        };

        factory.addEntity = function (entityName,entity) {
            var postE = {entityName:entityName, entity:  JSON.stringify( entity) };
            return $http.post(serviceBase + 'addEntity',  postE,{withCredentials: true, responseType: 'json'});
        }

        factory.deleteEntity = function (entityName,entityId) {
            var postE = { entityName: entityName, entityId: entityId };
            return $http.post(serviceBase + 'deleteEntity',  postE,{withCredentials: true, responseType: 'json'} );
        }

        return factory;
    }
    dataFactory.$inject = injectParams;

    app.factory('dataService', dataFactory);

});