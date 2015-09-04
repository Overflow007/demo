/// <reference path="require.min.js" />
/// <reference path="jquery/jquery-2.1.3.js" />

require.config({
    baseUrl: 'app',
    urlArgs: 'v=1.0'
});

require(
    [
        'app',
        'controllers/navbarController',
        'controllers/poplayerController',
        'controllers/datepickerController',
        'controllers/generalSelectEntityController',
        'services/routeResolver',
        'services/authService',
        'services/popupService',
        'services/dataService',
        'services/entityService',
        'services/hashService'
        //'basicscript/jquery/jquery-2.1.3.js'
    ],
    function () {
        angular.bootstrap(document, ['gobelApp']);
        //require([], function () {

        //});
    });

define("jquery", [], function () {
    return window.jQuery;
});
