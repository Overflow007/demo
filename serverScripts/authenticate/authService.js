var mongooseService =require('../repository/mongooseService.js')
    ,framework =require('../framework.js')
    ,jwt = require('jsonwebtoken')
    ,settings = require('../../settings')
    ,authenticate = require('./authenticate');



module.exports.authenticate=function (req, res) {
    //TODO validate req.body.username and req.body.password
    //if is invalid, return 401
    /*var userModel = mongooseService.getModel('user');
    var pModel =mongooseService.getModel('person');

    userModel.findOne({email:req.body.userName,password:req.body.password},function(err,user){
        if(user){
            user.lastLoginAt=Date.now();
            userModel.update({_id:user._id},{$set:{lastLoginAt:user.lastLoginAt}},function(err,u){

            });
            var profile = {
                _id:user._id
                ,email:user.email
                ,name:user.name
                ,createAt:user.createAt
                ,lastLoginAt:user.lastLoginAt
            };

            // We are sending the profile inside the token
            var token = jwt.sign(profile, settings.jwtSecret, { expiresInMinutes: 60*5 });

            res.json({ token: token,user:profile });

        }else{
            res.send(401, 'Wrong user or password');
        }
    });*/
    authenticate.authenticate(req.body.userName,req.body.password).then(
        function(ret){
            res.json(ret);
        },function(){
            res.send(401, 'Wrong user or password');
        }
    );
}

module.exports.register=function(req,res){
    /*var userModel = mongooseService.getModel('user');
    userModel.count({$or:[{email:req.body.email},{name:req.body.name}]},function(err,count){
        if(count){

            res.send(500, 'userName or email duplicated.');


        }else{

            var userEntity = new userModel({email:req.body.email,password:req.body.password,name:req.body.name});
            userEntity.save();

            var profile = {
                email:userEntity.email
                ,name:userEntity.name
                ,createAt:userEntity.createAt
                ,lastLoginAt:userEntity.lastLoginAt
            };

            // We are sending the profile inside the token
            var token = jwt.sign(profile, settings.jwtSecret, { expiresInMinutes: 60*5 });

            res.json({ token: token,user:profile });
        }
    });*/


    authenticate.register({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name
    }).then(function(ret){
        res.json(ret);
    }
    ,function(err){
            res.send(500, 'userName or email duplicated.');
        })
}

module.exports.guestLogin = function(req,res){
    var guestName=req.body.guestName||'guest';
    if(guestName=='')guestName='guest';
    var profile = {
        _id:'guest'
        ,email:guestName
        ,name:guestName
        ,createAt:Date.now()
        ,lastLoginAt:Date.now()
    };

    // We are sending the profile inside the token
    var token = jwt.sign(profile, settings.jwtSecret, { expiresInMinutes: 60*5 });

    res.json({ token: token,user:profile });
}

module.exports.logout=function(req,res){


}