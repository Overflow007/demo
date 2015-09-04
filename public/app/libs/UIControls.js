/// <reference path="../base/jquery/jquery-2.1.3.js" />

(function ($, undefined) {
    $.fn.entitygrid =
            //config =
            //    {
            //        container: ""//$(container)
            //        , dataArrName: "PageCollection"
            //        , entityinfo: {}
            //        , autogeneratecolumn: false
            //        , allowedit : false
            //        , allowpaging : false
            //        , multiselector: null/true/false
            //    }
            function (config) {
                var container = (config && config.container) ? config.container : (this ? this : "");
                var dataArrName = (config && config.dataArrName && dataArrName !== "") ? config.dataArrName : "PageCollection";
                var entityinfo = config ? config.entityinfo : null;
                var allowedit = config ? config.allowedit : false;
                var allowpaging = config ? config.allowpaging : false;
                var multiselector = config ? config.multiselector : null;
                var _container$ = $(container);
                var _grid = undefined;
                var containerIsTable = false;
                if (_container$.length > 0 && _container$.is('table')) {
                    _grid = _container$;
                    containerIsTable = true;
                }
                else {
                    _grid = $("<table class='table table-responsive table-hover'></table>");

                    if (typeof container === 'string' && container !== "" && container !== '#') {
                        if (typeof container === "string" && container.length > 0) {
                            var id = container;
                            var firstCharOfContainer = container.charAt(0);
                            if (firstCharOfContainer === '#') {
                                id = container.substring(1, container.length);
                            }
                            if (id !== "") {
                                _grid.attr("id", id);
                            }
                        }
                    }
                    if (_container$.length == 0)
                    {
                        _container$ = _grid;
                        containerIsTable = true;
                    }
                }

               if (config.autogeneratecolumn && entityinfo) {
                    var columns = [];
                   //clear tr thead tbody
                    var headertr = $("<tr></tr>");
                    var header = $("<thead></thead>");
                    header.append(headertr);
                    var tbodytr = allowedit ? $("<tr ng-init='showEdit=true'  ng-repeat='item in " + dataArrName + ".Items' ></tr>") : $("<tr ng-repeat='item in " + dataArrName + ".Items' ></tr>");
                    var tbody = $("<tbody></tbody>");
                    tbody.append(tbodytr);
                   
                    if (typeof multiselector !== "undefined") {
                        var opColumn = new Object();
                        opColumn.AttributeInfo = null;
                        opColumn.Path = null;
                        opColumn.IsUIColumn = true;
                        opColumn.IsSimpleField = false;
                        opColumn.IsChoosingControl = true;
                        columns.push(opColumn);

                        var oldgridnginit = _grid.attr('ng-init');
                        oldgridnginit = oldgridnginit ? oldgridnginit : '';
                        if (multiselector)
                        {
                            //_grid.attr('ng-init', oldgridnginit + ";chosenid=[];checkall=false");
                            headertr.append("<th class='ChoosingCell'><input type='checkbox' name='checkall' ng-model='checkall'/></th>");
                            tbodytr.append("<td class='ChoosingCell'><input type='checkbox' name='checkone' ng-model='" + dataArrName + ".chosenid[item.Id]'/></td>");
                        } else {
                           
                            //_grid.attr('ng-init', oldgridnginit + ";chosenid='00000000-0000-0000-0000-000000000000';");
                            _grid.attr('heheda', '{{chosenid}}');
                            headertr.append("<th class='ChoosingCell'></th>");
                            tbodytr.append("<td class='ChoosingCell'><input type='radio' name='chosenid' value='{{item.Id}}' ng-model='" + dataArrName + ".chosenid'/></td>");
                        }
                    }

                    if (allowedit) {
                        headertr.append("<th>Edit</th>");
                       
                       var tbodyoptd = "<td>"
                            + "<editbtn class='btn btn-primary'  ng-model='item'  ng-show='showEdit' ng-click='Edit($event,item);showEdit = !showEdit;'><span>edit</span></editbtn>"
                            + "<div class='btn-group'><updatebtn class='btn btn-primary'  ng-show='!showEdit' ng-click='showEdit=!showEdit'><span>update</span></updatebtn>"
                            + "<cancelbtn class='btn btn-primary' ng-model='item'  ng-show='!showEdit' ng-click='Cancel($event,item);showEdit = !showEdit;'><span>cancel</span></cancelbtn>"
                            + "</div></td>";
                       tbodytr.append(tbodyoptd);
                        var opColumn = new Object();
                        opColumn.AttributeInfo = null;
                        opColumn.Path = null;
                        opColumn.IsUIColumn = true;
                        opColumn.IsSimpleField = false;
                        opColumn.IsChoosingControl = false;
                        columns.push(opColumn);
                    }

                    for (var i = 0; i < entityinfo.Attributes.length; i++) {
                        var attr = entityinfo.Attributes[i];
                        if (attr != entityinfo.PKAttribute) {
                            if (attr.ForeignRelationShip == null) {
                                headertr.append("<th>" + attr.AttributeDisplayName + "</th>");
                                var acolumn = new Object();
                                acolumn.AttributeInfo = attr;
                                acolumn.Path = "item.Properties." + attr.PhysicalName;
                                acolumn.IsUIColumn = false;
                                acolumn.IsSimpleField = true;
                                acolumn.IsChoosingControl = false;
                                columns.push(acolumn);

                                if (allowedit) {
                                    var tag = '<text/>';
                                    switch (attr.DbType) {
                                        case 2: tag = '<checkbox/>'; break;
                                        case 4: tag = '<datetime/>'; break;
                                        case 31: tag = '<date/>'; break;
                                        case 32: tag = '<time/>'; break;
                                        default: tag="<text ng-disabled='showEdit' class='form-control camouflage' ng-model=item.Properties." + attr.PhysicalName + "/>";
                                    }

                                    tbodytr.append("<td><div class='form-inline'>" + tag + "</div></td>");
                                } else {
                                    tbodytr.append("<td>{{item.Properties." + attr.PhysicalName + "}}</td>");
                                }

                            }
                            else {
                                if (attr.ForeignRelationShip.EntityRelationShipType === "ManyToOne") {
                                    headertr.append("<th>" + attr.ForeignRelationShip.RelationShipName + "</th>");
                                    var t = "item.RelatedEntities_ManyToOne." + attr.ForeignRelationShip.RelationShipName;
                                    var rcolumn = new Object();
                                    rcolumn.AttributeInfo = attr;
                                    rcolumn.Path = t;
                                    rcolumn.IsUIColumn = false;
                                    rcolumn.IsSimpleField = false;
                                    columns.push(rcolumn);

                                    if (allowedit) {
                                        
                                        var popuptd = $("<td ng-model='" + t + "' ng-init=\"path='" + t + "'\"></td>");
                                        var popupdiv = $("<div class='form-inline'></div>")
                                        var popupdivgroup =  $("<div class='input-group'></div>")
                                        var popinput = $("<input type='text' readonly='readonly'  ng-disabled='showEdit'  class='form-control camouflage' ng-model='" + t + ".Properties." + attr.ForeignRelationShip.RelatedEntity.PrimaryNameAttribute.PhysicalName + "'/>");
                                        var popspan = $("<span class='input-group-addon btn camouflage' ng-disabled='showEdit' relatedid='{{" + t + ".Id}}'  ng-click='Pop($event,item,path);'><span class='glyphicon glyphicon-search' ></span></span>");

                                        popuptd.append(popupdiv);
                                        popupdiv.append(popupdivgroup);
                                        popupdivgroup.append(popinput);
                                        popupdivgroup.append(popspan);
                                        //popspan.get(0).databingingattribute = attr;
                                        tbodytr.append(popuptd);
                                    }
                                    else {
                                        tbodytr.append("<td relatedid='{{" + t + ".Id}}'>{{" + t + ".Properties." + attr.ForeignRelationShip.RelatedEntity.PrimaryNameAttribute.PhysicalName + "}}</td>");
                                    }
                                }
                            }
                        }
                    }

                    _grid.append($(header));
                    _grid.append($(tbody));
                   
                    _grid.get(0).databingingentity = entityinfo;
                    _grid.get(0).databingingcolumns = columns;

                    if(allowpaging){
                        var griddiv = $('<div></div>');

                        var footer = $("<ul class='pagination' ng-show='" + dataArrName + ".PageLength>1'><li class='previous'><a ng-click='Prepage($event)'>&laquo;</a></li><li ng-repeat='page in " + dataArrName + ".Pages'><a ng-click='ChangePage($event,page)'>{{page+1}}</a></li><li class='next'><a ng-click='Nextpage($event)''>&raquo;</a></li></ul>");
                        griddiv.append(_grid);
                        griddiv.append(footer);
                        _grid = griddiv;
                    }
                    if (!containerIsTable && _container$.length > 0 && _container$ != _grid) {
                        _container$.append(_grid);
                    }

                }

                return _grid;

            };

    $.fn.cascadeinput =
            //config =
            //    {
            //        container: ""//$(container)
            //        , relationship : ""
            //        , id : ""
            //    }
        function (config) {
            var container = (config && config.container) ? config.container : (this ? this : "");
            var cascadeinput = $("<div class='input-group'><input type='text' readonly='readonly'  class='form-control camouflage'/>/><span class='input-group-addon btn camouflage'><span class='glyphicon glyphicon-search' ></span></span></div>")


            return cascadeinput;
        };
   
})(jQuery);
