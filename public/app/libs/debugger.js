(function (global, factory) {

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

}(typeof window !== "undefined" ? window : this, function (window, noGlobal, undefined) {
    var strundefined = typeof undefined;
    var deb = (
        function () {
            var deb = function () { };
            deb.fn = deb.prototype = {
                init: deb
                ,assert: function (expr, m) {
                    var msg = "";
                    if (!expr) {
                        var typeofm = typeof m;
                        if (typeofm === "string") {
                            msg = m;
                        }
                        else if (typeofm === "function") {
                            msg = m();
                        } else {
                            msg = 'Assertion failed';
                        }
                        throw msg;
                    }
                }
                , debug: function () {
                    debugger;
                }
            }
            return deb.fn.init();
        })();

    if (typeof noGlobal === strundefined) {
        window.deb = deb;
    }

    if (typeof define === "function" && define.amd) {
        define(function () {
            return deb;
        });
    }
    if (typeof define === "function" && define.cmd) {
        define(function (require, exports, module) {
            module.exports = deb;
        });
    }
}
)
);