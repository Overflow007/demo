'use strict';

define(['app',], function (app) {

    var sourthParkDialog=function(){
        return {
            restrict: 'E',
            replace: true,
            template: '<div></div>',
            require:"?^ngModel",
            //scope:{},
            link: function (scope, $element, $attrs,ngModel) {
                //top:61.3%;left :22.6%;left :40%;
                ngModel.$render = function() {
                    $element.html(ngModel.$viewValue || '');
                };
            }
        };

    }
    app.register.directive('sourthparkdialog', sourthParkDialog);

    var injectParams = [  '$http', 'popupService'];

    var sourthParkGuide = function ($http,popupService) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/components/sourthParkGuide/sourthParkGuide.html',
            //scope:{},
            link: function (scope, $element, $attrs) {
                //top:61.3%;left :22.6%;left :40%;

                var block=false;
                var moved=0;
                var reset=function(){
                    $($element).find('.sourthParkGuide-lefteye').css({top:'88px',left:'52px'})
                    $($element).find('.sourthParkGuide-righteye').css({top:'88px',left:'92px'})
                }
                var handler = function(e){
                    clearTimeout(moved);
                    moved= setTimeout(reset,1000)
                    if(!block) {
                        block = true;

                        setTimeout(
                            function () {
                                block = false;
                            }
                            , 150)


                        var p1 = $($element).find('.sourthParkGuide-lefteye').position()
                        var p2 = $($element).find('.sourthParkGuide-righteye').position()
                        var offset = $($element).offset();
                        if (e.pageX < offset.left) {
                            $($element).find('.sourthParkGuide-lefteye').css("left", '42px')
                            $($element).find('.sourthParkGuide-righteye').css("left", '82px')
                        }
                        else if (e.pageX > offset.left + 150) {
                            $($element).find('.sourthParkGuide-lefteye').css("left", '62px')
                            $($element).find('.sourthParkGuide-righteye').css("left", '102px')
                        }
                        else {
                            $($element).find('.sourthParkGuide-lefteye').css("left", '52px')
                            $($element).find('.sourthParkGuide-righteye').css("left", '92px')
                        }

                        if (e.pageY < offset.top) {
                            $($element).find('.sourthParkGuide-lefteye').css("top", '78px')
                            $($element).find('.sourthParkGuide-righteye').css("top", '78px')
                        }
                        else if (e.pageY > offset.top + 229) {

                            $($element).find('.sourthParkGuide-lefteye').css("top", '98px')
                            $($element).find('.sourthParkGuide-righteye').css("top", '98px')
                        }
                        else {
                            $($element).find('.sourthParkGuide-lefteye').css("top", '88px')
                            $($element).find('.sourthParkGuide-righteye').css("top", '88px')
                        }

                    }
                }

                $(document).bind("mousemove",handler);
                scope.$on('$destroy', function () {
                    $(document).unbind('mousemove');
                });
            }
        };
    }

    sourthParkGuide.$inject = injectParams;

    app.register.directive('sourthparkguide', sourthParkGuide);
});