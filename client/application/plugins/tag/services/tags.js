/*
 * Scientilla v1.0 Beta (http://www.scientilla.net)
 * Copyright 2014-2015 Fondazione Istituto Italiano di Tecnologia (http://www.iit.it)
 * Licensed under MIT (https://github.com/scientilla/scientilla/blob/master/LICENSE)
 */

angular.module("tags").factory(
    "tagsService", function($http) {
        var tagsProvider = {};
        var url = "/api/tags";
        
        tagsProvider.getTags = function(keywords, token) {
            return $http({
				method: "GET",
				url: url,
                params: {keywords: keywords},
                cache: false,
                timeout: 30000,
                headers: {
                    Authorization: 'Bearer ' + token
                }
			});
        };
        
        return tagsProvider;
    }
);