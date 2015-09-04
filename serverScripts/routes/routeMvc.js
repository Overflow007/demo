//var fs = require('fs');
var routeMvc = function(controllerName, methodName, req, res, next) {
  var controller,  method;
  controller = null;
  if (!(controllerName != null)) controllerName = 'index';

  try{
    controller = require("./controllers/" + controllerName);
  }catch(ex){
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('404');
    return;

  }
  methodName =methodName? methodName.replace(/[^a-z0-9A-Z_-]/i, ''):'';
  method = (controller&&methodName!='')? eval('controller.' + methodName):null;
  if(controller&&method) {
    //req.query
    method(req, res);
  }
  else{
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('404');
  }
}

module.exports = routeMvc;
