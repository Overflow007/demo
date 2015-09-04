var mongooseService =require('../../repository/mongooseService.js')
    ,async=require('async')
    ,authenticate=require('../../authenticate/authenticate')
    ,queryTools=require('../../tools/queryTools')

module.exports.getCurrentUser=function(req,res){
    res.json(req.user);
}

module.exports.getAllModels=function(req,res){
    res.status(200).send(mongooseService.toJSON(mongooseService.metadata));
    //res.json(req.user);
}

module.exports.getNewEntity=function(req,res){
    res.json(mongooseService.getNewEntity(req.body.entityName))
};

module.exports.saveModel=function(req,res){
    var name=req.body.entityName,schemaStr=req.body.schema,opt=(req.body.opt?JSON.parse(req.body.opt):null),collection=(req.body.collection?JSON.parse(req.body.collection):null)
    mongooseService.trySaveModel(name,schemaStr,opt,collection).then(
        function(newModel) {
            res.json(true);
        },
        function(err){
            res.status(500).render('error', {
                message: err.message,
                error: err
            });
        }
    )

}

module.exports.getEntityById=function(req,res){
    var model = mongooseService.getModel(req.body.entityName);
    var where ={"_id":req.body.entityId};
    async.waterfall([
        function (cb) {
            authenticate.accessright(req.user._id, req.body.entityName, "get", cb)
        },
        function(rules,cb){
            if (rules.length != 0) {
                where = {"$and": [where, rules[0].condition]}
            }
            if(req.body.entityName=='user'){
                model.findOne(where,'-password', cb);
            }
            else {
                model.findOne(where, cb);
            }

        }],function(err,doc) {
        if (err) {
            res.status(500).render('error', {
                message: err.message,
                error: err
            });
        } else {
            res.json(doc);
        }
    });

/*

    mongooseService.findById(req.body.entityName,req.body.entityId).then(
        function(doc){
            res.json(doc);
        }
        ,function(err){
            res.status(500).render('error', {
                message: err.message,
                error: err
            });
        }

    );*/
}

module.exports.getEntities=function(req,res){
    var model = mongooseService.getModel(req.body.entityName);
    var userModel = mongooseService.getModel("user");
    var ruleModel = mongooseService.getModel("rule");
    var where = req.body.where?JSON.parse(req.body.where) : {};
    async.waterfall([
        function (cb) {
            authenticate.accessright(req.user._id, req.body.entityName, "get", cb)
        },
        function(rules,cb){
            if (rules.length != 0) {
                var isEmpty =true;
                for(var name in where){
                    isEmpty=false;
                    where = {"$and": [where, rules[0].condition]}
                    break;
                }
                if(isEmpty){
                    where=rules[0].condition
                }
            }

            model.where(where).count(cb);
        }
        , function (count, cb) {
            var query = null;//
            if (req.body.entityName == 'user') {
                query = model.find(where, '-password');

            }
            else {
                query = model.find(where);
            }
            if (req.body.populate) {
                if (req.body.populate == "$all") {
                    for (var name in model.schema.tree) {
                        var type = model.schema.tree[name];
                        if (type.ref) {
                            query.populate(name)
                        }
                        else if (type instanceof Array && type.length > 0 && type[0].ref) {
                            query.populate(name)

                        }
                    }

                } else {
                    query.populate(req.body.populate)
                }
            }
            if (req.body.pageSize && req.body.pageSize > 0) {
                query.limit(req.body.pageSize)
                if (!req.body.pageNum || req.body.pageNum <= 0) {

                }
                else {
                    query.skip(req.body.pageSize * req.body.pageNum)
                }
            }

            query.exec(function (err, docs) {
                var ret = null;

                if (!err) {
                    ret = {
                        entities: Array.prototype.slice.call(docs, 0)
                        , totalCount: count
                    }
                }
                cb(err, ret);

            });
        }], function (err, ret) {

        if (err) {
            res.status(500).render('error', {
                message: err.message,
                error: err
            });
        }
        else {
            res.json(ret);
        }
    });

}

module.exports.updateEntity=function(req,res){



   var entityName= req.body.entityName,entity =JSON.parse(req.body.entity);
    var model = mongooseService.getModel(req.body.entityName);
    var _id=entity._id;
    delete entity._id;
    delete entity.$$hashKey;

    async.waterfall([
        function (cb) {
            authenticate.accessright(req.user._id, req.body.entityName, "check", cb)
        },
        function(rules,cb){
            if (rules.length != 0) {
                for(var i=0;i<rules.length;i++){
                    if(!queryTools.matchSync(entity,rules[i].condition)){
                        return cb(new Error(item.message));
                    }

                }
            }
            model.findOneAndUpdate({'_id':_id},entity,cb)

        }],function(err) {
        if (err) {
            res.status(500).render('error', {
                message: err.message,
                error: err
            });
        } else {
            res.json(true);
        }
    });
}

module.exports.addEntity=function(req,res){

    var entityName= req.body.entityName,entity =JSON.parse(req.body.entity);
    var model = mongooseService.getModel(req.body.entityName);
    delete entity._id;
    delete entity.$$hashKey;
    var e = new model(entity);

    async.waterfall([
        function (cb) {
            authenticate.accessright(req.user._id, req.body.entityName, "check", cb)
        },
        function(rules,cb){
            if (rules.length != 0) {
                for(var i=0;i<rules.length;i++){
                    if(!queryTools.matchSync(entity,rules[i].condition)){
                        return cb(new Error(item.message));
                    }

                }
            }
            e.save(cb)

        }],function(err,doc) {
        if (err){ res.json(false);}
        else {
            res.json(doc._id);
        }
    });

   /* e.save(function (err,doc) {
        if (err){ res.json(false);}
        else {
            res.json(doc._id);
        }
    });*/
}

module.exports.deleteEntity=function(req,res){

    var entityName= req.body.entityName,entityId =req.body.entityId;
    var model = mongooseService.getModel(req.body.entityName);
    model.remove({'_id':entityId},function(err){
        if (err){ res.json(false);}
        else {
            res.json(true);
        }
    })
}
