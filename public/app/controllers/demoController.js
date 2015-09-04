'use strict';

define(['app'], function (app) {
    var injectParams = [ '$scope'];

    var DemoController = function (scope) {

        $('#carousel-example-captions').carousel()
    }

    DemoController.$inject = injectParams;

    app.register.controller('DemoController', DemoController);
});