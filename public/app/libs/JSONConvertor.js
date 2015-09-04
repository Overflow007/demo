(function( global, factory ) {

    if (typeof module === "object" && typeof module.exports === "object") {
        // For CommonJS and CommonJS-like environments where a proper `window`
        // is present, execute the factory and get jQuery.
        // For environments that do not have a `window` with a `document`
        // (such as Node.js), expose a factory as module.exports.
        // This accentuates the need for the creation of a real `window`.
        // e.g. var jQuery = require("jquery")(window);
        module.exports = global.document ?
			factory(global, true) :
			function (w) {
			    if (!w.document) {
			        throw new Error("jQuery requires a window with a document");
			    }
			    return factory(w);
			};
    } else {
        factory(global);
    }

}(typeof window !== "undefined" ? window : this, function (window, noGlobal,undefined) {
    var strundefined = typeof undefined;
    var JSONConvertor = (
        function () {
            var JSONConvertor = function () { };
            var joinJSONPath = function (arr, separator)
            {
                var sep = separator && separator!=''?separator:".";
                if (!arr && !(arr instanceof Array)) return "";
                var str = "";
                for (var i = 0; i < arr.length; i++)
                {
                    var s = arr[i] != null ? arr[i].toString() : "";
                    if (s.length > 0 && s[0] == '[')
                    {
                        str += s;
                    }
                    else if (i != 0) {
                        str += sep;
                        str += s;
                        
                    }
                    else {
                        str += s;
                    }
                }

                return str;
            }
            var findValinDic = function (dic, val)
            {
                for (var name in dic)
                {
                    if (dic[name] == val)
                    {
                        return name;
                    }
                }

                return null;
            }
            var _innerStringify = function (obj, stringifyContext,path)
            {
                if (obj === undefined || obj === null) {
                    return "null";
                }
                var str = obj instanceof Array?"[": "{";
                var removeSpe = false;
                for(var name in obj)
                {
                    
                    if ((obj instanceof Array) && (!isNaN(parseFloat(name)) && isFinite(name))) {

                    } else if (obj instanceof Array) {
                        continue;
                    } else
                    {
                        str += "\"" + name + "\":";
                    }

                    removeSpe = true;
                    var val = obj[name];

                    if (val === undefined || val === null) {
                    
                        str += "null"
                    
                    }
                    else if (typeof val === "object") {

                        if (val instanceof Date) {
                            str += "\"" + val.toJSON() + "\"";
                        } else if (val instanceof Boolean) {
                            str += val.toString();

                        } else if (val instanceof Number) {
                            if (isFinite(val) || isNaN(val)) {
                                str += "0";
                            } else {
                                str += val.toString();
                            }
                        } else {
                            
                            var existPath = findValinDic(stringifyContext, val);
                            if (existPath) {
                                
                                str += "\"" + existPath + "\"";
                            }
                            else
                            {
                                if (obj instanceof Array && (!isNaN(parseFloat(name)) && isFinite(name))) {
                                    path.push("[" + name + "]");
                                }
                                else {
                                    path.push(name);
                                }

                                var currentPath = joinJSONPath(path);


                                stringifyContext[currentPath] = val;
                                str += _innerStringify(val, stringifyContext, path);
                                path.pop();
                            }

                           
                        }
                    }
                    else {
                        if (typeof val === "string") {
                            str += "\"" + val.toString() + "\"";
                        }
                        else {
                            str += val.toString();
                        }

                    }
                    str += ",";
                }
                if (removeSpe)
                {
                    str=str.substr(0,str.length-1)
                    
                }

                str += obj instanceof Array ? "]" : "}";
                return str;
            }

            var _innerParse = function (obj, parseContext, path) {
                for (var name in obj) {
                    var val = obj[name];
                    if (val !== null && val !== undefined) {
                       
                        if (typeof val === "object") {

                            if (!(val instanceof Date) && !(val instanceof Boolean) && !(val instanceof Number)) {
                                if (obj instanceof Array && (!isNaN(parseFloat(name)) && isFinite(name))) {
                                    path.push("[" + name + "]");
                                }
                                else {
                                    path.push(name);
                                }

                                _innerParse(val, parseContext, path);
                                path.pop();
                            }
                        } else if (typeof val === "string"
                                    && val.length > 1
                                    && val[0].charCodeAt(0) == 6
                            //&& val.indexOf('/') > 0 //avoid money like $5.3
                                    ) {
                            var tmpval = val.substring(1);
                           
                            var reg = /^\$((\[\d+\])|(\.[A-Za-z_]+\w*))*$/;
                            if (reg.test(tmpval)) {
                                var currentPath = joinJSONPath(path);
                                if (obj instanceof Array && (!isNaN(parseFloat(name)) && isFinite(name))) {
                                    currentPath+="[" + name + "]";
                                }
                                else {
                                    currentPath += "."+name;
                                }
                                
                                parseContext.push(currentPath + "=" + tmpval);
                            }
                        }
                    }
                }
            };

            JSONConvertor.fn = JSONConvertor.prototype = {
                init: JSONConvertor,
                parseJSON: function (obj) {
                    var $ = obj;
                    if (window.JSON && window.JSON.parse) {

                        if (typeof obj !== "string") {
                            $ = JSON.stringify($);
                        }
                        var codesarr = [], path = ['$'];

                        //

                        $ = JSON.parse($)
                        //    , function (key, val) {
                        //    //val like $../$..
                        //    if (
                        //        typeof val === "string"
                        //        && val.length > 1
                        //        && val[0].charCodeAt(0) == 6
                        //        //&& val.indexOf('/') > 0 //avoid money like $5.3
                        //        ) {
                        //        var tmpval = val.substring(1);

                        //        var reg = /^\$((\[\d+\])|(\.[A-Za-z_]+\w*))*\/\$((\[\d+\])|(\.[A-Za-z_]+\w*))*$/;
                        //        if (reg.test(tmpval)) {
                        //            codesarr.push(tmpval.replace('/', '='));
                        //        }
                        //    }
                        //    return val;
                        //});


                        _innerParse($, codesarr, path);

                        for (var i = 0; i < codesarr.length; i++) {
                            try {
                                eval(codesarr[i]);
                            }
                            catch (ex) {
                                console.log(codesarr[i])

                            }
                        }
                    }//return ( new Function( "return " + data ) )(); Not support for damned IE!
                    return $;
                }

                , stringifyJSON: function (obj) {
                    if (obj === undefined || obj === null) {
                    
                        return "null";
                    
                    }
                    
                    var stringifyContext = [], path = [];
                    stringifyContext["\u0006$"] = obj; path.push("\u0006$");
                    return _innerStringify(obj, stringifyContext, path)
                }
            };

            return new JSONConvertor.fn.init();
        })();

    if (typeof noGlobal === strundefined) {
        window.JSONConvertor = JSONConvertor;
    }

    if (typeof define === "function" && define.amd) {
        define("JSONConvertor", [], function () {
            return JSONConvertor;
        });
    }
    if (typeof define === "function" && define.cmd) {
        define("JSONConvertor", [], function (require, exports, module) {
            module.exports= JSONConvertor;
        });
    }

})
);
