/*
 * Scientilla v1.0 Beta (http://www.scientilla.net)
 * Copyright 2014-2015 Fondazione Istituto Italiano di Tecnologia (http://www.iit.it)
 * Licensed under MIT (https://github.com/scientilla/scientilla/blob/master/LICENSE)
 */

angular.module("reference").controller(
    "receivedReferencesBrowsingController", ["$scope", "referencesService", "systemStatusService", "$window", "$location", function($scope, referencesService, systemStatusService, $window, $location) {
        $scope.aReceivedReferences = [];
        
        $scope.retrieveReferences = function retrieveReferences() {
            $scope.empty = false;
            $scope.ready = false;
            $scope.error = false;
            referencesService.getReceivedReferences($window.sessionStorage.userToken).success(function(data, status, headers, config) {
                $scope.aReceivedReferences = data;
                if ($scope.aReferences.length === 0) {
                    $scope.empty = true;
                }            
                $scope.ready = true;            
            }).error(function(data, status, headers, config) {
                $scope.error = true;
                systemStatusService.react(status);
            });
            
            return retrieveReferences;
        }();
    }]
);