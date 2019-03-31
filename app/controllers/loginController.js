var loginController = riskManagementSystem.controller("loginController", ["$scope", "AppService", "rmsService", '$location', '$window', '$http',
    function ($scope, AppService, rmsService, $location, $window, $http) {
        // if (rmsService.tokenExpiry()) {
        //     $location.path("/login");
        //     return;
        // }
        if (rmsService.decryptToken()) {
            $scope.isAdminRole = rmsService.isAdminRole();
            if (!$scope.isAdminRole) {
                $location.path("/incidents");
            } else {
                $location.path("/dashboard");
            }

        }
        $scope.loginUser = function () {
            var req = {
                url: 'https://217.34.35.39:8443/rmsrest/p/api/login',
                method: "POST",
                headers: { 'Authorization': 'Basic ' + $window.btoa(unescape(encodeURIComponent($scope.username + ':' + $scope.password))) },
            }
            AppService.ShowLoader();
            var loginPromise = $http(req);
            loginPromise.then(function (response) {
                var token = response.data.XAuthToken;
                rmsService.loggedInUser = rmsService.decryptToken(token);
                localStorage.setItem("rmsAuthToken", token);
                AppService.HideLoader();
                if (!rmsService.isAdminRole()) {
                    $location.path("/incidents");
                } else {
                    $location.path("/dashboard");
                }

            }, function (error) {
                //show user that credentials are not correct
                $scope.signInError = true;
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })
        }
    }])
