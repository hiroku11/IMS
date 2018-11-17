(function () {
    'use strict';
    var AppService = angular.module('riskManagementSystem')
        .factory('AppService', function ($rootScope, $http, $location, $timeout) {
            return {
                ShowLoader: function (message) {
                    (function () {
                        $rootScope.loaderVisibility = true;
                        $rootScope.loaderText = message;
                    })();
                },
                HideLoader: function () {
                    (function () {
                        $rootScope.loaderVisibility = false;
                    })();
                }
            };
        })

    riskManagementSystem.service("rmsService", function ($http, $window, $location) {
        this.authorisedUserDetails = false;
        this.decryptToken = function () {
            if (this.authorisedUserDetails) {
                return this.authorisedUserDetails
            }
            //decrypt the authorization token.
            var token = localStorage.getItem("rmsAuthToken");
            if (!token) {
                $location.path("/login");
                return;
            }
            var base64Url = token.split('.')[0];
            var decryptedUserDetails = JSON.parse(window.atob(base64Url));
            if (decryptedUserDetails) {
                this.authorisedUserDetails = decryptedUserDetails;
                //check if the token has expired
                if (new Date(decryptedUserDetails.expires) < new Date()) {
                    expired = true;
                }
            } else {
                //if token not present redirect to login
                $location.path("/login");
            }

        }
        this.baseEndpointUrl = "https://gotorisk.co.uk:8443/rmsrest/s/";
        this.getLoggedInUser = function () {
            if (!this.authorisedUserDetails) {
                this.decryptToken();
            }
            this.loggedInUser = {};
            this.loggedInUser.userId = this.authorisedUserDetails.loginId;
            this.loggedInUser.loginId = this.authorisedUserDetails.loginId;
            this.loggedInUser.lastName = this.authorisedUserDetails.lastName;
            this.loggedInUser.firstName = this.authorisedUserDetails.firstName;
            this.loggedInUser.roles = this.authorisedUserDetails.roles.map(function (item) {
                return item.roleName;
            });
            return this.loggedInUser;
        }
        this.logOutUser = function () {
            localStorage.removeItem("rmsAuthToken");
            this.authorisedUserDetails = false;
            this.loggedInUser = null;
            $location.path("/login");
        }
        this.isAdminRole = function () {
            let adminRoles = ['INVESTIGATOR', 'CLAIMS_HANDLER', 'ADMIN'];
            if (!this.loggedInUser) {
                this.getLoggedInUser();
                if (!this.loggedInUser) {
                    return false;
                }
            }
            return adminRoles.some(role => this.loggedInUser.roles.includes(role));
        }
        this.cloneObject = function (obj) {
            return JSON.parse(JSON.stringify(obj));
        }
        this.formatDate = function (data) {
            if (data == undefined || data == null) {
                return null;
            }
            let out = null;
            let date = new Date(data);
            if (date.getTime() == date.getTime()) {
                out = (date.getDate().toString().length == 1 ? '0' + date.getDate() : date.getDate()) + "/" + ((date.getMonth() + 1).toString().length == 1 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + "/" + date.getFullYear();
            } else {
                let splittedDate = data.split("/");
                data = splittedDate[1] + "/" + splittedDate[0] + "/" + splittedDate[2];
                date = new Date(data);
                let month = date.getMonth() + 1;
                if (month.length == 1) {
                    month = "0" + month;
                }

                out = month + "/" + (date.getDate().toString().length == 1 ? '0' + date.getDate() : date.getDate()) + "/" + date.getFullYear();
            }
            return out;
        }
        this.showAlert = function (success, message) {
            if (success) {
                if (message) {
                    $("#success-message").text(message);
                }
                $("#success-alert").show();
            } else {
                $("#error-message").text(this.getErrorMessage(message));
                $("#error-alert").show()
            }
            setTimeout(function () {
                $("#success-alert,#error-alert").hide()
            }, 3000)
        }
        this.getErrorMessage = function (error) {
            if (typeof error === 'string') {
                return error;
            }
            if (error.staus === 403) {
                return 'Your are not authorised to perform this action.'
            }
            if (error.status >= 400 && error.status < 500) {
                try {
                    if (error.error.errorMessages[0].indexOf(":") == -1) {
                        return error.error.errorMessages[0]
                    }
                    return error.error.errorMessages[0].split(":")[1];
                } catch{
                    return "Some error occured please try again.";
                }
            }
            if (error.status >= 500) {
                return "Some server error occured please try again.";
            }
        }

    })

    riskManagementSystem.service("helperFunctions", function () {
        this.range = function (count, itemPerPage) {
            count = count / itemPerPage;
            var ranges = [];
            for (var i = 0; i < count; i++) {
                ranges.push(i + 1)
            }
            return ranges;
        }
    })




})();

