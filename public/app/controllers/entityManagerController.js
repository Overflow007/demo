/// <reference path="../basicscript/jquery/jquery-2.1.3.js" />
'use strict';

define(['app', 'jsplumb', 'services/jsPlumbHelperService'], function (app, jsplumb, jsPlumbHelperService) {

    var injectParams = ['$scope','$route', 'entityService', 'popupService'];

    var entityManagerController = function ($scope,$route, entityService, popupService) {
        $scope.models = [];

        $scope.addModel=function(){

            popupService.pop({ popUrl: 'app/views/addDBEntityPop.html', popDependences: ['app/controllers/addDBEntityPopController.js'], popType: 2 })
                .then(function(data){
                    entityService.saveModel(data.name,data.schemaStr)
                        .success(function(result){
                            if(result){
                                popupService.alert('added.').then(null, function () {
                                    $route.reload();
                                },null);
                            }
                            else{
                                popupService.alert('Fail to add.');
                            }
                        })
                        .error(function(err){
                            popupService.alert('Fail to add.');
                        });
                },function(err){

                })


        }
        $scope.drawFrame = function () {
            entityService.getAllModels().then(function (data) {
                $scope.models = data;
                //$('#entitiesFrame').empty();
                //$.each($scope.entityInfos, function (eIndex, entityInfo) {
                //    var eDiv = $("<div id='" + entityInfo.PrimaryName + "' class='entityDiv' style='top:" + (eIndex + 1) * 30 + "px;left:" + (eIndex + 1) * 30 + "px' ><p><strong>" + entityInfo.DisplayName + "</strong></p></div>");
                //    $('#entitiesFrame').append(eDiv);

                //    $.each(entityInfo.Attributes, function (aIndex, attr) {
                //        eDiv.append("<div id='" + entityInfo.PrimaryName + "_" + attr.PhysicalName + "' class='attributeDiv' ><p>" + attr.AttributeDisplayName + "</p></div>");
                //    });


                //});
                //jsPlumb.ready(function () {
                //    var instance = jsPlumb.getInstance({
                //        // default drag options
                //        DragOptions: { cursor: 'pointer', zIndex: 2000 },
                //        // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
                //        // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
                //        ConnectionOverlays: [
                //            ["Arrow", { location: 1 }],
                //            ["Label", {
                //                location: 0.1,
                //                id: "label",
                //                cssClass: "aLabel"
                //            }]
                //        ],
                //        Container: "entitiesFrame"
                //    });


                //    $.each($('.attributeDiv'), function (index, ele) {
                //        var elementId = $(ele).attr('Id')
                //            , sourceUUID = elementId + "RightMiddle"
                //            , targetUUID = elementId + "LeftMiddle";
                //        instance.addEndpoint(elementId, jsPlumbHelperService.sourceEndpoint, {//
                //            anchor: "LeftMiddle", uuid: sourceUUID
                //        });
                //        instance.addEndpoint(elementId, jsPlumbHelperService.targetEndpoint, {//
                //            anchor: "RightMiddle", uuid: targetUUID
                //        });
                //    });


                //    instance.draggable(instance.getSelector(".entityDiv"), { grid: [20, 20] });
                //});
                //console.log(data);
            });
        };
        $scope.drawFrame();
    };

    entityManagerController.$inject = injectParams;

    app.register.controller('entityManagerController', entityManagerController);

});