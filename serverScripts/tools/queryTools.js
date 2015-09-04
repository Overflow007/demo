(function( global, factory ) {

    if (typeof module === "object" && typeof module.exports === "object") {

        module.exports = factory(global, (global.document ? false : true))||
        function (w) {
            return factory(w,(global.document ? false : true));
        };
    } else {
        factory(global);
    }

}(typeof window !== "undefined" ? window : this, function (global, nodejs,undefined) {
    var nextTick=nodejs? process.nextTick:(setImmediate?setImmediate:function(m){
            setTimeout((function (a, b) {
                return function () {
                    b.call(a);
                }
            })(arguments.callee, m), 0);
        });
    var tools =(function(_s){
        var tools=function(s){
            this.settings=s;
            },preDate=function(val,m){
                if(val instanceof  Date&&!(m instanceof  Date)){
                    m=new Date(Date.parse(m))

                }
                if(m instanceof  Date&&!(val instanceof  Date)){
                    val=new Date(Date.parse(val))

                }
                return {a:val,b:m};
        }
        ,keywords= {
                "$gt": function (val, m) {//unit
                    var p = preDate(val,m);
                    val= p.a;m= p.b;
                    if(val>m){return true;}return false;
                }
                , "$gte": function (val, m) {//unit
                    var p = preDate(val,m);
                    val= p.a;m= p.b;
                    if(val>=m){return true;}return false;
                }
                , "$lt": function (val, m) {//unit
                    var p = preDate(val,m);
                    val= p.a;m= p.b;
                    if(val<m){return true;}return false;
                }
                , "$lte": function (val, m) {//unit
                    var p = preDate(val,m);
                    val= p.a;m= p.b;
                    if(val<=m){return true;}return false;
                }
                , "$null": function (val, m) {//unit
                    if(val==null){return true;}return false;
                }
                , "$all": function (val, m) {//mix

                    if(!(m instanceof  Array)){
                        m=[m];
                    }
                    if(val instanceof  Array) {
                        var result = true;
                        for (var index = 0; index < m.length; index++) {
                            var mItem = m[index];
                            var subFound = false
                            val.forEach(function (item, num) {
                                subFound = eq(item, mItem);
                            });
                            if (!subFound) {
                                result = false
                                break;
                            }
                        }

                        return result;
                    }
                    else{
                        var subFound =true;
                        for(var index=0;index< m.length;index++){
                            var mItem =m[index];
                            subFound = subFound&& eq(val,mItem);
                            if(!subFound){
                                break;
                            }
                        }

                        return subFound;
                    }

                }
                , "$size": function (val, m) {
                    if(val  instanceof  Array||typeof (val)=='string'){
                        return val.length==m;
                    }
                    return false;
                }
                , "$in": function (val, m) {//mix
                    if(!(m instanceof  Array)){
                        m=[m];
                    }
                    if(val instanceof  Array){
                        var result=false;
                        for(var index=0;index< m.length;index++){
                            var mItem =m[index];
                            var subFound =false
                            val.forEach(function(item,num){
                                subFound=eq(item,mItem);
                            });
                            if(subFound){
                                result=true;
                                break;
                            }
                        }

                        return result;
                    }
                    else{
                        var subFound =false;
                        for(var index=0;index< m.length;index++){
                            var mItem =m[index];
                            subFound = eq(val,mItem);
                            if(subFound){
                                break;
                            }
                        }
                        return subFound;
                    }
                }
                , "$nin": function (val, m) {//mix
                    return !keywords.$in(val, m);
                }
                , "$and": function (val, m) {//parent
                    var result=true;
                    m.forEach(function(item ,num){
                        result=result&&  eq(val,item)
                    })
                    return result;
                }
                , "$nor": function (val, m) {//parent
                    var result = true;

                    for (var index = 0; index < m.length; index++) {
                        var mItem = m[index];
                        if (eq(val, item)) {
                            result = false;
                            break;
                        }
                    }
                    return result;
                }
                , "$not": function (val, m) {//parent
                    return !eq(val,m);
                }
                , "$or": function (val, m) {//parent
                    var result=true;

                    m.forEach(function(item ,num){
                        result=result||  eq(val,item)
                    })
                    return result;
                }
                , "$regex": function (val, m,opt) {//{ name: { $regex: '.4', $options: 'i' } }
                    if(typeof (val)!=='string'||typeof (m)!=='string'){
                        return false;

                    }
                    var reg=null;
                    if(m instanceof RegExp){
                       reg = m;
                    }else{
                        reg =new RegExp(m,opt);
                    }

                   return reg.test(val);

                }
                , "$where": function (val, m) {//function
                }
                , "$exists": function (val, m) {//　如果该字段的值为null，$exists的值为true会返回该条文档，false则不返回。
                    if(m){
                        if(val==null){
                            return false;
                        }
                        else{
                            return true

                        }
                    }else{
                        if(val==null){
                            return true;
                        }
                        else{
                            return false

                        }
                    }
                }
                , "$mod": function (val, m) {//查询集合中 amount 键值为 4 的 0 次模数的所有文档，例如 amount 值等于 16 的文档
                    if(!val)return false;
                    var pf = Number.parseFloat(val)
                    if(isNaN(pf)||(pf%4!=0)){
                        return false;
                    }
                    return true;
                }


                /*, "$slice": function (val, m) {
                }*/
                /*, "$elemMatch": function (val, m) {
                }*/
            },eq=function(val,m){
                if(m instanceof Array){

                }
                else if(m instanceof Date){
                    if(!(val instanceof Date)){

                      return  m.getTime() == Date.parse(val);
                    }else{
                        return m.getTime() == val.getTime();
                    }
                }else if(val instanceof Date){
                    return  val.getTime() == Date.parse(m);
                }else if(typeof(m)=="object"){
                    return tools.fn.matchSync(val,m);
                }
                return val==m;
            };

        tools.fn=tools.prototype={
            init:tools
            ,findValue:function(o,path,callback) {
                nextTick(function(){
                    try {
                        var val = findValueSync(o, path);
                        if (callback) {
                            callback(null, val);
                        }
                    }catch(ex){
                        if(callback){
                            callback(ex);
                        }
                    }
                })
            }
            ,findValueSync:function (o,path) {

                if (o) {
                    switch(typeof(path)){
                        case "number":
                            return o[path];
                            break;
                        case "string":
                            var pArr = path.split('.');
                            var currentVal=o;
                            for(var subPathNum=0;subPathNum<pArr.length;subPathNum++ ){
                                var subPath=pArr[subPathNum];
                                if(!subPath||subPath=='')return undefined;
                                if(subPath.indexOf('[')>=0){
                                    currentVal=currentVal[subPath];
                                    var subofsubPArr = subPath.split('[');
                                    for(var subofsubNum=0;subofsubNum<subofsubPArr.length;subofsubNum++){
                                        var subofsub=pArr[subofsubNum];
                                        subofsub=  subofsub.replace(']','');
                                        currentVal=currentVal[subofsub];

                                        if(currentVal===null||currentVal===undefined)return currentVal;
                                    }
                                }
                                else{
                                    currentVal=currentVal[subPath];
                                    if(currentVal===null||currentVal===undefined)return currentVal;
                                }

                                //if(subPath.)
                            }
                            return currentVal;
                            break;
                        case "function":
                            return path(o);
                            break;
                        default :return undefined;
                    }
                }

                return undefined;
            }
            ,matchSync:function() {
                var dataSource = arguments[0] || {},condition= arguments[1] || {}
                var result =true;
                for(var name in condition){
                    if(name=='$options')continue;
                    var cValue=condition[name];
                    if(keywords[name]){
                        if(name=='$regex'){
                            result=result&& keywords[name](dataSource,cValue,condition['$options']);
                        }
                        else{
                            result=result&& keywords[name](dataSource,cValue);
                        }
                    }
                    else{
                       var sValue = tools.fn.findValueSync(dataSource,name);
                        /*if(cValue instanceof Array){

                        }
                        else if(cValue instanceof Date){
                            cValue
                        }*/
                        result=result&& eq(sValue,cValue);
                    }
                }
                return result;
            }
        };
        return new tools.fn.init(_s);
    }({}));

    if (typeof define === "function") {
        define("tools", [], function () {
            return tools;
        });
    }else if(!nodejs){
        window.tools=tools;
    }
    return tools;
}));
