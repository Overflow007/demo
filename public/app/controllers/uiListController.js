'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', 'hashService', 'dataService', 'popupService'];

    var UIListController = function ($scope, hashService, dataService, popupService) {
        $scope.entities = [];
        $scope.currentPage = 0;
        $scope.totalCount=0;
        $scope.totalPage=0;
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
        $scope.loadPage = function (p,pageSize) {
            $scope.currentPage=p;
            if(pageSize!=null){
                $scope.pageSize=pageSize;

            }

            var entityName =null;
            if($scope.$parent.scopeType = 'pop'){
                entityName=$scope.$parent.entityName
            }else{
                entityName=  hashService.getQueryParam('entityName');
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
                    $scope.totalPage=i;
                    for(var index =0;index<i;index++){
                        $scope.pages.push(index);
                    }

                }
            });
        }

        $scope.loadPage(0);

        if($scope.$parent.scopeType = 'pop'){
            $scope.chosenIds = $scope.$parent.chosenIds;
        }

        if($scope.$parent.scopeType = 'pop'){
            $scope.$parent.btnPrimaryClick = function (event) {
                var target = event.currentTarget;

                if ($scope.$parent.multiselector)
                {
                }
                else {
                    if ($scope.chosenIds != $scope.$parent.chosenIds) {
                        var chosen = null;
                        $.each($scope.entities, function (key, val) {
                            if (val._id == $scope.chosenIds) {
                                chosen = val;
                            }
                        });

                        $scope.$parent.defer.resolve(chosen);
                        //eval(path + '=chosen');
                    }
                }
                var modalmain = $(target).parents("div[name = 'modalmain']");

                modalmain.modal("hide");
                //
            }
        }
    }



    UIListController.$inject = injectParams;

    app.register.controller('UIListController', UIListController);


});