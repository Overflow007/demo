var framework = require('./serverScripts/framework.js');

var Person = framework.Class.extend({
    init: function (isDancing) {
        this.dancing = isDancing;
    },
    dance: function (s) {
        return this.dancing +' '+ s;
    }
});

var p =new Person("dancing");
p.inspectorsBeforeCall= {
    dance: function (args) {
        console.log('begin dancing');
        args.args[0] = 'down the street';
        console.log('change args');

    }
}
p.inspectorsAfterCall= {
    dance: function (args) {
        console.log('stop dancing')
    }
}
console.log(p.dance('on the floor'));














/*var p =new Promise(function(resolve,reject){
        resolve();
});
p.then(function(){console.log(1);return 2}).then(function(ret ){console.log(ret)})*/
/*
 var s = require('./serverScripts/queryTools.js');

 console.log(s.matchSync({name:1},{name:{$in:[1,2]}}));*/
/*
var s = require('./serverScripts/framework.js');
var Class =s.Class;
var queryConvertor = Class.extend({
        init: function () {


        }
        ,toObj:function(str){
                var context={};
                context.query=str;
                context.currentObj={};
                context.index=0;
                while (context.index < context.query.length) {
                    var token = this.getNextToken(context);
                }

                return this.toObjInner({});
        }

        ,getNextToken:function (context) {
        var self = this;
        while (context.index < context.query.length) {
            var c = context.query[context.index];
            context.index++;
            if (c == ' ' || c == '\r' || c == '\n') {
                continue;
            }
            else if (c == '(') {
                return {token: self.getGroup(context), type: "group"};
            }
            //should be value
            else if (c == '"') {
                return {token: self.getQuot(context), type: "group"};
            }
            else if (c == "'") {
                return {token: self.getSQuot(context), type: "group"};
            }

            else {
                return {token: self.getWord(context), type: "group"};
            }
            return null;
        }

    }

        , toObjInner: function (context) {
        var self = this, key = null, value = null,op=null,nextC='$and';
        while (context.index < context.query.length) {
            var c = context.query[context.index],keyword='';
            context.index++;
            if (c == ' ' || c == '\r' || c == '\n'){continue;}
            else if (c == '(') {
                var subStr = self.getGroup(context);
                /!*if (subObj!=null&&subObj!=undefined) {
                    if (op == '$and' || op == '$or' || op == '$in') {
                        if (!context.currentObj[op]) {
                            context.currentObj[op]=[];
                        }
                        context.currentObj[op].push(subObj)
                    }
                }*!/
            }
            //should be value
            else if (c == '"'){
                keyword=self.getQuot();
            }
            else if (c == "'"){
                keyword=self.getSQuot();
            }else if(c==','){
               //end of the statement/sentence
                key = null, value = null,op=null,nextC='$and';
            }

            //should be key word
            else {
                keyword =  self.getWord();
            }
            if(keyword!='') {
                if (keyword == "or") {
                    key = null, value = null, op = null, nextC = '$or';
                } else if (key) {
                    if (op) {
                        value = keyword
                    } else {
                        op = keyword;
                        switch (op) {
                            case  'like':
                                op = '$like';
                                break;
                            case  'in':
                                op = '$in';
                                break;
                            case  'in':
                                op = '$in';
                                break;
                            case  '>':
                                op = '$gt';
                                break;
                            case  '=>':
                            case  '>=':
                                op = '$gte';
                                break;
                            case  '<':
                                op = '$lt';
                                break;
                            case  '=<':
                            case  '<=':
                                op = '$lte';
                                break;
                            case  'is':
                            case  ':':
                            case  '=':
                                op = '$eq';
                                break;
                        }
                    }
                } else {
                    key = keyword;
                }
            }
        }
        return context.currentObj;
        }
        ,getWord:function(context) {
        var query = "", substart = context.index;
        while (context.index < context.query.length) {
            var c = context.query[context.index];
            context.index++;
            if (c == ' '||c==',') {
                query = context.query.slice(substart, context.index - 1);
                this.nextNonSpace(context);
                break;
            }
        }
        return query;
    }
        ,getQuot:function(context) {
            var query ="",substart=context.index;
            while (context.index < context.query.length) {
                var c = context.query[context.index];
                context.index++;
                if((c=='"'&&context.query[context.index-2]!='\\')||context.index == context.query.length){
                    query=context.query.slice(substart,context.index-1);
                    this.nextNonSpace(context);
                    break;
                }
            }
            return query;
        }
        ,getSQuot:function(context) {
        var query = "", substart = context.index;
        while (context.index < context.query.length) {
            var c = context.query[context.index];
            context.index++;
            if ((c == "'" && context.query[context.index - 2] != '\\')||context.index == context.query.length) {
                query = context.query.slice(substart, context.index - 1);
                this.nextNonSpace(context);
                break;
            }
        }
        return query;
    }
        //((i lie about xxx),(o in ((xxx),(xxx),s)))
        ,getGroup:function(context){//((name in (www,(ssss),(s))))
                var newContext={},subind=-1,substart=context.index;
                newContext.currentObj=null;


                while(context.index<context.query.length){
                    var c = context.query[context.index];
                    context.index++;
                    //if(c==' '||c=='\r'||c=='\n')continue;
                    if(c=='('){
                        subind--;
                    }
                    else if(c==')'){
                        subind++;
                        if(subind==0){
                            newContext.query = context.query.slice(substart,context.index-1);
                            /!*if(newContext.query!=""){
                                //判断是否单元式或者数组
                                //判断条件为第一级子元素是否由key,value组成
                                //enum 单元式
                                newContext.currentObj={}
                                newContext.index=0;
                                this.toObjInner(newContext);
                            }*!/

                            this.nextNonSpace(context);
                        }
                    }
                    else if(context.index == context.query.length){
                        newContext.query = context.query.slice(substart,context.index-1);
                    }
                }

                return newContext.query;
        }
        ,nextNonSpace:function(context){
            while(context.index<context.query.length){
                var c = context.query[context.index];
                context.index++;
                if(c==' '||c=='\r'||c=='\n')continue;
                else{
                    //if(c!=','){context.index--;}
                    context.index--;
                    break;
                }
            }
        }

});
*/
