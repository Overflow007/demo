/// <reference path="../../basicscript/basicscript.js" />

'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', 'entityService'];

    var DBAttrPopController = function ($scope,entityService) {
       
        $scope.attr = $scope.$parent.attr;
        $scope.dbtypeOptions = [
            { id: -1, text: "===" },
                        { id: 0, text: "BigInt" },
                        { id: 1, text: "Binary" },
                        { id: 2, text: "Bit" },
                        { id: 3, text: "Char" },
                        { id: 4, text: "DateTime" },
                        { id: 5, text: "Decimal" },

                        { id: 6, text: "Float" },
                        { id: 7, text: "Image" },
                        { id: 8, text: "Int" },
                        { id: 9, text: "Money" },

                        { id: 10, text: "NChar" },
                        { id: 11, text: "NText" },
                        { id: 12, text: "NVarChar" },
                        { id: 13, text: "Real" },

                        { id: 14, text: "UniqueIdentifier" },
                        { id: 15, text: "SmallDateTime" },
                        { id: 16, text: "SmallInt" },
                        { id: 17, text: "SmallMoney" },
                        { id: 18, text: "Text" },

                        { id: 19, text: "Timestamp" },
                        { id: 20, text: "TinyInt" },
                        { id: 21, text: "VarBinary" },
                        { id: 22, text: "VarChar" },
                        { id: 23, text: "Variant" },
                        { id: 25, text: "Xml" },

                        { id: 29, text: "Udt" },
                        { id: 30, text: "Structured" },

                        { id: 31, text: "Date" },

                        { id: 32, text: "Time" },
                        { id: 33, text: "DateTime2" },

                        { id: 34, text: "DateTimeOffset" }
        ];

        $scope.DBEntities = [];

        $scope.ReflashAllEntities = function () {
            entityService.getAllEntityInfos().then(function (data) {
                $scope.DBEntities = data;
            });
        }

        var defer = $scope.$parent.defer;
        $scope.$parent.btnPrimaryClick = function (event)
        {
            var target = event.currentTarget;
            defer.resolve($scope.attr, $scope.RemovedRelationship);

            var modalmain = $(target).parents("div[name = 'modalmain']");

            modalmain.modal("hide");
        }
        $scope.IsNewAttr = function ()
        {
            return String.isNullOrEmpty($scope.attr.AttributeId) || $scope.attr.AttributeId == '00000000-0000-0000-0000-000000000000';
        }

        $scope.RelationshipNewed = function ()
        {
            $scope.attr.ForeignRelationShip != null;
        }

        $scope.HasRelationship = function ()
        {
            return $scope.attr.ForeignRelationShip!=null//&&!String.isNullOrEmpty($scope.attr.ForeignRelationShip.AttributeId) && $scope.attr.AttributeId != '00000000-0000-0000-0000-000000000000';
        }

        if (!$scope.HasRelationship())
        {
            $scope.ReflashAllEntities();
        }
        $scope.SelectedEntity = null;
        $scope.AddRelationship = function ()
        {
            if (!String.isNullOrEmpty($scope.SelectedEntity) && $scope.DBEntities[$scope.SelectedEntity]) {
                $scope.attr.ForeignRelationShip = entityService.getNewManyToOneRelationshipInfo($scope.attr, $scope.DBEntities[$scope.SelectedEntity].PKAttribute);

            }
        }

        $scope.RemovedRelationship = null;
        
        $scope.DeleteRelationship = function () {
            if (!String.isNullOrEmpty($scope.attr.ForeignRelationShip.AttributeId) && $scope.attr.AttributeId != '00000000-0000-0000-0000-000000000000') {
                $scope.RemovedRelationship = $scope.attr;
               
            } $scope.attr.ForeignRelationShip = null;
        }
    };

    DBAttrPopController.$inject = injectParams;

    app.register.controller('DBAttrPopController', DBAttrPopController);
});