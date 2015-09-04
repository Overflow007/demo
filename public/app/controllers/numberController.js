define(['app'], function (app) {
    app.controller('NumberController', function ($scope) {
        var nc = this;
        nc.blur = function (event) {
            var element = event.target;
            var precision = element.getAttribute('precision')
            var aValue = parseFloat(element.value);
            if (precision &&!isNaN(aValue) && isFinite(precision)) {
                precision = Math.round(precision);
                if (!isNaN(aValue) && isFinite(element.value)) {
                    element.value = aValue.toFixed(precision);
                }

            }


            if (isNaN(aValue) || !isFinite(element.value)) {
                element.value = 0;
            }

        };
    });
});