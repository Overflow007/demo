'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope'];

    var AddDBEntityPopController = function ($scope) {

        if($scope.$parent.scopeType = 'pop'){
            $scope.$parent.btnPrimaryClick = function (event) {
                var target = event.currentTarget;

                var schema=null;
                try{
                    schema= eval('('+$scope.schema+')');
                    $scope.$parent.defer.resolve({name:$scope.entityName,schemaStr: $scope.schema});
                }catch(ex){
                    $scope.$parent.defer.reject(ex);
                }

                var modalmain = $(target).parents("div[name = 'modalmain']");

                modalmain.modal("hide");
                //
            }
        }
    }

    AddDBEntityPopController.$inject = injectParams;

    app.register.controller('AddDBEntityPopController', AddDBEntityPopController);

});

