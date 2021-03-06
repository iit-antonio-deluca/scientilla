/*
 * Scientilla v1.0 Beta (http://www.scientilla.net)
 * Copyright 2014-2015 Fondazione Istituto Italiano di Tecnologia (http://www.iit.it)
 * Licensed under MIT (https://github.com/scientilla/scientilla/blob/master/LICENSE)
 */

angular.module("system").factory(
    "systemStatusService", function($location, $http) {
        var systemAuthenticationProvider = {};
        
        systemAuthenticationProvider.getStatus = function() {
            return $http({
				method: "GET",
				url: "/api/status",
                cache: false,
                timeout: 30000
			});
        };
        
        systemAuthenticationProvider.react = function(status, callback) {
            switch (status) {
                case 401:
                    $location.path("login");
                    break;
                    
                case 404:
                    if (callback) {
                        callback();
                    }
                    break;
                    
                case 500:
                    $location.path("edit-user");
                    break;
            }
        };        
        
        return systemAuthenticationProvider;
    }    
);