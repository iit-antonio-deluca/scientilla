/*
 * Scientilla v1.0 Beta (http://www.scientilla.net)
 * Copyright 2014-2015 Fondazione Istituto Italiano di Tecnologia (http://www.iit.it)
 * Licensed under MIT (https://github.com/scientilla/scientilla/blob/master/LICENSE)
 */

angular.module("user").controller(
    "userEditingController", 
    ["$scope", "$routeParams", "usersService", "systemStatusService", "$window", "$location", 
    function($scope, $routeParams, usersService, systemStatusService, $window, $location) {
        $scope.oUser = {
            type: "",
            rights: 1,
            scientilla_nominative: "",
            first_name: "",
            middle_name: "",
            last_name: "",
            business_name: "",
            birth_date: "",
            birth_city: "",
            birth_state: "",
            birth_country: "",
            sex: "",
            email: "",
            username: "",
            password: "",
            password_repetition: "",
            status: "",
            description: ""
        };

        $scope.retrieveUser = function retrieveUser() {
            usersService.getUser(
                $routeParams.id, 
                $window.sessionStorage.userToken
            ).success(function(data, status, headers, config) {
                for (key in data) {
                    if (key !== "password" && key !== "password_repetition") {
                        $scope.oUser[key] = data[key];
                    }
                }
            }).error(function(data, status, headers, config) {
                systemStatusService.react(status);
            });

            return retrieveUser;
        }();

        $scope.updateUser = function() {
            usersService.updateUser({
                type: $scope.oUser.type,
                rights: $scope.oUser.rights,
                scientilla_nominative: $scope.oUser.scientilla_nominative,
                first_name: $scope.oUser.first_name,
                middle_name: $scope.oUser.middle_name,
                last_name: $scope.oUser.last_name,
                business_name: $scope.oUser.business_name,
                birth_date: $scope.oUser.birth_date,
                birth_city: $scope.oUser.birth_city,
                birth_state: $scope.oUser.birth_state,
                birth_country: $scope.oUser.birth_country,
                sex: $scope.oUser.sex,
                email: $scope.oUser.email,
                username: $scope.oUser.username,
                password: $scope.oUser.password,
                password_repetition: $scope.oUser.password_repetition,
                status: $scope.oUser.status,
                description: $scope.oUser.description,
                id: $scope.oUser._id
            }, $window.sessionStorage.userToken).success(function(data, status, headers, config) {
                usersService.getLoggedUser($window.sessionStorage.userToken).success(function(data, status, headers, config) {
                    usersService.updateExchangedInformation({
                        user_type: data.type,
                        user_rights: data.rights,
                        user_scientilla_nominative: data.scientilla_nominative,
                        user_aliases: JSON.stringify(data.aliases)
                    }, function() {
                        $scope.$emit("exchanged-information-modification");
                        $location.path("browse-users");
                    });
                }).error(function(data, status, headers, config) {
                    systemStatusService.react(status);
                });
            }).error(function(data, status, headers, config) {
                systemStatusService.react(status);
            });
        };        
    }]
);