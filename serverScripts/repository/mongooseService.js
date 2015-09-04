var assert= require('assert')
    ,mongoose = require('mongoose')
    ,settings = require('../../settings')
    ,fs = require('fs')
    ,framework = require('../framework.js')

var db = mongoose.createConnection(settings.host,settings.db)
    ,_innerStringify = function (obj){
    if (obj === undefined || obj === null) {
        return "null";
    }

    if(obj===mongoose.Schema.Types.Mixed)
    {
        return "mongoose.Schema.Types.Mixed";
    }else  if(obj===mongoose.Schema.Types.ObjectId)
    {
        return "mongoose.Schema.Types.ObjectId";
    }

    if(typeof(obj)==="function")
    {
        switch (obj){
            case String:return "String";
            case Buffer:return "Buffer";
            case Boolean:return "Boolean";
            case Date:return "Date";
            case Date.now:return "Date.now";
            case Number:return "Number";
            default :return "";
        }
    }

    var str = obj instanceof Array?"[": "{";
    var removeSpe = false;
    for(var name in obj)
    {


        if ((obj instanceof Array) && (!isNaN(parseFloat(name)) && isFinite(name))) {

        } else if (obj instanceof Array) {
            continue;
        } else
        {
            str += "\"" + name + "\":";
        }

        removeSpe = true;
        var val = obj[name];

        if (val === undefined || val === null) {

            str += "null"

        }else if(typeof(val)==="function"||val===mongoose.Schema.Types.Mixed||val===mongoose.Schema.Types.ObjectId)
        {
            var tSR = _innerStringify(val);
            if(tSR&&tSR!='')
            {
                str += tSR;
            }
        }
        else if (typeof val === "object") {

            if (val instanceof Date) {
                str += "\"" + val.toJSON() + "\"";
            } else if (val instanceof Boolean) {
                str += val.toString();

            } else if (val instanceof Number) {
                if (isFinite(val) || isNaN(val)) {
                    str += "0";
                } else {
                    str += val.toString();
                }
            } else {
                    str += _innerStringify(val);
                }
        }
        else {
            if (typeof val === "string") {
                str += "\"" + val.toString() + "\"";
            }
            else {
                str += val.toString();
            }
        }
        str += ",";
    }
    if (removeSpe)
    {
        str=str.substr(0,str.length-1)
    }

    str += obj instanceof Array ? "]" : "}";
    return str;
}
    ,toJSON=function(obj){
        if (obj === undefined || obj === null) {

            return "null";

        }

        return _innerStringify(obj)
    }
    ,findByKey=function(key) {
    var rel = null;
    this.forEach(function (item, num) {
        if (item.name && item.name == key)rel = item;
    });
    return rel;
}

var dbHelper = framework.Class.extend({
    init: function (db) {
        this.db=db;
        this.initModels()
    }
    ,toJSON:function(metadata){
        if(!metadata){
            metadata=this.metadata;
        }
        return toJSON(metadata);
    }
    ,preInitMetadata:function(){
        this.metadata=[];
        this.metadata.find=findByKey;
    }
    ,initModels:function() {
        var subs = fs.readdirSync(settings.schemasDir);
        var selft =this;
        selft.preInitMetadata();

        subs.forEach(function (sub) {
            var subPath = settings.schemasDir + "\\" + sub;
            var schemasStr = fs.readFileSync(subPath);
            var schema = null;
            try {
                schema = schemasStr && schemasStr != '' ? eval("(" + schemasStr + ")") : null;
                if (schema) {
                    selft.metadata.push(schema);
                }
            } catch (ex) {

            }
        });

        selft.metadata.forEach(function (t, num) {
            var schema = new mongoose.Schema(t.schema, t.opt);
            var newModel = selft.db.model(t.name, schema, t.collection);
            //ex.models[name]=newModel;
        });

    }
    ,trySaveModel:function(name,schemaStr,opt,collection) {
        var schema = null;
        try {
            schema = ((schemaStr && schemaStr != '') ? eval("(" + schemaStr + ")") : null);
        } catch (ex) {
            return Promise.reject(ex);
        }
        if (schema) {
            return this.saveModel(name, schema, opt, collection);
        }

        return Promise.reject();
    }
    ,saveModel:function(name,schema,opt,collection) {
        assert(name, "Nullable reference");

        assert(schema, "Nullable reference");
        //var name = name.toLowerCase();
        //if(self.metadata.find(name)) throw "already exists";
        var findOne = null, self = this;
        self.metadata.forEach(function (item, num) {
            if (item.name && item.name == name)findOne = num;

        });

        var s = new mongoose.Schema(schema, opt);

        var newMetadata = {"name": name, "schema": schema};
        if (opt) {
            newMetadata.opt = opt;
        }
        if (collection) {
            newMetadata.collection = collection;
        }
        var newSchemaFilename = settings.schemasDir + '/' + name + '.json';

        var p = new Promise(function (resolve, reject) {
            fs.writeFile(newSchemaFilename, toJSON(newMetadata), function (err) {
                if (err) {
                    return reject(err);
                }
                if (findOne != null) {
                    self.reconnect();

                    self.metadata.forEach(function (item, num) {
                        if (item.name && item.name == name)findOne = num;
                    });
                    return resolve(findOne[findOne]);
                }
                self.metadata.push(newMetadata);
                var newModel = db.model(name, s);
                resolve(newModel);
            });

        })
        return p;
    }
    ,getModel:function(name){
        if(this.metadata.find(name)){
            return this.db.model(name);
        }
        else{
            return null;
        }
    }
    ,getNewEntity:function(entityName) {
        var self = this;
        var p = new Promise(function (resolve, reject) {
            var model = self.getModel(entityName);
            if (model) {
                resolve(new model());
            } else {

                reject();
            }
        });
        return p;
    }
    ,reconnect : function(callback) {
        var self =this;
        self.db.disconnect(function (err) {

        })
        self.db = db = mongoose.createConnection(settings.host, settings.db);
        self.initModels();

    }
    ,findById:function(entityName,id){
        var model = this.getModel(entityName);
        var p=new Promise(function(resolve, reject){
            if(entityName=='user'){
                model.findById(id,'-password', function (err, doc) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(doc);
                    }
                });
            }
            else {
                model.findById(id, function (err, doc) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(doc);
                    }
                });
            }
        });
        return p;
    }
});
module.exports= new dbHelper(db);


