/*
 * Scientilla v1.0 Beta (http://www.scientilla.net)
 * Copyright 2014-2015 Fondazione Istituto Italiano di Tecnologia (http://www.iit.it)
 * Licensed under MIT (https://github.com/scientilla/scientilla/blob/master/LICENSE)
 */

angular.module("setting").controller(
    "settingsBrowsingController", ["$scope", "settingsService", "usersService", "systemStatusService", "$window", "$location", function($scope, settingsService, usersService, systemStatusService, $window, $location) {
        $scope.oSettings = {};
        
        $scope.retrieveSettings = function retrieveSettings() {
            $scope.empty = false;
            $scope.ready = false;
            async.series([
                function(callback) {
                    settingsService.getSettings($window.sessionStorage.userToken).success(function(data, status, headers, config) {
                        $scope.oSettings = data;
                        callback();
                    }).error(function(data, status, headers, config) {
                        systemStatusService.react(status, callback);
                    });
                },
                function(callback) {
                    usersService.getUsers($window.sessionStorage.userToken).success(function(data, status, headers, config) {
                        $scope.aUsers = data;
                        callback();
                    }).error(function(data, status, headers, config) {
                        $scope.error = true;
                        systemStatusService.react(status, callback);
                    }); 
                },
                function(callback) {
                    $scope.ready = true;
                    callback();
                }
            ]);
           
            return retrieveSettings;
        }();
       
        $scope.updateSettings = function() {
            settingsService.updateSettings({
                port: $scope.oSettings.port,
                ssl_key_path: $scope.oSettings.ssl_key_path,
                ssl_cert_path: $scope.oSettings.ssl_cert_path,
                url: $scope.oSettings.url,
                secret: $scope.oSettings.secret,
                owner_user_id: $scope.oSettings.owner_user_id,
                mode: $scope.oSettings.mode,
                files_routing: $scope.oSettings.files_routing,
                database_type: $scope.oSettings.database_type,
                database_host: $scope.oSettings.database_host,
                database_port: $scope.oSettings.database_port
            }, $window.sessionStorage.userToken).success(function(data, status, headers, config) {
                $location.path("browse-references");
            }).error(function(data, status, headers, config) {
                systemStatusService.react(status);
            });
        };       
    }]
);