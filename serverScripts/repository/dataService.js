var mongodb = require('../db');
var assert= require('assert')
    ,framework =require('../framework.js')
/*
var dataService = function(entityName)
{
    this.entityName=entityName;
    assert(this.entityName, "Nullable reference")
}
*/

var dataService=framework.Class.extend({
    init:function(entityName){
        this.entityName=entityName;
        assert(this.entityName, "Nullable reference")
    }
    ,getAll:function(){
        var entityName =this.entityName;
        var p =new Promise(function(resolve, reject) {
            mongodb.open(function(err, db) {
                if (err) {
                    return reject(err);
                }

                db.collection(entityName, function(err, collection) {
                    if (err) {
                        mongodb.close();
                        return reject(err);
                    }
                    var result =Array.prototype.slice.call(collection,0);
                    mongodb.close();
                    resolve(result);
                });
            });
        });
        return p;
    }
    ,get:function(q,callback)
    {
        var entityName =this.entityName;
        var p =new Promise(function(resolve, reject) {

            mongodb.open(function(err, db) {
                if (err) {
                    return reject(err);
                }

                db.collection(entityName, function(err, collection) {
                    if (err) {
                        mongodb.close();
                        return reject(err);
                    }

                    collection.findOne(q,function(err, doc) {
                        mongodb.close();
                        //if (doc) {
                        resolve(doc);
                        /*} else {
                         resolve(null);
                         }*/
                    });
                    /*callback(Array.prototype.slice.call(collection,0));*/
                });

            });
        });

        return p;
    },
    insert : function (data) {
        var entityName = this.entityName;
        var p = new Promise(function (resolve, reject) {
            mongodb.open(function (err, db) {
                if (err) {
                    mongodb.close();
                    return reject(err);
                }

                var collection = db.collection(entityName);

                collection.insert(data,  {w:1}, function (err, doc) {
                    mongodb.close();
                    resolve(doc);
                });

            });
        });
        return p;
    },
    update : function(q,data){
        var entityName = this.entityName;
        var p = new Promise(function (resolve, reject) {
            mongodb.open(function (err, db) {
                if (err) {
                    mongodb.close();
                    return reject(err);
                }

                var collection = db.collection(entityName);

                collection.update(q,data, {w:1}, function (err, doc) {
                    mongodb.close();
                    resolve(doc);
                });

            });
        });
        return p;
    }

});

module.exports =dataService;
/*
dataService.prototype={

};*/
