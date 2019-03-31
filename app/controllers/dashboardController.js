var dashboardController = riskManagementSystem.controller("dashboardController", ["$scope", "AppService", "rmsService", '$http', '$location', function ($scope, AppService, rmsService, $http, $location) {
    if (rmsService.tokenExpiry()) {
        $location.path("/login");
        return;
    }

    // localStorage.getItem('rmsAuthToken'); = localStorage.getItem('rmsAuthToken');
    $scope.authorizedUser = rmsService.decryptToken();
    $scope.loggedInUser = rmsService.getLoggedInUser();
    //$scope.role = $scope.loggedInUser.roles[0];
    $scope.thisView = "dashboard";
    $scope.logOutUser = function () {
        rmsService.logOutUser();
    }
    $scope.isAdminRole = rmsService.isAdminRole()
    if (!$scope.isAdminRole) {
        $location.path("/incidents");
    }
    $scope.getIncidentReportCount = function () {
        var req = {
            url: rmsService.baseEndpointUrl + 'admin/admin-dashboard-hdr-stat',
            method: "GET",
            headers: { 'X-AUTH-TOKEN': localStorage.getItem('rmsAuthToken') },
        }
        AppService.ShowLoader();
        let promise = $http(req);
        promise.then(function (response) {
            $scope.incidentReportCount = response.data;
            AppService.HideLoader();
        }, function (error) {
            AppService.HideLoader();
        })
    }

    $scope.getDashboardIncidentVolumeByStatus = function () {
        var req = {
            url: rmsService.baseEndpointUrl + 'admin/admin-dashboard-inc-volume-by-sts',
            method: "GET",
            headers: { 'X-AUTH-TOKEN': localStorage.getItem('rmsAuthToken') },
        }
        AppService.ShowLoader();
        let promise = $http(req);
        promise.then(function (response) {
            $scope.incidentVolumeByStatus = response.data;
            //$scope.setGraphMonths();
            console.log(response.data);
            $scope.volumeByStatusMonths = $scope.incidentVolumeByStatus.map(item => {
                return item.monthYear;
            })
            $scope.createGraph("Incident volume by status", $scope.groupDataForGraph('monthYear', 'incidentVolumeByStatus', 'volumeByStatusMonths'), $scope.volumeByStatusMonths, 'incidentVolumeByStatusGraph');
            AppService.HideLoader();
        }, function (error) {
            AppService.HideLoader();
        })
    }

    $scope.groupDataForGraph = function (property, array, category) {
        let group = {};
        $scope[array].map((item) => {
            if (!group[item.incidentStatus]) {
                group[item.incidentStatus] = { "name": item.incidentStatus, data: [] };
            }
            let indx = $scope[category].indexOf(item[property]);
            group[item.incidentStatus]['data'][indx] = item.incidentCount;

        });

        let arr = [];
        for (let key in group) {
            let groupLength = group[key]['data'].length;

            for (let ind = 0; ind < groupLength; ind++) {
                if (typeof group[key].data[ind] == 'undefined') {
                    group[key].data[ind] = 0;
                }

            }
            arr.push(group[key]);
        }
        return arr;
    }


    $scope.createGraph = function (title, data, categories, container) {

        Highcharts.chart(container, {

            title: {
                text: title
            },

            // subtitle: {
            //     text: 'Source: thesolarfoundation.com'
            // },
            credits: {
                enabled: false
            },
            yAxis: {
                title: {
                    text: 'Number of Incidents'
                }
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
            },
            xAxis: {
                categories: categories,//$scope.volumeByStatusMonths,

                labels: {
                    formatter: function () {
                        return this.value
                    }
                }
            },
            series: data,//$scope.groupDataForStatusVolume()
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }

        });
    }

    $scope.getDashboardIncidentVolumeByTypeStatus = function () {
        var req = {
            url: rmsService.baseEndpointUrl + 'admin/admin-dashboard-inc-type-by-sts',
            method: "GET",
            headers: { 'X-AUTH-TOKEN': localStorage.getItem('rmsAuthToken') },
        }
        AppService.ShowLoader();
        let promise = $http(req);
        promise.then(function (response) {
            $scope.incidentVolumeByTypeStatus = response.data;
            $scope.incidentTypesByStatus = response.data.map(item => item.incidentType);
            console.log(response.data);
            $scope.createGraph("Incident volume by incident type & status", $scope.groupDataForGraph('incidentType', 'incidentVolumeByTypeStatus', 'incidentTypesByStatus'), $scope.incidentTypesByStatus, 'incidentGroupedByType');
            //$scope.createGraph(incidentGroupedByType);
            AppService.HideLoader();
        }, function (error) {
            AppService.HideLoader();
        })
    }

    $scope.changeMenu = function () {
        $scope.thisView = $event.target.id;
    }
    $scope.$watch('graph', function () {
        //get graph data when needed
        if ($scope.graph == 2) {
            $scope.getDashboardIncidentVolumeByTypeStatus()
        }
        if ($scope.graph == 1) {
            $scope.getDashboardIncidentVolumeByStatus();
        }
        if ($scope.graph == 3) {
            $scope.getDashboardIncidentVolumeByEventType();
        }
    })

    $scope.getDashboardIncidentVolumeByEventType = function () {
        var req = {
            url: rmsService.baseEndpointUrl + 'admin/admin-dashboard-inc-vol-by-event-type',
            method: "GET",
            headers: { 'X-AUTH-TOKEN': localStorage.getItem('rmsAuthToken') },
        }
        AppService.ShowLoader();
        let promise = $http(req);
        promise.then(function (response) {
            $scope.incidentVolumeByEventType = response.data;
            $scope.incidentVolumeByEventTypeCategories = $scope.getMonthsIncidentEvenetType();
            // $scope.incidentVolumeByEventTypeKeys = Object.keys(response.data);
            // $scope.incidentVolumeByEventTypeKeys  = $scope.incidentVolumeByEventTypeKeys.map(item => item.replace(/([A-Z]+)/g, " $1"));
            $scope.createGraph("Incident volume by event type", $scope.groupDataForEventGraph(), $scope.incidentVolumeByEventTypeCategories, 'incidentGroupedByEvents');
            AppService.HideLoader();
        }, function (error) {
            AppService.HideLoader();
        })
    }

    $scope.groupDataForEventGraph = function () {
        let arr = [];
        let months = $scope.getMonthsIncidentEvenetType();
        for (let key in $scope.incidentVolumeByEventType) {
            let obj = {
                name: (key.charAt(0).toUpperCase() + key.slice(1)).replace(/([A-Z]+)/g, " $1"),
                data: []
            }
            $scope.incidentVolumeByEventType[key].forEach(item => {
                obj.data[months.indexOf(item.monthYear)] = item.incidentCount;
            })
            let groupLength = obj.data.length;

            for (let ind = 0; ind < groupLength; ind++) {
                if (typeof obj.data[ind] == 'undefined') {
                    obj.data[ind] = 0;
                }
            }
            arr.push(obj);
        }
        return arr;
    }

    $scope.getMonthsIncidentEvenetType = function () {
        let arr = [];
        for (let key in $scope.incidentVolumeByEventType) {
            $scope.incidentVolumeByEventType[key].forEach(item => {
                if (arr.indexOf(item.monthYear) == -1) {
                    arr.push(item.monthYear);
                }
            })
        }
        return arr;
    }

    $scope.getIncidentReportCount();
}])