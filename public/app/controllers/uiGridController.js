'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', 'hashService', 'dataService', 'popupService'];

    var UIGridController = function ($scope, hashService, dataService, popupService) {
        $scope.entities = [];
        $scope.currentPage = 0;
        $scope.totalCount=0;
        $scope.pageSize = 40;
        $scope.pages = [0];
        $scope.previous = function () {
            if($scope.currentPage>0){
                $scope.loadPage($scope.currentPage-1);
            }
        }
        $scope.next = function () {
            if($scope.currentPage<length-1){
                $scope.loadPage($scope.currentPage+1);
            }
        }
        $scope.whereStr='{}';
        $scope.where={};
        var entityName= $scope.entityName = hashService.getQueryParam('entityName');
        $scope.loadPage = function (p,pageSize) {
            $scope.currentPage=p;
            if(pageSize!=null){
                $scope.pageSize=pageSize;

            }


            //entityName='user';
            dataService.getEntitiesWithPaging(entityName, $scope.where, $scope.pageSize, $scope.currentPage,'$all').then(function (res) {

                delete $scope.entities;

                $scope.entities = res.data.entities;

                if ($scope.totalCount != res.data.totalCount) {

                    $scope.totalCount = res.data.totalCount;
                    $scope.pages = [];
                    var i = $scope.totalCount/$scope.pageSize;
                    if( $scope.totalCount<=$scope.pageSize){

                        i=1;
                    }
                    else if($scope.totalCount%$scope.pageSize!=0){
                        i+=1;
                    }
                    for(var index =0;index<i;index++){
                        $scope.pages.push(index);
                    }

                }
            });
        }

        $scope.loadPage(0);

        $scope.Search=function()
        {
                try{
                    var newWhere =JSON.parse($scope.whereStr);
                    if(!newWhere){
                        newWhere={};
                    }
                    $scope.where=newWhere;
                    $scope.loadPage(0);

                }catch(ex){}
        }
        $scope.Edit = function (event, item) {
            var target = event.currentTarget;
            var tr = $(target).parents('tr');
            var trScope = angular.element(tr.get(0)).scope();
            var oldData = trScope.oldData;
            if (!oldData)
            {
                //var item = trScope.item;
                oldData = dataService.copyEntity(item);

                trScope.oldData = oldData;
            }

        };

        $scope.Delete = function (event, item) {
            popupService.confirm('Confirm to delete.').then(function () {
                dataService.deleteEntity(entityName, item._id).success(function (data) {
                    if (data) {
                        popupService.alert('Delete successfully.').then(null, function () {
                            $scope.loadPage( $scope.currentPage);
                        },null);

                    } else {
                        popupService.alert('Fail to delete.');
                    }
                }).error(function(){
                    popupService.alert('Fail to delete.');
                });

            });
        }

        $scope.Update = function ($event, item) {
            popupService.confirm('Confirm to update.').then(function () {
                dataService.updateEntity(entityName,item).success(function (data) {
                    if (data) {
                        popupService.alert('Save successfully.');

                        angular.element($event.currentTarget).scope().showEdit = !angular.element($event.currentTarget).scope().showEdit;
                        //showEdit = !showEdit
                    } else {
                        popupService.alert('Fail to save.');
                    }
                }).error(function(){
                    popupService.alert('Fail to save.');
                });
            }, null, null);
        };

        $scope.Cancel = function (event, item) {
            var target = event.currentTarget;
            var tr = $(target).parents('tr');
            var trScope = angular.element(tr.get(0)).scope();
            var oldData = trScope.oldData;
            if (oldData) {
                dataService.copyEntity(oldData, item);

            }
        };
    }

    UIGridController.$inject = injectParams;

    app.register.controller('UIGridController', UIGridController);

});