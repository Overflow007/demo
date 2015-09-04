/// <reference path="../basicscript/jquery/jquery-2.1.3.js" />
'use strict';

define(['app'], function (app)
{
    var injectParams = ['$scope'];

    var EmptyController = function ($scope) {
        var a = $scope; //$scope.$parent
    };


    EmptyController.$inject = injectParams;

    app.register.controller('EmptyController', EmptyController);
});