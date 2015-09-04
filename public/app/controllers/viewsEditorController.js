/// <reference path="../../basicscript/jquery/jquery-2.1.3.js" />
/// <reference path="../../basicscript/basicscript.js" />

'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$http', 'popupService'];

    var ViewsEditorController = function ($scope, $http, popupService) {

        $scope.NewFile = { "fileContent": "请输入.", "Name": "New","active":true };
        
        $scope.CurrentEditingFile = $scope.NewFile;
        $scope.EditingFiles = [$scope.NewFile];
        $scope.CloseFile = function (file) {
            $scope.EditingFiles.remove(file);
            $scope.OpenFile($scope.NewFile);
        };
        


        $scope.OpenFile = function (file)
        {
            if ($scope.CurrentEditingFile == file) return;

            //for (var mFile in $scope.EditingFiles) {
            //    if (mFile != file) {
            //    mFile.active = false;
            //    } 
            //}

            //file.active = true;

            if ($scope.EditingFiles.indexOf(file) < 0)
            {
                $scope.EditingFiles.push(file);
            }

           

            $scope.CurrentEditingFile.fileContent = CKEDITOR.instances.editor01.getData();
            $scope.CurrentEditingFile = file;
            if (!file.fileContent) {
                $http.get(file.path).then(function (html) {
                    file.fileContent = html.data;
                    CKEDITOR.instances.editor01.setData(file.fileContent);
                    //html.data

                });
            }
            else
            {
                CKEDITOR.instances.editor01.setData(file.fileContent);
            }
            //$('#fileTab li').removeClass('active');
            //var indexOffile = $scope.EditingFiles.indexOf(file);
            //$('#fileTab li:eq(' + indexOffile.toString()+')').addClass('active');

        }

        $scope.CollapseExpandFolder = function (event)
        {
            var target = event.currentTarget;
            var spanIcon = $(target);//.children().eq(0);
            var pLi = $(target).parent();
            if (spanIcon.hasClass("glyphicon-folder-open")) {
                spanIcon.removeClass('glyphicon-folder-open').addClass('glyphicon-folder-close');
                var subUl = pLi.parent().children('ul');
                subUl.hide();
            }
            else
            {
                spanIcon.removeClass('glyphicon-folder-close').addClass('glyphicon-folder-open');
                var subUl = pLi.parent().children('ul');
                subUl.show();
            }
        }

        $scope.FileTree = [];//[{ type: "folder", Name: "folder1", children: [{ type: "folder", Name: "folder2", children: [{ type: "file", Name: "file1.js" }] }] }, { type: "file", Name: "file1.js" }];

        $scope.ReflashFileTree = function ()
        {
            $http({ method: 'get', url: 'api/serverTools/getFileTree', responseType: 'json' }).then(function (rep) {
                if (rep) {
                    if (typeof (rep.data) === 'string') {//ie responseType is useless
                        $scope.FileTree =JSON.parse(rep.data);
                    }
                    else
                    {
                        $scope.FileTree = rep.data;
                    }
                }
            });
        }

        $scope.ReflashFileTree();

        $scope.TrySaveFile = function (fileContent)
        {
            var popnewcontroller = function (newscope, $http) {
                newscope.filePath = $scope.CurrentEditingFile.path;
                newscope._fileContent = fileContent;

                newscope.btnPrimaryClick = function (event) {
                    var target = event.currentTarget;

                    var saveFileObj = { fileContent: newscope._fileContent, filePath: newscope.filePath }

                    $http({ method: 'post', url: 'api/serverTools/saveFile', data: saveFileObj, responseType: 'text' })
                        .success(function (data, status, headers, config) {
                            popupService.pop({ body: "<p>Save Successfully!</p>" });
                        }).error(function () {
                            //popupService.pop({ body: "<p>Fail to Save!</p>" });

                        });

                    var modalmain = $(target).parents("div[name = 'modalmain']");

                    modalmain.modal("hide");
                    //
                }
            }

            $http.get('app/views/viewName.html').then(function (html) {

                popupService.pop({ controller: popnewcontroller, body: html.data, popType: 2 });
                
            });


            
        }

        $scope.TryDeleteFile = function (item)
        {
            return;
            var popnewcontroller = function (newscope, $http) {
                newscope.filePath = item.path;
                newscope.btnPrimaryClick = function (event) {
                    var deleteFileObj = { filePath: newscope.filePath }
                    $http({ method: 'post', url: 'api/serverTools/deleteFile', data: deleteFileObj, responseType: 'text' })
                               .success(function (data, status, headers, config) {
                                   popupService.pop({ body: "<p>Delete Successfully!</p>" });
                               }).error(function () {
                                   //popupService.pop({ body: "<p>Fail to Save!</p>" });

                               });
                    var modalmain = $(target).parents("div[name = 'modalmain']");

                    modalmain.modal("hide");
                };
            };

            popupService.pop({ controller: popnewcontroller, body: "<p>Confirm to delete.</p>", popType: 2 });

        }
    };

    ViewsEditorController.$inject = injectParams;

    app.register.controller('ViewsEditorController', ViewsEditorController);

});