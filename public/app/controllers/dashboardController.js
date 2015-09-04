'use strict';

define(['app','app/components/sourthParkGuide/sourthParkGuide.js'], function (app) {
    var injectParams = [ '$scope', '$rootScope','$cookies', 'popupService',"authService","$location"];

    var DashboardController = function (scope,$rootScope,$cookies,popupService,authService,$location) {



        scope.dialogs =["Hi stranger.<br>...","My name's Jiayi Guo.","...","What's your name?","<input type='text' class='gusetName form-control'>","I'm calling you guest anyway.","let's show you what we have."]
        /*scope.dialog=scope.dialogs[0]||"Hello there.";
        scope.index=1;*/
        scope.speakNext=function(){
            if(scope.dialog=="let's show you what we have."){
                $location.path("/demo");
            }

            if(scope.index<scope.dialogs.length){
                if(scope.index==5){
                    var guestName = $('.gusetName').val().trim();
                    $('.sourthParkGuide-speakNext').hide();
                    scope.dialog = "logining..";
                    authService.guestLogin(guestName).error(function (data, status, headers, config) {
                        //$localStorage.token = null;

                        $http.defaults.headers.common.Authorization = $cookies.Authorization;


                            scope.dialog = "login error";



                        $('.sourthParkGuide-speakNext').show();
                    }).then(function (data) {

                            if(!String.isNullOrEmpty(guestName)) {
                                scope.dialog = 'Hi ' + guestName+".";
                            }
                            else{
                                scope.dialog = scope.dialogs[scope.index-1] || "..."
                            }

                        $('.sourthParkGuide-speakNext').show();
                    });


                }
                else {
                    scope.dialog = scope.dialogs[scope.index] || "..."
                }
                scope.index++;
            }
            else{
                scope.dialog=scope.dialogs[0]||"Hello there."
                scope.index=1;
            }
        }

        if($rootScope.user){
            scope.dialogs=["Hi "+$rootScope.user.name,"let's show you what we have."]
        }

            scope.speakNext();

    }

    DashboardController.$inject = injectParams;

    app.register.controller('DashboardController', DashboardController);
});