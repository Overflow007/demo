/// <reference path="../../basicscript/basicscript.js" />

'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', 'hashService', 'dataService', 'popupService','$location'];

    var UIFormController = function ($scope, hashService, dataService, popupService, $location) {
        var self = this;

        var entityName = hashService.getQueryParam('entityName');
       
        $scope.SaveText = "Save";
        $scope.DeleteText = "Delete";
        
        self.ShowDeleteBtn = false;
        $scope.localEntity=null;
        $scope.ReflashEntity = function () {
            var Id = hashService.getQueryParam('Id');
            Id = String.isNullOrEmpty(Id) ? hashService.getQueryParam('entityId') : Id;
            if (!String.isNullOrEmpty(Id)) {
                dataService.getEntityById(entityName, Id).success(function (data) {
                    $scope.localEntity = data;
                    self.ShowDeleteBtn = true;
                });
            }
            else {
                $scope.localEntity = dataService.getNewEntity(entityName);
            }
        };
        $scope.ReflashEntity();

        $scope.Save = function () {
            popupService.confirm('Confirm to save.').then(function () {
                var Id = hashService.getQueryParam('Id');
                Id = String.isNullOrEmpty(Id) ? hashService.getQueryParam('entityId') : Id;

                if (String.isNullOrEmpty(Id)) {
                    dataService.addEntity(entityName,$scope.localEntity).success(function (results) {
                        if (results) {
                            popupService.alert('Add successfully.').then(null, function () {
                                hashService.setQueryParam('Id', results);
                            }, null);

                        } else {
                            popupService.alert('Fail to add.');
                        }
                    }).error(function(){

                        popupService.alert('Fail to add.');
                    });
                } else
                {
                    dataService.updateEntity(entityName,$scope.localEntity).success(function (results) {
                        if (results) {
                            popupService.alert('Update successfully.').then(null, function () {

                                $scope.ReflashEntity();
                            }, null);

                        } else {
                            popupService.alert('Fail to update.');
                        }
                    }).error(function(){

                        popupService.alert('Fail to update.');
                    });
                }
            });
        }

        $scope.Delete = function () {
            var Id = hashService.getQueryParam('Id');
            popupService.confirm('Confirm to delete.').then(function () {
                dataService.deleteEntity(entityName, Id).success(function (results) {
                    if (results) {
                        popupService.alert('Delete successfully.').then(null, function () {
                            hashService.setQueryParam('Id', null);
                            $location.path('grid');
                        }, null);

                    } else {
                        popupService.alert('Fail to delete.');
                    }
                }).error(function(){

                    popupService.alert('Fail to delete.');
                });

            });



        }
    }

    UIFormController.$inject = injectParams;


    app.register.controller('UIFormController', UIFormController);

});