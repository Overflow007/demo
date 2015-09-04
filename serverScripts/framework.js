/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
// The base Class implementation (does nothing)
var Class= function(){};
(function(){
    var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
    // Create a new Class that inherits from this class
    Class.extend = function(prop) {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" &&
            typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                (function(name, fn){
                    return function() {
                        var seft =this;
                        var tmp = seft._super;

                        // Add a new ._super() method that is the same method
                        // but on the super-class
                        seft._super = _super[name];

                        var ret = null,prevent=false,args=arguments;

                        if (seft.inspectorsBeforeCall && (typeof(seft.inspectorsBeforeCall[name]) == "function")) {
                            var inspectorArg ={
                                args:arguments,
                                prevent:false
                            }
                            ret =  seft.inspectorsBeforeCall[name].apply(seft, [inspectorArg]);
                            prevent=inspectorArg.prevent;
                            if(inspectorArg.args){
                                args=inspectorArg.args;
                            }
                        }

                        if(!prevent) {
                            // The method only need to be bound temporarily, so we
                            // remove it when we're done executing
                            ret = fn.apply(seft, args);
                            if(seft.inspectorsAfterCall&& (typeof (seft.inspectorsAfterCall[name])=="function")){

                                if(ret&&(typeof(ret.then)=="function")){
                                    ret = ret.then(function(data){
                                        var insAfter ={args:args,data:data,prevent:false};
                                        var afterRet = seft.inspectorsAfterCall[name].apply(seft,[null,insAfter]);
                                        if(insAfter.prevent) {
                                            return afterRet;
                                        }
                                        return data;
                                    },function(err){
                                      return err;
                                    });
                                }
                                else{
                                    var insAfter ={args:args,data:data,prevent:false}
                                    var afterRet = seft.inspectorsAfterCall[name].apply(seft, [null,insAfter]);
                                    if(insAfter.prevent) {
                                        ret = afterRet;
                                    }
                                }
                            }
                        }
                        seft._super = tmp;

                        return ret;
                    };
                })(name, prop[name]) :
                (function(name,fn){
                    return function(){
                        var seft =this,ret = null,prevent=false,args=arguments;
                        if (seft.inspectorsBeforeCall && (typeof(seft.inspectorsBeforeCall[name]) == "function")) {
                            var inspectorArg ={
                                args:arguments,
                                prevent:false
                            }
                            ret =  seft.inspectorsBeforeCall[name].apply(seft, [inspectorArg]);
                            prevent=inspectorArg.prevent;
                            if(inspectorArg.args){
                                args=inspectorArg.args;
                            }
                        }

                        if(!prevent) {
                            // The method only need to be bound temporarily, so we
                            // remove it when we're done executing
                            ret = fn.apply(seft, args);
                            if(seft.inspectorsAfterCall&& (typeof (seft.inspectorsAfterCall[name])=="function")){

                                if(ret&&(typeof(ret.then)=="function")){
                                    ret = ret.then(function(data){
                                        var insAfter ={args:args,data:data,prevent:false};
                                        var afterRet = seft.inspectorsAfterCall[name].apply(seft,[null,insAfter]);
                                        if(insAfter.prevent) {
                                            return afterRet;
                                        }
                                        return data;
                                    },function(err){
                                        return err;
                                    });
                                }
                                else{
                                    var insAfter ={args:args,data:ret,prevent:false}
                                    var afterRet = seft.inspectorsAfterCall[name].apply(seft, [null,insAfter]);
                                    if(insAfter.prevent) {
                                        ret = afterRet;
                                    }
                                }
                            }
                        }
                        return ret;
                    };

                })(name, prop[name])

                //prop[name];
        }

        // The dummy class constructor
        function Class() {

            /*if(!this.inspectorsBeforeCall)this.inspectorsBeforeCall={};
            if(!this.inspectorsAfterCall)this.inspectorsAfterCall={};*/
            // All construction is actually done in the init method
            if ( !initializing && this.init )
                this.init.apply(this, arguments);
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;

        /*Class.prototype.$expose=function(prop){
            var self = this;
            var ret={};



            return ret;
        }*/

        // And make this class extendable
        Class.extend = arguments.callee;

        return Class;
    };
})();
module.exports.Class=Class;
