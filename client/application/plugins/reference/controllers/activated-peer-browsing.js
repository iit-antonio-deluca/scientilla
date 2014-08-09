/*
 * Scientilla v0.0.1 (http://www.scientilla.net)
 * Copyright 2014 Fondazione Istituto Italiano di Tecnologia (http://www.iit.it)
 * Licensed under MIT (https://github.com/scientilla/scientilla/blob/master/LICENSE)
 */

angular.module("reference").controller(
    "activatedPeerReferencesBrowsingController", ["$scope", "peerReferencesService", "activatedPeersService", "peersService", "systemStatusService", "$window", "$location", function($scope, peerReferencesService, activatedPeersService, peersService, systemStatusService, $window, $location) {       
        $scope.empty = false;
        $scope.ready = false;
        async.series([
            function(callback) {
                $scope.oActivatedPeer = {};
                activatedPeersService.getActivatedPeer($window.sessionStorage.token).success(function(data, status, headers, config) {
                    $scope.oActivatedPeer.id = data.peer_id;
                    callback();
                }).error(function(data, status, headers, config) {
                    systemStatusService.react(status, callback);
                });
            },
            function(callback) {
                $scope.aReferences = [];
                peerReferencesService.getReferences(
                    $scope.oActivatedPeer.id,
                    $window.sessionStorage.token
                ).success(function(data, status, headers, config) {
                    $scope.aReferences = data;
                    if ($scope.aReferences.length === 0) {
                        $scope.empty = true;
                    }                    
                    callback();
                }).error(function(data, status, headers, config) {
                    systemStatusService.react(status, callback);
                });
            },
            function(callback) {
                $scope.ready = true;
                callback();
            }
        ]);        
    }]
);