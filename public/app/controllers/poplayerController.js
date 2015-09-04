/// <reference path="../../basicscript/jquery/jquery-2.1.3.js" />

'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope','$compile'];

    var PoplayerController = function ($scope, $compile) {
        var pc = this;
        $scope.btnCloseName = "Close";
        $scope.Modaltitle = "0.0";
        $scope.btnPrimaryName = "Ok";
        $scope.InnerBtnPrimaryClick = function (event) {
            //$('#poplayer').modal("hide");
        }
        $scope.btnPrimaryClick = function (event) {
            $scope.InnerBtnPrimaryClick(event);
        }
        
    };

    PoplayerController.$inject = injectParams;


    //Loaded normally since the script is loaded upfront 
    //Dynamically loaded controller use app.register.controller
    app.controller('PoplayerController', PoplayerController);

});