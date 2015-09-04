/// <reference path="../basicscript/jquery/jquery-2.1.3.js" />
'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$location', 'hashService'];

    var GeneralSelectEntityController = function ($scope, $location, hashService) {
        $scope.SelectEntity = function (entityName)
        {
            hashService.setQueryParam('entityName', entityName);
        };
    };


    GeneralSelectEntityController.$inject = injectParams;

    app.controller('GeneralSelectEntityController', GeneralSelectEntityController);
});

