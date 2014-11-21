/*
 * Scientilla v0.0.1 (http://www.scientilla.net)
 * Copyright 2014 Fondazione Istituto Italiano di Tecnologia (http://www.iit.it)
 * Licensed under MIT (https://github.com/scientilla/scientilla/blob/master/LICENSE)
 */


//var discoveryManager = require("../../discovery/models/discovery.js")();
var _ = require("lodash");
var async = require("async");
var peerManager = require("../../peer/models/default.js")();
var configurationManager = require("../../system/controllers/configuration.js");
var networkModel = require("../../network/models/default.js")();
var collectedReferencesManager = require("../../reference/models/collected-references.js")();

module.exports = function () {
        var getReferencesFromAliases = function(rankedReferencesCollection, aliases, config, cb) {
            var aliasesQuery = aliases.join("|");
            var keywords = config.keywords || "";
            var page = config.page || 1;
            var rows = config.rows || 20;
            var skip = (page - 1) * rows;
            var keywordsQuery = "^(?=.*(" + keywords.replace(" ", "))(?=.*(") + "))";
            
            rankedReferencesCollection.find({
                $and: [
                    {"value.top.authors": { 
                        $regex: aliasesQuery,
                        $options: 'i'
                    }},
                    {"value.top.title": {
                        $regex: keywordsQuery,
                        $options: 'i'
                    }}
                ]
            })
                    .sort({ 
                    "value.top.creation_datetime": -1
                }
            ).skip(
                skip
            ).limit(
                rows
            ).toArray(function(err, references) {
                var normalizedReferences = collectedReferencesManager.normalizeRankedReferences(references);
                cb(null, normalizedReferences);
            });
        };
        var getClonableReferences = function(referencesCollection, aliasesReferences, cb) {
            referencesCollection.find().toArray(function(err, signedReferences){
                if (err) {
                    cb(err, null);
                }
                var clonableReferences = _.reduce(aliasesReferences, function(acc, ref) {
                    if (_.some(signedReferences, {original_hash: ref.original_hash})) {
                        ref.clonable = false;
                    } else {
                        ref.clonable = true;
                    }
                    acc.push(ref);
                    return acc;
                }, []);
                cb(err, clonableReferences);
            });
        };
    return {
        getReferences: function(req, res) {
            var configuration = configurationManager.get();
            if (configuration.seed) {
                var aliases = req.query.aliases;
                var config = _.pick(req.query, ['keywords', 'page', 'rows']);
                async.waterfall([
                    function(cb) {
                        getReferencesFromAliases(req.rankedReferencesCollection, aliases, config, cb);
                    },
                    function(aliasesReferences, cb) {
                        getClonableReferences(req.referencesCollection, aliasesReferences, cb);
                    }
                ], 
                function(err, references) {
                    if (err) {
                        console.log(err);
                        res.status(500).end();
                        return;
                    }
                    res.setHeader("Content-Type", "application/json");
                    res.json(references);
                    return;
                });
            } else {
                networkModel.getRandomSeed(req.seedsConfiguration, function(err, seed) {
                    var url = seed.url + "/api/discovery/references";
                    req.request({ 
                        url: url, 
                        qs: req.query,
                        strictSSL: false,
                        json: true
                    }, function(err, response, body) {
                            if (err) {
                                console.log(err);
                                res.status(500).end();
                                return;
                            }
                            res.setHeader("Content-Type", "application/json");
                            res.json(body);
                            return;
                        });
                    });
            }
        }
    };
};