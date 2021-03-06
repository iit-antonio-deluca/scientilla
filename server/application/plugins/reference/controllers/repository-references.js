/*
 * Scientilla v1.0 Beta (http://www.scientilla.net)
 * Copyright 2014-2015 Fondazione Istituto Italiano di Tecnologia (http://www.iit.it)
 * Licensed under MIT (https://github.com/scientilla/scientilla/blob/master/LICENSE)
 */

var _ = require("underscore");
var crypto = require("crypto");
var mongodb = require("mongodb");
var path = require("path");

var model = require("../models/repository-references.js")();

var identificationManager = require(path.resolve(__dirname + "/../../system/controllers/identification.js"));
var referenceManager = require("../../reference/models/default.js")();

module.exports = function () {
    return {        
        getRepositoryReferences: function(req, res) {
            req.repositoriesCollection.findOne({_id: identificationManager.getDatabaseSpecificId(req.params.id)}, function(err, repository) {
                if (err || _.isNull(repository)) {
                    res.status(404).end();
                    return;
                }
                var url =  repository.url;
                var configParameters = ['keywords', 'page', 'rows'];
                configParameters.forEach(function(param){
                    var paramEncoded = 
                        _.isUndefined(req.query[param]) 
                        ? encodeURIComponent(repository.config[param])
                        : req.query[param];
                    var paramPlaceholder = '{{'+param+'}}';
                    url = url.replace(paramPlaceholder, paramEncoded);
                });
                // console.log(url);
                req.request({ 
                    url: url, 
                    strictSSL: false,
                    json: true 
                }, function (error, response, repositoryReferences) {
                    // console.log(repositoryReferences);
                    if (error) {
                        res.status(404).end();
                        return;
                    }
                    referenceManager.getVerifiedReferences(
                        req.referencesCollection,
                        req.user.hashes,
                        repositoryReferences, 
                        repository,
                        function (err, verifiedReferences) {
                            // console.log(verifiedReferences);
                            if (err) {
                                res.status(404).end();
                                return;
                            }
                            
                            // res.setHeader("Content-Type", "application/json");
                            res.status(200).send(verifiedReferences).end();
                        }
                    );
                });
            });            
        }
    };
};