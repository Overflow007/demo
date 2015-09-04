var fs =require('fs')
    ,async=require('async');

var innerGetDir=function(path,rootPath,replacePath){
    var subs = fs.readdirSync(path);
    var children=[];
    subs.forEach(function(sub){
        var subPath =path+"\\"+sub;
        var refPath =subPath.replace(rootPath,replacePath);
        var fileObj ={
            Name:sub,
            path:refPath
        };
        if(fs.statSync(subPath).isDirectory()){
            fileObj.type='folder';
            fileObj.children =innerGetDir(subPath,rootPath,replacePath);


        }else{
            fileObj.type='file';
        }
        children.push(fileObj);
    })

    children.sort(function(a,b){
        if(a.type=='folder'&& b.type=='file'){
            return -1;
        }else if(b.type=='folder'&& a.type=='file'){
            return 1;

        }
        else{
            if(a.name== b.name)return 0;

            return (a.name< b.name?-1:1);

        }
    })
    return children;
}

module.exports.getFileTree=function(req,res){
    var currentDir = fs.realpathSync('..\\public\\app')
    var appFolder ={
        Name:'app',
        path:'app',
        type:'folder'

    }
    appFolder.children=innerGetDir(currentDir,currentDir,'app')


    res.json([appFolder,{ Name:'angularRoute.json',
        path:'angularRoute.json',
        type:'file'}])

}

module.exports.saveFile=function(req,res){
  var fileContent= req.body.fileContent
      ,filePath=req.body.filePath;
    var basePath = fs.realpathSync('..\\public');
    var savingpath=basePath+'\\'+filePath;
    fs.writeFile(savingpath, fileContent, function (err) {

        if (err){ res.send(500, 'xxx');return;}
        if(filePath=='angularRoute.json'){

            var currentDir = fs.realpathSync('..\\public')
            currentDir=currentDir+'\\'+filePath;
            delete require.cache[currentDir];
        }
        res.json(true);
    });

}