var express = require('express')
    ,routeMvc = require('./routes/routeMvc.js')
    ,restMvc = require('./routes/restMvc.js')
    ,router = express.Router()
    ,authService=require('./authenticate/authService.js')

    ,mongooseService =require('./repository/mongooseService.js')
/* GET home page. */
router.get('/', function(req, res, next) {
   res.render('index', { title: 'CM System' });
   //next();
});

router.post('/authenticate',authService.authenticate );
router.post('/register',authService.register );
router.post('/guestLogin',authService.guestLogin );
router.all('/api/:controller/:method', function(req, res, next) {
   return routeMvc(req.params.controller, req.params.method, req, res, next);
});

router.all('/angularRoute/:functionName', function(req, res, next) {
   var angularRoute = require('../public/angularRoute.json')
    for(var index in angularRoute){
        var item =angularRoute[index];
        if(item.functionName== req.params.functionName)
        {
            res.json(item);
            return;
        }

    }
    res.json({});

});


router.all('/list', function(req, res, next) {
    var p={
        entityName:req.query.entityName
        ,multiselector:req.query.multiselector
    }
    restMvc(req, res, next,'list',p);
});

router.all('/list/:entityName', function(req, res, next) {
    var p={
        entityName:req.params.entityName
        ,multiselector:null
    }
    restMvc(req, res, next,'list',p);

});

router.all('/grid', function(req, res, next) {
    if ((!req.query.entityName) || req.query.entityName == '') {
        var p = {
            method:'grid',
            metadata:mongooseService.metadata
        }
        restMvc(req, res, next, 'listEntity', p);
    }
    else {

        var p = {
            entityName: req.query.entityName
            , multiselector: req.query.multiselector
        }
        restMvc(req, res, next, 'grid', p);
    }
});

router.all('/form', function(req, res, next) {
    if ((!req.query.entityName) || req.query.entityName == '') {
        var p = {
            method:'form',
            metadata:mongooseService.metadata
        }
        restMvc(req, res, next, 'listEntity', p);
    }
    else {

        var p = {
            entityName: req.query.entityName

        }
        restMvc(req, res, next, 'form', p);
    }
});

router.all('/grid/:entityName', function(req, res, next) {
    var p={
        entityName:req.params.entityName
        ,multiselector:null
    }
    restMvc(req, res, next,'grid',p);

});


router.all('/list/:entityName/:multiselector', function(req, res, next) {
    var p={
        entityName:req.params.entityName
        ,multiselector:req.params.multiselector
    }
    restMvc(req, res, next,'list',req.params);

});


module.exports = router;
