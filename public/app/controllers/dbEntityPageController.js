/// <reference path="../../basicscript/basicscript.js" />

'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', 'entityService', 'hashService', 'popupService'];

    var DBEntityPageController = function ($scope, entityService, hashService, popupService) {
        var self = this;
        $scope.dbEntity = null;
        $scope.addingDBAttributes = [];
        $scope.modifyingDBAttributes = [];

        $scope.deletingDBAttributes = [];

        $scope.ReflashModel = function () {
            var entityName = hashService.getQueryParam('name');
            
            if (!String.isNullOrEmpty(entityName)) {
                entityService.getEntityInfo(entityName).then(function (data) {
                    $scope.dbEntity = data;
                    self.isEditing = false;
                });
            }
            else {
                $scope.dbEntity = entityService.getNewEntityInfo();
            }
        };

        $scope.IsAdding = function () {
            return String.isNullOrEmpty($scope.dbEntity.EntityId) || $scope.dbEntity.EntityId == '00000000-0000-0000-0000-000000000000';
        }

        $scope.ReflashModel();

        $scope.FillName = function (str) {

            if (!String.isNullOrEmpty(str)) {
                if (String.isNullOrEmpty($scope.dbEntity.PrimaryName)) {
                    $scope.dbEntity.PrimaryName = str;
                }

                if (String.isNullOrEmpty($scope.dbEntity.PKAttribute.PhysicalName)) {
                    var pkName = str + 'AutoID';
                    $scope.dbEntity.PKAttribute.AttributeDisplayName = $scope.dbEntity.PKAttribute.PhysicalName = pkName;
                }

                if (String.isNullOrEmpty($scope.dbEntity.BasicTable)) {
                    $scope.dbEntity.BasicTable = str;
                }
                
                if (String.isNullOrEmpty($scope.dbEntity.EntityView)) {
                    $scope.dbEntity.EntityView = str;
                }

                if (String.isNullOrEmpty($scope.dbEntity.DisplayName)) {
                    $scope.dbEntity.DisplayName = str;
                }
            }
        }

        $scope.AddAttr = function (event) {
            popupService.pop({
                popUrl: 'app/views/dbAttrPop.html', popType: 2, popDependences: ['app/controllers/dbAttrPopController.js'], controller: function (scope) {
                    scope.attr = entityService.getNewAttributeInfo($scope.dbEntity);
                }
            }).then(function (attr) {
                $scope.addingDBAttributes.push(attr);
                $scope.dbEntity.Attributes.push(attr);
            }, null);
           
        }

        $scope.EditAttr = function ($event, item)
        {
            popupService.pop({
                popUrl: 'app/views/dbAttrPop.html', popType: 2, popDependences: ['app/controllers/dbAttrPopController.js'], controller: function (scope) {
                    scope.attr = item;
                }
            }).then(function (attr) {
                if(!String.isNullOrEmpty(attr.AttributeId) || attr.AttributeId == '00000000-0000-0000-0000-000000000000'){
                    $scope.modifyingDBAttributes[attr.AttributeId] = attr;
                    if (modifyingDBAttributes.indexOf(attr) < 0)
                    {
                        $scope.modifyingDBAttributes.push(modifyingDBAttributes);
                    }
                }
            }, null);
        };

        $scope.DeleteAttr = function ($event, item) {
            popupService.confirm('Confirm to delete.').then(function () {
                $scope.deletingDBAttributes.push(item);
                $scope.dbEntity.Attributes.remove(item);
            });
        }

        $scope.Save = function ()
        {
            if ($scope.IsAdding()) {
                entityService.addEntityInfo($scope.dbEntity);
            } else
            {

            }
        }
    }

    DBEntityPageController.$inject = injectParams;

    app.register.controller('DBEntityPageController', DBEntityPageController);
});