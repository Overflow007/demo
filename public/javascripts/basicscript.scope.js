/// <reference path="lodash-3.10.0/lodash.min.js" />

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
    
    var VariantScope = function () {
        this.$$watchers = [];
        this.$$asyncQueue = [];
        this.$$postDigestQueue = [];
        this.$$phase = null;
        this.$$intervalCode =null;
    };

    VariantScope.prototype.$watch = function (watchFn, listenerFn, valueEq) {
        var self = this;
        var watcher = {
            watchFn: watchFn,
            listenerFn: listenerFn,
            valueEq: !!valueEq
        };
        self.$$watchers.push(watcher);
        return function () {
            var index = self.$$watchers.indexOf(watcher);
            if (index >= 0) {
                self.$$watchers.splice(index, 1);
            }
        };
    };
    
    VariantScope.prototype.$$postDigest = function (fn) {
        this.$$postDigestQueue.push(fn);
    };

    VariantScope.prototype.$evalAsync = function (expr) {
        var self = this;
        if (!self.$$phase && !self.$$asyncQueue.length) {
            setTimeout(function () {
                if (self.$$asyncQueue.length) {
                    self.$digest();
                }
            }, 0);
        }
        self.$$asyncQueue.push({ scope: self, expression: expr });
    };

    VariantScope.prototype.$beginPhase = function (phase) {
        if (this.$$phase) {
            throw this.$$phase + ' already in progress.';
        }
        this.$$phase = phase;
    };

    VariantScope.prototype.$clearPhase = function () {
        this.$$phase = null;
    };

    VariantScope.prototype.$$areEqual = function (newValue, oldValue, valueEq) {
        if (valueEq) {
            return _.isEqual(newValue, oldValue);
        } else {
            return newValue === oldValue ||
              (typeof newValue === 'number' && typeof oldValue === 'number' &&
               isNaN(newValue) && isNaN(oldValue));
        }
    };

    VariantScope.prototype.$$digestOnce = function () {
        var self = this;
        var dirty;
        _.forEach(this.$$watchers, function (watch) {
            try {
                var newValue = watch.watchFn(self);
                var oldValue = watch.last;
                if (!self.$$areEqual(newValue, oldValue, watch.valueEq)) {
                    watch.listenerFn(newValue, oldValue, self);
                    dirty = true;
                }
                watch.last = (watch.valueEq ? _.cloneDeep(newValue) : newValue);
            } catch (e) {
                (console.error || console.log)(e);
            }
        });
        return dirty;
    };

    VariantScope.prototype.$digest = function () {
        var ttl = 10;
        var dirty;
        this.$beginPhase("$digest");
        do {
            while (this.$$asyncQueue.length) {
                try {
                    var asyncTask = this.$$asyncQueue.shift();
                    this.$eval(asyncTask.expression);
                } catch (e) {
                    (console.error || console.log)(e);
                }
            }
            dirty = this.$$digestOnce();
            if (dirty && !(ttl--)) {
                this.$clearPhase();
                throw "10 digest iterations reached";
            }
        } while (dirty);
        this.$clearPhase();

        while (this.$$postDigestQueue.length) {
            try {
                this.$$postDigestQueue.shift()();
            } catch (e) {
                (console.error || console.log)(e);
            }
        }
    };

    VariantScope.prototype.$eval = function (expr, locals) {
        return expr(this, locals);
    };
    
    VariantScope.prototype.$apply = function (expr) {
        try {
            this.$beginPhase("$apply");
            return this.$eval(expr);
        } finally {
            this.$clearPhase();
            this.$digest();
        }
    };
    
    VariantScope.prototype.$beginIntervalWatching = function (ms)
    {
        if (!this.$$intervalCode)
        {
            this.$$intervalCode= setInterval((function (a, b) {
                return function () {
                    b.call(a);
                }
            })(this, this.$digest), ms);
        }
    }

    VariantScope.prototype.$stopIntervalWatching = function (ms) {
        if (this.$$intervalCode) {
            clearInterval(this.$$intervalCode);
        }
    }

    var GlobalRootScope = new VariantScope();

    if (typeof noGlobal === strundefined) {
        window.GlobalRootScope = GlobalRootScope;
    }

    if (typeof define === "function" && define.amd) {
        define("GlobalRootScope", [], function () {
            return GlobalRootScope;
        });
    }
    if (typeof define === "function" && define.cmd) {
        define("GlobalRootScope", [], function (require, exports, module) {
            module.exports = GlobalRootScope;
        });
    }
}));

