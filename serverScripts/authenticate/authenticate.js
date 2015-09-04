var mongooseService =require('../repository/mongooseService.js')
    ,framework =require('../framework.js')
    ,queryTools=require('../tools/queryTools.js')
    ,async=require('async')
    ,jwt = require('jsonwebtoken')
    ,settings = require('../../settings');

var auth=framework.Class.extend({
    init:function(){

    }
    ,accessright:function(userId,entityName,functionName,cb) {
        var userModel = mongooseService.getModel("user")
            , ruleModel = mongooseService.getModel("rule")
            ,model = mongooseService.getModel(entityName);

        async.waterfall([function (cb) {
            if (model) {
                if (userId == 'guest') {
                    userId = '55c883a28c98eb300986f07f';
                }
                userModel.findById(userId, "_id roles", cb);
            }
            else {
                throw  "no model";
            }
        }, function (user, cb) {
            if (user) {
                var roles = user.roles;
                var rulesQue = null;//{"roles": {"$in": roles}, "function": functionName, "entity": entityName};
                if(functionName instanceof  Array){
                    rulesQue ={"roles": {"$in": roles}, "function": {"$in":functionName}, "entity": entityName};

                }
                else{
                    rulesQue ={"roles": {"$in": roles}, "function": functionName, "entity": entityName};
                }
                ruleModel.find(rulesQue, cb);
            } else {
                throw "no user";
            }
        }], function (err, rules) {
            if(cb) {
                var rs = Array.prototype.slice.call(rules, 0)
                process.nextTick(function(){
                    cb(err, rs);
                });


            }
        });
    }
    ,authenticate:function(userName,password){
        var userModel = mongooseService.getModel('user');
        var p= new Promise(function (resolve, reject) {
            userModel.findOne({email:userName,password:password},function(err,user){
                if(user){
                    user.lastLoginAt=Date.now();
                    userModel.update({_id:user._id},{$set:{lastLoginAt:user.lastLoginAt}},function(err,u){

                    });
                    var profile = {
                        _id:user._id
                        ,email:user.email
                        ,name:user.name
                        ,iconUrl:user.iconUrl
                        ,createAt:user.createAt
                        ,lastLoginAt:user.lastLoginAt
                    };

                    // We are sending the profile inside the token
                    var token = jwt.sign(profile, settings.jwtSecret, { expiresInMinutes: 60*5 });
                    resolve({ token: token,user:profile })


                }else{
                    //res.send(401, 'Wrong user or password');
                    reject(401);
                }
            });
        });
        return p;
    }
    ,register:function(user){
        var userModel = mongooseService.getModel('user');
        var p = new Promise(function (resolve, reject) {
            userModel.count({$or: [{email: req.body.email}, {name: req.body.name}]}, function (err, count) {
                if (count) {
                    p.reject({errorCode:500,message: 'userName or email duplicated.'})

                } else {

                    var userEntity = new userModel(user);
                    userEntity.save();

                    var profile = {
                        email: userEntity.email
                        , name: userEntity.name
                        , createAt: userEntity.createAt
                        , lastLoginAt: userEntity.lastLoginAt
                    };

                    // We are sending the profile inside the token
                    var token = jwt.sign(profile, settings.jwtSecret, {expiresInMinutes: 60 * 5});

                    resolve({token: token, user: profile})
                }
            });
        });
        return p;
    }
});

module.exports=new auth();