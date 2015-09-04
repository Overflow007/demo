'use strict';

define(['app'], function (app) {
    
        var jsPlumbHelper = {};
        jsPlumbHelper.ContainerId = "entitiesFrame";

     

        // this is the paint style for the connecting lines..
    var connectorPaintStyle =
       
        {
            lineWidth: 4,
            strokeStyle: "#61B7CF",
            joinstyle: "round",
            outlineColor: "white",
            outlineWidth: 2
        },
        // .. and this is the hover style.
            connectorHoverStyle = {
                lineWidth: 4,
                strokeStyle: "#216477",
                outlineWidth: 2,
                outlineColor: "white"
            },
            endpointHoverStyle = {
                fillStyle: "#216477",
                strokeStyle: "#216477"
            },
        // the definition of source endpoints (the small blue ones)
            sourceEndpoint = {
                endpoint: "Dot",
                paintStyle: {
                    strokeStyle: "#7AB02C",
                    fillStyle: "transparent",
                    radius: 4,
                    lineWidth: 3
                },
                isSource: true,
                maxConnections: -1,
                connector: ["Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 4, alwaysRespectStubs: false }],//[ "Bezier", { cssClass: "connectorClass", hoverClass: "connectorHoverClass" } ],//
                connectorStyle: connectorPaintStyle,

                hoverPaintStyle: endpointHoverStyle,
                connectorHoverStyle: connectorHoverStyle,
                dragOptions: {}
                //, overlays: [
                //    ["Label", {
                //        location: [0.5, 1.5],
                //        //label: "Drag",
                //        cssClass: "endpointSourceLabel"
                //    }]
                //]
            },
        // the definition of target endpoints (will appear when the user drags a connection)
            targetEndpoint = {
                endpoint: "Dot",
                paintStyle: { fillStyle: "#7AB02C", radius: 4 },
                hoverPaintStyle: endpointHoverStyle,
                maxConnections: -1,
                dropOptions: { hoverClass: "hover", activeClass: "active" },
                isTarget: true
                //, overlays: [
                //    ["Label",
                //        {
                //            location: [0.5, -0.5],
                //            //label: "Drop",
                //            cssClass: "endpointTargetLabel"
                //        }]
                //]
            };

        jsPlumbHelper.sourceEndpoint = sourceEndpoint;

        jsPlumbHelper.targetEndpoint = targetEndpoint;
        jsPlumbHelper.initConnectiont = function (connection) {
                    connection.getOverlay("label").setLabel(connection.sourceId.substring(15) + "-" + connection.targetId.substring(15));
        }
        
        return jsPlumbHelper;
    



});