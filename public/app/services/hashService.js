/// <reference path="../../basicscript/basicscript.js" />
/// <reference path="../libs/JSONConvertor.js" />
'use strict';

define(['app'], function (app) {
    var injectParams = ['$http', '$q','$location'];
    var hashFactory = function ($http, $q, $location) {
        var factory = {};
        factory.getQueryParam = function (key)
        {
            var hash = window.cacheInstance.nextHash ? window.cacheInstance.nextHash : window.location.hash;


            var queryParamsIndex =hash.indexOf('?');
            var queryParams = queryParamsIndex === -1 ? '' : hash.substr(queryParamsIndex + 1);
            if (String.isNullOrEmpty(key) || String.isNullOrEmpty(queryParams))
            {
                return queryParams;
            }
            else
            {
                var tmp = queryParams.split('&');
                for (var keyName in tmp)
                {
                    var tmpKeyValuePair = tmp[keyName];
                    if (!String.isNullOrEmpty(tmpKeyValuePair))
                    {
                        var keyValuePair = tmpKeyValuePair.split('=');
                        if (keyValuePair.length > 1 && String.compare(keyValuePair[0],key,true))
                        {
                            return keyValuePair[1];
                        }

                    }

                }

                return '';
            }
        }

        factory.setQueryParam = function (key, val) {
            //var hash = window.cacheInstance.nextHash ? window.cacheInstance.nextHash : window.location.hash;

            //hash=hash.replace('#', '')
            //var queryParamsIndex = hash.indexOf('?');
            //var newHash = queryParamsIndex === -1 ? (hash + '?' + key.toString() + '=' + val.toString()) : (hash + '&' + key.toString() + '=' + val.toString());
            //$location.path(newHash);

            $location.search(key, val);
        };

        return factory;
    }

    hashFactory.$inject = injectParams;

    app.factory('hashService', hashFactory);
});