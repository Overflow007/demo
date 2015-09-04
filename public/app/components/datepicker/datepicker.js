'use strict';

define(['app'], function (app) {

    var datepicker = function () {
        return {
            restrict: 'E',
            controller: 'DatepickerController',
            controllerAs: 'dp',
            replace: true,
            templateUrl: 'app/views/datepicker.html',
            scope: {
                'value': '='
            },
            link: function (scope, $element, $attrs) {

                $($element).datetimepicker({ autoclose: true, todayHighlight: true,todayBtn:true,forceParse:false,container:$($element).parent() });
            }
        };
    }
    app.register.directive('datepicker', datepicker);
});
