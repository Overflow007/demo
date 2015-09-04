var mongooseService =require('../repository/mongooseService.js')

var restMvc =function(req, res, next,resource,params)
{
    params.request=req;
    if(params&&params.entityName){
        params.entity=mongooseService.metadata.find(params.entityName);
    }
    res.render(resource, params);
}

module.exports = restMvc;
