var addIncidentController = riskManagementSystem.controller("addIncidentController", ["$scope", "AppService", "rmsService", '$location', '$window', '$http', '$state', 'dateformatterFilter',
    function ($scope, AppService, rmsService, $location, $window, $http, $state, dateformatterFilter) {
        $scope.token = localStorage.getItem('rmsAuthToken');
        $scope.thisView = "incidents";
        $scope.authorizedUser = rmsService.decryptToken();
        $scope.loggedInUser = rmsService.getLoggedInUser();
        $scope.whatFor = null;
        $scope.logOutUser = function () {
            rmsService.logOutUser();
        }
        $scope.isAdminRole = rmsService.isAdminRole();
        $scope.altInputFormats = ['M!/d!/yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy'];
        $scope.maxDate = new Date();
        $scope.postcode1 = null;
        $scope.postcode2 = null;
        $scope.incident = {
            "incidentId": "",
            "uniqueIncidentId": "",
            "incidentStatus": "",
            "supportingDocuments": []
        }
        if ($state.params.uniqueIncidentId) {
            $scope.incident.uniqueIncidentId = $state.params.uniqueIncidentId;
            $scope.editIncidentMode = true;
        }
        // if (!$scope.isAdminRole) {
        //     //comment if the user can also edit an incident
        //     $location.path("/incidents");
        //     return;
        // }

        $scope.options = ['Scar', 'Balding', 'Glasses', 'Accent', 'Beard', 'Birth Mark', 'Mole', 'Squint'];
        $scope.incidentType = {};
        $scope.incidentLoc = {};
        $scope.entryPoint = {};
        $scope.features = {};
        $scope.agencies = {};
        $scope.suspectType = {};
        $scope.accidentLoc = {};
        $scope.partsJson = [];
        $scope.Math = Math;

        $scope.editsuspect = false;
        $scope.editLoss = false;
        $scope.accAdded = false;
        $scope.assetAdded = false;
        $scope.editInjured = false;
        $scope.editWitness = false;
        $scope.editequipment = false;
        $scope.editvehicle = false;
        $scope.editBuilding = false;
        $scope.editassetother = false;
        $scope.crimeAdded = false;
        $scope.editCrimeWitness = false;
        $scope.editCrimeSuspect = false;
        $scope.claimRefId = "";
        $scope.vehDamageTypedesc = [];
        $scope.vehicleDamageType = { temp: [] };
        $scope.logIncidentDetails = {
            "incidentId": null,
            "incidentOpenedDateTime": null,
            "dateIncident": new Date(),
            "uniqueIncidentId": null,
            "statusFlag": null,
            "propertyDamage": "Y",
            "criminalAttack": "",
            "accidentDamage": "",
            "assetDamage": "",
            "placeOfIncident": "",
            "incidentDescription": "",
            "incidentTypeOther": null,
            "entryPointOther": null,
            "incidentLocationOther": null,
            "entryPoint": {
                "id": "",
                "description": null
            },
            "incidentStatus": 'DRAFT',
            "incidentLocation": {
                "id": "",
                "description": null
            },
            "incidentLocationDetail": {
                "id": "",
                "description": null
            },
            "incidentType": {
                "id": "",
                "description": null
            },
            "timeHrsOfIncident": (new Date().getHours()).toString().length == 1 ? '0' + (new Date().getHours()) : new Date().getHours(),
            "timeMinOfIncident": (new Date().getMinutes()).toString().length == 1 ? '0' + (new Date().getMinutes()) : new Date().getMinutes()
        }

        $scope.suspect = {
            addresses: [{
                "id": null,
                "statusFlag": "ACTIVE"
            }],

            distinguishingFeatureDetails: null,
            distinguishingFeature: null
        }

        $scope.suspects = [];
        $scope.witness = {
            addresses: [],
            distinguishingFeatureDetails: null,
            distinguishingFeature: null
        }
        $scope.witnesses = [];
        $scope.assetWitness = {
            addresses: [],
            distinguishingFeatureDetails: null,
            distinguishingFeature: null
        }
        $scope.vehicle = {

            "assetCategory": {
                "id": "VEHICLE",
                "description": null
            },
            "vehicleDamageTypes": []



        }
        $scope.vehicles = [];
        $scope.equipment = {

            "assetCategory": {
                "id": "EQUIPMENT",
                "description": null
            }

        }
        $scope.assetOther = {
            "id": null,
            "assetCategory": {
                "id": "OTHER",
                "description": null
            },
            addresses: [{
                "id": null,
                "statusFlag": "ACTIVE"
            }],
        };
        $scope.assetOthers = [];
        $scope.equipments = [];
        $scope.building = {

            "assetCategory": {
                "id": "BUILDING",
                "description": null
            }

        }
        $scope.buildings = [];
        $scope.loss = {
            "id": null,
            "incident": {},
            "statusFlag": "ACTIVE",
            "date": new Date(),
            "timeHrsContacted": ((new Date()).getHours()).toString().length == 2 ? (new Date()).getHours() : '0' + ((new Date()).getHours()),
            "timeMinContacted": ((new Date()).getMinutes()).toString().length == 2 ? (new Date()).getMinutes() : '0' + ((new Date()).getMinutes()),
            "externalAgency": {}
        }
        $scope.incidentDetails = {
            "incidentId": 0,
            "uniqueIncidentId": "",
            "newSuspects": [

            ],
            "existingSuspects": [

            ],
            "employeeSuspects": [

            ],
            "reportedLosses": [

            ]
        }


        $scope.accidentDetails = {
            incident: {},
            id: null
            //"incidentId": $scope.incident.incidentId,
            // "uniqueIncidentId": $scope.incident.uniqueIncidentId,
            //accident: {},
            // newInjuredPersons: [],
            // existingInjuredPersons: [],
            // employeeInjuredPersons: [],
            // newWitnesses: [],
            // existingWitnesses: [],
            // employeeWitnesses: []
        }

        $scope.assetDetail = {
            "id": null,
            "incident": {},
            "statementDescription": null,
            "otherDescription": null,
            "statusFlag": null,
            // "assetCategory": {
            //     "id": null,
            //     "description": null
            // }
        }
        $scope.assetCategory = {
            "id": null,
            "description": null
        }
        $scope.claimDetail = {
            "id": null,
            "incident": {},
            "statusFlag": null,
            "claimType": {
                "id": null
            },
            "policyType": {
                "id": null
            },
            "claimStatus": {
                "id": null
            },
            "claimHandler": {
                "id": null,
                "loginId": null,
                "username": null
            },
            "securityRequested": "N",
            "trainingRequested": "N",
            "claimRequestedAmount": null,
            "claimRequestedDate": new Date(),
            "claimRequestedBy": null,
            "claimApprovedAmount": null,
            "claimApprovedDate": new Date(),
            "claimApprovedBy": null,
            "claimSettlementAmount": null,
            "claimSettlementDate": new Date(),
            "claimSettlementBy": null,
            "claimDeclinedDate": new Date(),
            "claimDeclinedBy": null,
            "claimReopenedDate": new Date(),
            "claimReopenedBy": null,
            "claimRequestedComments": null,
            "claimApprovedComments": null,
            "claimSettlementComments": null,
            "claimDeclinedComments": null,
            "claimReopenedComments": null,
            "claimTypeOther": null,
            "claimRequestRegistrationTypeOther": null,
            "policyTypeOther": null
        }
        $scope.investigationDetails = {

            "id": null,
            "incident": {},
            "statusFlag": null,
            "securityRequested": "N",
            "trainingRequested": "N",
            "reviewedInvestigationRecords": "N",
            "reviewedCCTV": "N",
            "reviewedPictures": "N",
            "reviewedWitnessStatement": "N",
            "reviewedLearnerRecords": "N",
            "reviewedAssetRecords": "N",
            "reviewedComplianceRecords": "N",

            "investigatorStatement": "",
            "investigator": {
                "id": null,
                "loginId": null,
                "username": null
            }

        }

        $scope.injuredPerson = {
            addresses: [],
            bodyParts: [],
            distinguishingFeatureDetails: null,
            distinguishingFeature: null,

        }

        $scope.injuredPersons = [];
        $scope.partsSelected = [];

        $scope.getSupportingDocuments = function () {
            //get all documnets

            $scope.supportingDocumentsFormData.append("uniqueIncidentId", $scope.incident.uniqueIncidentId);
            var req = {
                url: rmsService.baseEndpointUrl + 'document/documents-for-incident/' + $scope.incident.uniqueIncidentId,
                method: "POST",
                headers: {
                    'X-AUTH-TOKEN': $scope.token,
                },
            }
            AppService.ShowLoader();
            $http(req).then(function (response) {
                AppService.HideLoader();
                $scope.incident.supportingDocuments = response.data;
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);

            })
        }
        //  $scope.myObj = {$scope.injuredPerson.bodyParts : []}

        //Click event
        // $scope.changeBodyPart = function(args) {
        //     var flag = false;
        //     if ($scope.injuredPerson.bodyParts == undefined) {
        //         $scope.injuredPerson.bodyParts = [];
        //     }
        //     // $scope.partsSelected = $scope.injuredPerson.bodyParts;
        //     if ($scope.injuredPerson.bodyParts.length != 0) {
        //         for (var i = 0; i < $scope.injuredPerson.bodyParts.length; i++) {
        //             if ($scope.injuredPerson.bodyParts[i] == args) {
        //                 $scope.injuredPerson.bodyParts.splice(i, 1);
        //                 flag = true;
        //                 break;
        //             }
        //         }

        //     }
        //     if (flag == false) {
        //         $scope.injuredPerson.bodyParts.push(args);

        //     }
        //     $scope.$apply();
        // }
        $scope.triggerExternalAgency = function () {
            if ($scope.loss.externalAgencyContacted == 'N') {
                $scope.loss.externalAgency.id = "";
            }
        }
        var temp = [];
        $scope.myObj = { temp: [] };
        $scope.changeBodyPart = function (args) {
            var flag = false;
            // if ($scope.injuredPerson.bodyParts == undefined) {
            //     $scope.injuredPerson.bodyParts = [];
            // }
            if ($scope.myObj.temp == undefined) {
                $scope.myObj.temp = [];
            }
            // $scope.partsSelected = $scope.injuredPerson.bodyParts;
            if ($scope.myObj.temp.length != 0) {
                for (var i = 0; i < $scope.myObj.temp.length; i++) {
                    if ($scope.myObj.temp[i] == args) {
                        $scope.myObj.temp.splice(i, 1);
                        flag = true;
                        break;
                    }
                }

            }
            if (flag == false) {

                // var args = {
                //     "id": $scope.bodyPartsArray.map(function(d) {
                //         if (d == args) return d;
                //     }),
                //     "description": args
                // }
                $scope.myObj.temp.push(args);

            }

            $scope.injuredPerson.bodyParts = $scope.myObj.temp;

            //$scope.myObj = { temp: $scope.injuredPerson.bodyParts }
        }


        $scope.crimeDetails = {
            "id": null,
            "incident": {
                "id": null
            },
            "statusFlag": null,
            "crimeDateTime": null,
            "crimeDescription": null,
            "anyWitness": null,
            "date": new Date(),
            "timeHrs": (new Date().getHours()).toString().length == 2 ? new Date().getHours() : '0' + (new Date().getHours()),
            "timeMin": (new Date().getMinutes()).toString().length == 2 ? new Date().getMinutes() : '0' + (new Date().getMinutes()),
            "witnesses": [],
            "crimeSuspects": []
        }
        $scope.crimesuspects = [];

        $scope.crimeWitness = {
            addresses: [],
            distinguishingFeatureDetails: null,
            distinguishingFeature: null
        }

        $scope.crimeSuspect = {
            addresses: [],
            distinguishingFeatureDetails: null,
            distinguishingFeature: null
        }
        $scope.tabs = [{ "active": true, "description": "Log Incident", "name": "logIncidentForm", "tab": 1 },
        { "active": false, "description": "Incident Details", "name": "incidentDetailsForm", "tab": 2 },
        // { "active": false, "description": "Accident" ,"name":"accidentForm","tab":3},
        // { "active": false, "description": "Assets" ,"name":"assetsForm","tab":4},
        // { "active": false, "description": "Crime" ,"name":"crimeForm","tab":5},
        //{ "active": false, "description": "Claim", "name": "claimForm", "tab": 6 },
        //{ "active": false, "description": "Investigation", "name": "investigationForm", "tab": 7 },
        { "active": false, "description": "Supporting Document(s)", "name": "supportingDocumentsForm", "tab": 8 },
        { "active": false, "description": "Summary", "name": "summaryForm", "tab": 9 }
        ];

        $scope.changeTab = function (tab) {
            //naviigate through tabs as well
            $scope.activeTab.active = false;
            $scope.activeTab = tab;
            $scope.activeTab.active = true;
        }

        $scope.supportingDocuments = [{}, {}, {}, {}, {}];
        $scope.activeTab = { "active": true, "description": "Log Incident", "name": "logIncidentForm", "tab": 1 };
        //$scope.activeTab = { "active": true, "description": "Summary", "name": "summaryForm", "tab": 9 };
        $scope.calendar = {
            open: function ($event, which) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.calendar.opened[which] = true;
            },
            opened: {

            }
        };
        $scope.addTab = function (formName) {
            var tabPresent = false;
            var index;
            $scope.tabs.filter(function (val, ind) {
                if (val.name == formName) {
                    tabPresent = true;
                    index = ind;
                }
            });

            if (!tabPresent) {
                if (formName == "accidentForm") {
                    if ($scope.logIncidentDetails.accidentDamage) {
                        $scope.tabs.push({ "active": false, "description": "Accident", "name": "accidentForm", "tab": 3 });
                        return;
                    } else {
                        $scope.tabs.splice(index, 1);
                        return;
                    }

                }
                if (formName == "assetsForm") {
                    if ($scope.logIncidentDetails.assetDamage) {
                        $scope.tabs.push({ "active": false, "description": "Asset", "name": "assetsForm", "tab": 4 });
                        return;
                    } else {
                        $scope.tabs.splice(index, 1);
                        return;
                    }
                }
                if (formName == "crimeForm") {
                    if ($scope.logIncidentDetails.criminalAttack) {
                        $scope.tabs.push({ "active": false, "description": "Crime", "name": "crimeForm", "tab": 5 });
                        return;
                    } else {
                        $scope.tabs.splice(index, 1);
                        return;
                    }
                }
                if (formName == "claimForm") {
                    $scope.tabs.push({ "active": false, "description": "Claim", "name": "claimForm", "tab": 6 });
                    return;

                }
                if (formName == "investigationForm") {
                    $scope.tabs.push({ "active": false, "description": "Investigation", "name": "investigationForm", "tab": 7 });
                    return;
                }
                return;
                //{ "active": false, "description": "Claim", "name": "claimForm", "tab": 6 },
                //{ "active": false, "description": "Investigation", "name": "investigationForm", "tab": 7 },  
            }
            if (tabPresent) {
                $scope.tabs.splice(index, 1);
            }
        }
        $scope.handleTabsForRoles = function () {
            if ($scope.loggedInUser.roles.indexOf('INVESTIGATOR') > -1 ||
                $scope.loggedInUser.roles.indexOf('CLAIMS_HANDLER') > -1 ||
                $scope.loggedInUser.roles.indexOf('ADMIN') > -1) {
                $scope.addTab('investigationForm');
                $scope.addTab('claimForm');
            }
        }
        $scope.handleTabsForRoles();
        $scope.initializeAccidentPlaceAndTime = function () {
            if ($scope.accidentDetails.accidentDate || $scope.accidentDetails.accidentTimeMin
                || $scope.accidentDetails.accidentTimeMin) { return; }
            else {
                $scope.accidentDetails.accidentPlace = $scope.accidentDetails.accidentPlace ?
                    $scope.accidentDetails.accidentPlace : $scope.logIncidentDetails.placeOfIncident;
                $scope.accidentDetails.accidentDate = $scope.logIncidentDetails.dateIncident;
                if ($scope.logIncidentDetails.timeHrsOfIncident && $scope.logIncidentDetails.timeMinOfIncident) {
                    $scope.accidentDetails.accidentTimeHrs = $scope.logIncidentDetails.timeHrsOfIncident.toString().length > 1 ? $scope.logIncidentDetails.timeHrsOfIncident : '0' + $scope.logIncidentDetails.timeHrsOfIncident;

                    $scope.accidentDetails.accidentTimeMin = $scope.logIncidentDetails.timeMinOfIncident.toString().length > 1 ? $scope.logIncidentDetails.timeMinOfIncident : '0' + $scope.logIncidentDetails.timeMinOfIncident;

                }
            }


        }

        $scope.initializeCrimeTime = function () {
            if ($scope.crimeDetails.date || $scope.crimeDetails.timeHrs || $scope.crimeDetails.timeMin) { return; }
            else {
                $scope.crimeDetails.date = $scope.logIncidentDetails.dateIncident;
                if ($scope.logIncidentDetails.timeHrsOfIncident && $scope.logIncidentDetails.timeMinOfIncident) {
                    $scope.crimeDetails.timeHrs = $scope.logIncidentDetails.timeHrsOfIncident.toString().length > 1 ? $scope.logIncidentDetails.timeHrsOfIncident : '0' + $scope.logIncidentDetails.timeHrsOfIncident;
                    $scope.crimeDetails.timeMin = $scope.logIncidentDetails.timeMinOfIncident.toString().length > 1 ? $scope.logIncidentDetails.timeMinOfIncident : '0' + $scope.logIncidentDetails.timeMinOfIncident;
                }
            }


        }

        $scope.getDayClass = function (data) {
            var date = data.date,
                mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        }

        $scope.inlineOptions = {
            customClass: $scope.getDayClass,
            showWeeks: true
        };

        $scope.dateOptions = {
            // dateDisabled: disabled,
            maxDate: new Date(),
            formatYear: 'yyyy',
            startingDay: 1,
            endDate: new Date()
        };

        $scope.submitForm = function (formName, dir, $event) {
            var index = 0;
            //$scope.tabs[$scope.tab - 1].completed = true;

            $scope.tabs.filter(function (val, ind) {

                if (val.tab == $scope.activeTab.tab && dir != "back") {
                    val.completed = true;
                }
                if (val.name == formName) {
                    index = ind;
                }
            });
            $scope.tabs.sort(function (a, b) {
                return a.tab - b.tab;
            })

            if (dir == "back") {
                $scope.tabs[index].active = false;
                $scope.tabs[index - 1].active = true;
                //$scope.tab = $scope.tabs[index - 1].tab;
                $scope.activeTab = $scope.tabs[index - 1];
                //$scope.getData();
                if (!$scope.incidentSummary) {
                    $scope.getincidentSummary();
                }

            } else {
                if ($scope.activeTab.formAction == "saveContinue" || dir == "next") {

                    $scope.tabs[index].active = false;
                    $scope.tabs[index + 1].active = true;
                    //$scope.tab = $scope.tabs[index + 1].tab;
                    $scope.activeTab = $scope.tabs[index + 1];
                }
            }


            if (dir != "back" && dir != "next" || typeof dir == 'undefined') {
                if (formName == 'logIncidentForm') {
                    $scope.logIncident();
                }

                if (formName == "incidentDetailsForm") {
                    // $scope.addIncidentDetails();
                }
                if (formName == "accidentForm") {
                    //$scope.addAccidentDetails();
                }
                if (formName == "assetsForm") {
                    //$scope.addAssetDetails();
                }
                if (formName == "crimeForm") {

                    // $scope.addCrimeDetails();
                }
                if (formName == "claimForm") {
                    $scope.addClaimDetails();
                }
                if (formName == "investigationForm") {
                    $scope.addInvestigationDetails();
                }
                if (formName == "supportingDocumentsForm") {
                    $scope.addSupportingDocuments();
                }
            }

            $(".content")[0].scrollTop = 0;
            if ($scope.activeTab.tab == 3) {
                $scope.initializeAccidentPlaceAndTime();
            }
            // if($scope.activeTab.tab ==4){
            //     $scope.searchLimit = $scope.searchLimits || 25;
            // }
            if ($scope.activeTab.tab == 5) {
                $scope.initializeCrimeTime();
            }
            if ($scope.activeTab.tab == 9) {
                $scope.getincidentSummary();
            }

        }


        $scope.addSuspect = function () {
            //  $scope.incidentDetails.newSuspects.push($scope.suspect);
            // $scope.suspects.push($scope.suspect);
            if (!$scope.incident.incidentId) {
                return;
            }
            let suspect = rmsService.cloneObject($scope.suspect);
            suspect.distinguishingFeatureDetails = $scope.suspect.distinguishingFeatures;

            var req = {
                url: rmsService.baseEndpointUrl + 'incident/add-suspect/uniqueIncidentId/' + $scope.incident.uniqueIncidentId,
                method: "PUT",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
                data: suspect
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.getSuspectData();
                rmsService.showAlert(true, 'Suspect Added successfully.');
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })
            //reinitialize the suspect so that new can be added
            $scope.suspect = {
                addresses: [{
                    "id": null,
                    "statusFlag": "ACTIVE"
                }]
            }
        }
        $scope.getSuspectData = function () {
            var req = {
                url: rmsService.baseEndpointUrl + 'suspect/suspect-table/uniqueIncidentId/' + $scope.incident.uniqueIncidentId,
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },

            }
            AppService.ShowLoader();

            $http(req).then(function (response) {

                $scope.suspects = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }
        //Delete suspect data
        $scope.deleteSuspect = function (person) {
            if (!confirm("Are you sure you wnat to delete this item/record")) {
                return;
            }
            if (person.suspectCategory == 'NON-EMPLOYEE') {

                var req = {
                    url: rmsService.baseEndpointUrl + 'incident/remove-suspect/uniqueIncidentId/' + $scope.incident.uniqueIncidentId + '/suspectId/' + person.id,
                    method: "DELETE",
                    headers: {
                        'X-AUTH-TOKEN': $scope.token
                    },

                }
                AppService.ShowLoader();

                $http(req).then(function (response) {
                    $scope.getSuspectData();

                    AppService.HideLoader();
                    rmsService.showAlert(true, 'Suspect removed successfully.');
                }, function (error) {
                    AppService.HideLoader();
                    rmsService.showAlert(false, error);
                })
            }
            else {
                var req = {
                    url: rmsService.baseEndpointUrl + 'incident/remove-employee-suspect/uniqueIncidentId/' + $scope.incident.uniqueIncidentId + '/employeeId/' + person.id,
                    method: "DELETE",
                    headers: {
                        'X-AUTH-TOKEN': $scope.token
                    },

                }
                AppService.ShowLoader();

                $http(req).then(function (response) {
                    $scope.getSuspectData();

                    AppService.HideLoader();
                    rmsService.showAlert(true, 'Suspect removed successfully.');
                }, function (error) {
                    AppService.HideLoader();
                    rmsService.showAlert(false, error);
                })
            }


            // $scope.suspects.map(function(val, index) {

            //     if (val.id == person.id) {
            //         $scope.suspects.splice(index, 1);

            //     }
            // })
            // person.selected = false;

        }
        $scope.loadSuspect = function (person) {
            $scope.editsuspect = true;
            $scope.suspect = rmsService.cloneObject(person);
            $scope.suspect.distinguishingFeaturesOptions = rmsService.cloneObject($scope.suspect.distinguishingFeatureDetails);
            $scope.suspect.distinguishingFeatures = rmsService.cloneObject($scope.suspect.distinguishingFeatureDetails);
            $scope.suspect.distinguishingFeature = [];
            $scope.suspect.distinguishingFeature.push($scope.distinguishFeatures[0]);
            $scope.getDistinguishFeaturesDetails([$scope.distinguishFeatures[0]]);
        }
        //update existing suspect record
        $scope.updateSuspect = function (person) {

            $scope.editsuspect = false;
            person.distinguishingFeatureDetails = rmsService.cloneObject(person.distinguishingFeatures);
            var req = {
                url: rmsService.baseEndpointUrl + 'suspect/update-suspect/',
                method: "PUT",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
                data: $scope.suspect
            }

            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.getSuspectData();
                $scope.suspect.distinguishingFeatures = $scope.suspect.distinguishFeaturesDetails;
                AppService.HideLoader();
                rmsService.showAlert(true, 'Sucpect updated successfully.');
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            });

            $scope.suspect = {
                addresses: [{
                    "id": null,
                    "statusFlag": "ACTIVE"
                }]
            }
        }
        $scope.addEmployeeSuspect = function (person) {
            if (person.selected) {
                var req = {
                    url: rmsService.baseEndpointUrl + 'incident/add-employee-suspect/uniqueIncidentId/' + $scope.incident.uniqueIncidentId + '/employeeId/' + person.id,
                    method: "PUT",
                    headers: {
                        'X-AUTH-TOKEN': $scope.token
                    },
                    data: $scope.suspect
                }
                AppService.ShowLoader();

                $http(req).then(function (response) {
                    $scope.getSuspectData();

                    AppService.HideLoader();
                    rmsService.showAlert(true, 'Suspect added successfully');
                }, function (error) {
                    AppService.HideLoader();
                    rmsService.showAlert(false, error);
                })
                // $scope.incidentDetails.employeeSuspects.push({ 'loginId': person.id });
                // $scope.suspects.push(person);

            } else {

                var req = {
                    url: rmsService.baseEndpointUrl + 'incident/remove-employee-suspect//uniqueIncidentId/' + $scope.incident.uniqueIncidentId + '/employeeId/' + person.id,
                    method: "DELETE",
                    headers: {
                        'X-AUTH-TOKEN': $scope.token
                    },

                }
                AppService.ShowLoader();

                $http(req).then(function (response) {
                    $scope.getSuspectData();

                    AppService.HideLoader();
                    rmsService.showAlert(trur, 'Suspect removed successfully.');
                }, function (error) {
                    AppService.HideLoader();
                    rmsService.showAlert(false, error);
                })
                // $scope.incidentDetails.employeeSuspects.map(function(val, index) {

                //     if (val.id == person.id) {
                //         $scope.incidentDetails.employeeSuspects.splice(index, 1);

                //     }
                // })
                // $scope.suspects.map(function(val, index) {

                //     if (val.id == person.id) {
                //         $scope.suspects.splice(index, 1);

                //     }
                // })
            }
        }

        $scope.addExistingSuspect = function (person) {
            if (person.selected) {
                var req = {
                    url: rmsService.baseEndpointUrl + 'incident/add-existing-suspect/uniqueIncidentId/' + $scope.incident.uniqueIncidentId + '/suspectId/' + person.id,
                    method: "PUT",
                    headers: {
                        'X-AUTH-TOKEN': $scope.token
                    },
                    data: $scope.suspect
                }
                AppService.ShowLoader();

                $http(req).then(function (response) {
                    $scope.getSuspectData();

                    AppService.HideLoader();
                    rmsService.showAlert(true, 'Suspect added successfully');
                }, function (error) {
                    AppService.HideLoader();
                    rmsService.showAlert(false, error);
                })


                // $scope.incidentDetails.existingSuspects.push({ 'id': person.id });
                // $scope.suspects.push(person);

            } else {

                var req = {
                    url: rmsService.baseEndpointUrl + 'incident/remove-suspect/uniqueIncidentId/' + $scope.incident.uniqueIncidentId + '/suspectId/' + person.id,
                    method: "DELETE",
                    headers: {
                        'X-AUTH-TOKEN': $scope.token
                    },

                }
                AppService.ShowLoader();

                $http(req).then(function (response) {
                    $scope.getSuspectData();

                    AppService.HideLoader();
                    rmsService.showAlert(trur, 'Suspect removed successfully.');
                }, function (error) {
                    AppService.HideLoader();
                    rmsService.showAlert(false, error);
                })
                // $scope.incidentDetails.existingSuspects.map(function(val, index) {
                //     // push({'id':person.id});
                //     if (val.id == person.id) {
                //         $scope.incidentDetails.existingSuspects.splice(index, 1);
                //     }
                // })

                // $scope.suspects.map(function(val, index) {

                //     if (val.id == person.id) {
                //         $scope.suspects.splice(index, 1);

                //     }
                // })
            }
        }

        $scope.addLoss = function () {
            if (!$scope.incident.incidentId) {
                return;
            }
            $scope.loss.incident = {
                id: $scope.incident.incidentId
            }
            let loss = rmsService.cloneObject($scope.loss);
            //$scope.loss.timeHrsContacted;
            //$scope.loss.timeMinContacted;
            var date = rmsService.formatDate(loss.date);
            if (date != null) {
                loss.dateTimeContacted = date + " " + (loss.timeHrsContacted || '00') + ":" + (loss.timeMinContacted || '00') + ":00";
            }
            else {
                loss.timeHrsContacted = ((new Date()).getHours()).toString().length == 2 ? (new Date()).getHours() : '0' + (new Date()).getHours();
                loss.timeMinContacted = ((new Date()).getMinutes()).toString().length == 2 ? (new Date()).getMinutes() : '0' + (new Date()).getMinutes();
                loss.dateTimeContacted = rmsService.formatDate(new Date()) + ' ' + loss.timeHrsContacted + ':' + loss.timeMinContacted + ':00';
            }


            var req = {
                url: rmsService.baseEndpointUrl + 'reported-loss/create-reported-loss',
                method: "POST",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
                data: loss
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.getLossData();

                AppService.HideLoader();
                rmsService.showAlert(true, 'Loss added successfully.');
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })



            //$scope.incidentDetails.reportedLosses.push($scope.loss);
            //reinitialize the loss so that new can be added
            $scope.loss = {
                "id": null,
                "incident": {},
                "statusFlag": "ACTIVE",
                "date": null,
                "timeHrsContacted": null,
                "timeMinContacted": null

            }
        }

        $scope.getLossData = function () {
            var req = {
                url: rmsService.baseEndpointUrl + 'reported-loss/reported-loss-table/incidentId/' + $scope.incident.incidentId,
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.incidentDetails.reportedLosses = response.data;
                $scope.incidentDetails.reportedLosses.map((loss) => {
                    loss = $scope.lossDateFormat(loss);
                });
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }
        $scope.lossDateFormat = function (loss) {
            if (loss.dateTimeContacted == null) return;
            let splitDate = loss.dateTimeContacted.split(" ");
            loss.date = splitDate[0];
            let time = splitDate[1].split(":");
            loss.timeHrsContacted = time[0];
            loss.timeMinContacted = time[1];
            return loss;
        }
        $scope.loadLoss = function (loss) {
            $scope.editLoss = true;
            $scope.loss = rmsService.cloneObject(loss);
            if (loss.dateTimeContacted != null && loss.dateTimeContacted != undefined) {
                $scope.loss.date = new Date(rmsService.formatDate(loss.dateTimeContacted.split(" ")[0]));
                let time = loss.dateTimeContacted.split(" ")[1].split(":");
                $scope.loss.timeHrsContacted = time[0] || "00",
                    $scope.loss.timeMinContacted = time[1] || "00";
            }


        }
        //delete loss data from table
        $scope.deleteLoss = function (loss) {
            if (!confirm("Are you sure you wnat to delete this item/record")) {
                return;
            }
            var req = {
                url: rmsService.baseEndpointUrl + 'reported-loss/delete-reported-loss/reportedLossId/' + loss.id,
                method: "DELETE",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },

            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.getLossData();

                AppService.HideLoader();
                rmsService.showAlert(true, 'Loss deleted successfully.');
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })



        }


        $scope.updateLoss = function () {
            $scope.editLoss = false;
            let loss = rmsService.cloneObject($scope.loss);
            //$scope.loss.timeHrsContacted;
            //$scope.loss.timeMinContacted;
            var date = rmsService.formatDate(loss.date);
            if (date != null) {
                loss.dateTimeContacted = date + " " + (loss.timeHrsContacted || '00') + ":" + (loss.timeMinContacted || '00') + ":00";
            }
            else {
                loss.dateTimeContacted = date;
            }
            //loss.dateTimeContacted =  rmsService.formatDate(loss.date) + " " + (loss.timeHrsContacted||'00') + ":" + (loss.timeMinContacted||'00') +":00";
            var req = {
                url: rmsService.baseEndpointUrl + 'reported-loss/update-reported-loss',
                method: "PUT",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
                data: loss
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.getLossData();

                AppService.HideLoader();
                rmsService.showAlert(true, 'Loss updated successfully.');
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })

            //$scope.incidentDetails.reportedLosses.push($scope.loss);
            //reinitialize the loss so that new can be added
            $scope.loss = {
                "id": null,
                "incident": {},
                "statusFlag": "ACTIVE",
                "date": null,
                "timeHrsContacted": null,
                "timeMinContacted": null
            }

        }
        $scope.addAccident = function () {

            let accident = rmsService.cloneObject($scope.accidentDetails);
            var date = rmsService.formatDate(accident.accidentDate);
            if (date != null) {
                accident.accidentDateTime = date + " " + (accident.accidentTimeHrs || '00') + ":" + (accident.accidentTimeMin || '00') + ":00";
            }
            else {
                accident.accidentDateTime = date;
            }

            //  accident.accidentDateTime = rmsService.formatDate(accident.accidentDate) + " " + (accident.accidentTimeHrs || '00') + ":" + (accident.accidentTimeMin ||'00') +":00";
            accident.incident = {
                id: $scope.incident.incidentId,
                uniqueIncidentId: $scope.incident.uniqueIncidentId
            }

            var req = {
                url: rmsService.baseEndpointUrl + 'accident/add-or-update-accident',
                method: "POST",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
                data: accident
            }
            AppService.ShowLoader();
            $http(req).then(function (response) {
                AppService.HideLoader();
                $scope.accAdded = true;
                $scope.accidentDetails.id = response.data.id;
                rmsService.showAlert(true, 'Accident added successfully.');
            }, function (error) {
                //alert(error);
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })

        }
        $scope.addClaimDetails = function () {
            if ($scope.claimDetail.incident == null) {
                $scope.claimDetail.incident = {};
            }
            $scope.claimDetail.incident.id = $scope.incident.incidentId;
            $scope.claimDetail.incident.uniqueIncidentId = $scope.incident.uniqueIncidentId;
            let claim = rmsService.cloneObject($scope.claimDetail);
            for (let key in claim) {
                if (key.toLowerCase().indexOf('date') > -1 && key != 'lastUpdated' && key != 'lastUpdatedBy') {
                    claim[key] = rmsService.formatDate(claim[key]);
                }
            }
            var req = {
                url: rmsService.baseEndpointUrl + 'claim/add-or-update-claim',
                method: "POST",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
                data: claim
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                AppService.HideLoader();
                $scope.claimDetail.id = response.data.id;
                $scope.claimRefId = response.data.claimId;
                rmsService.showAlert(true, 'Claim added successfully.');
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);

            })

        }
        $scope.DeleteClaim = function () {
            if (!confirm("Are you sure you wnat to delete this item/record")) {
                return;
            }
            var req = {
                url: rmsService.baseEndpointUrl + 'claim/delete-claim/claimId/' + $scope.claimDetail.id,
                method: "DELETE",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
                data: $scope.claimDetail
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                AppService.HideLoader();
                $scope.claimDetail = {};
                rmsService.showAlert(true, 'Claim deleted successfully.');
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
                //alert(error);
            })
        }
        $scope.getClaimHandler = function () {

            var req = {
                url: rmsService.baseEndpointUrl + 'claim-handler-lookup',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },

            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                AppService.HideLoader();
                $scope.claimHandlerList = response.data;
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error.data.errorMessages[0]);

            })
        }

        $scope.assignClaimHandler = function (person) {
            if (!$scope.claimDetail.claimHandler) {
                $scope.claimDetail.claimHandler = {};
            }
            $scope.claimDetail.claimHandler.id = person.id;
            $scope.claimDetail.claimHandler.loginId = person.loginId;
            $scope.claimDetail.claimHandler.username = person.username;
            $scope.claimHandler = person.firstName + " " + person.lastName;
        }
        $scope.getInvestigationHandler = function () {
            var req = {
                url: rmsService.baseEndpointUrl + 'investigator-lookup',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },

            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                AppService.HideLoader();
                $scope.investigationHandlerList = response.data;
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error.data.errorMessages[0]);

            })
        }

        $scope.assignInvestigationHandler = function (person) {
            if ($scope.investigationDetails.investigator === null) {
                $scope.investigationDetails.investigator = {
                    "id": null,
                    "loginId": null,
                    "username": null
                }
            }
            $scope.investigationDetails.investigator.id = person.id;
            $scope.investigationDetails.investigator.loginId = person.loginId;
            $scope.investigationDetails.investigator.username = person.username;
            // $scope.investigatorTeamName = person.teamDescription;
            // $scope.investigatorTeamId = person.teamLeadLoginId;
            $scope.invstigatorFirstName = person.firstName;
            $scope.invstigatorMiddleName = person.middleName;
            $scope.invstigatorLastName = person.lastName;

            //$scope.investigationHandler = person.firstName + " " + person.lastName;
        }

        $scope.selectSupportingDocumnet = function (doc, $event) {
            if (!$scope.supportingDocumentsFormData) {
                $scope.supportingDocumentsFormData = new FormData();
            }
            //$scope.supportingDocumentsFormData.append("uniqueIncidentId",$scope.incident.uniqueIncidentId);
            //let fileName = $event.target.files[0].name;
            $scope.supportingDocumentsFormData.append("file", $event.target.files[0]);
            $scope.supportingDocumentsFormData.append("fileDescription", doc.description);
        }

        $scope.addSupportingDocuments = function () {
            if (typeof $scope.supportingDocumentsFormData === 'undefined') {
                return;
            }
            $scope.supportingDocumentsFormData.append("uniqueIncidentId", $scope.incident.uniqueIncidentId);
            var req = {
                url: rmsService.baseEndpointUrl + 'document/save-documents',
                method: "POST",
                headers: {
                    'X-AUTH-TOKEN': $scope.token,
                    'Content-Type': undefined
                },
                data: $scope.supportingDocumentsFormData
            }
            AppService.ShowLoader();
            $http(req).then(function (response) {
                AppService.HideLoader();
                $scope.incident.supportingDocuments = response.data;
                rmsService.showAlert(true, 'Documnet added successfully.');
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })
        }

        $scope.getUserInfo = function () {
            var req = {
                url: rmsService.baseEndpointUrl + 'incident/add-incident',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.userInfo = response.data;
                AppService.HideLoader();
                //rmsService.showAlert(true,"Incident created successfully.");
            }, function (error) {
                AppService.HideLoader();
                //rmsService.showAlert(false,"Error occured while creating incident.");
            })
        }


        $scope.logIncident = function () {
            let logIncidentDetails = rmsService.cloneObject($scope.logIncidentDetails);
            var date = rmsService.formatDate(logIncidentDetails.dateIncident);
            if (date != null) {
                logIncidentDetails.incidentOpenedDateTime = date + " " + (logIncidentDetails.timeHrsOfIncident || '00') + ":" + (logIncidentDetails.timeMinOfIncident || '00') + ":00";
            }
            else {
                logIncidentDetails.incidentOpenedDateTime = date;
            }
            //logIncidentDetails.dateOfIncident = rmsService.formatDate(logIncidentDetails.date) + " " + (logIncidentDetails.timeHrsOfIncident||'00') + ":" + (logIncidentDetails.timeMinOfIncident ||'00')+":00";
            logIncidentDetails.accidentDamage ? logIncidentDetails.accidentDamage = "Y" : logIncidentDetails.accidentDamage = "N";
            logIncidentDetails.assetDamage ? logIncidentDetails.assetDamage = "Y" : logIncidentDetails.assetDamage = "N";
            logIncidentDetails.criminalAttack ? logIncidentDetails.criminalAttack = "Y" : logIncidentDetails.criminalAttack = "N";
            if ($scope.editIncidentMode == true) {

            }
            else {
                $scope.incident.incidentStatus = 'DRAFT';
            }
            delete logIncidentDetails.date;
            delete logIncidentDetails.dateIncident;
            var req = {
                url: rmsService.baseEndpointUrl + 'incident/add-or-update-log-incident',
                method: "POST",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
                data: logIncidentDetails
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                //$scope.incidentSecond = response.data;
                $scope.logIncidentDetails.incidentId = response.data.id;
                $scope.incident.incidentStatus = response.data.incidentStatus;
                $scope.incident.incidentId = response.data.id;
                $scope.incident.uniqueIncidentId = response.data.uniqueIncidentId;
                AppService.HideLoader();
                rmsService.showAlert(true, "Incident logged successfully");
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })
        }


        $scope.openBodyPartModal = function () {

            $("#bodyModal").modal('show');
            setTimeout(function () {
                $(".dropdown-toggle").trigger('click').trigger('click');
            }, 100)
            // $("#bodyModal").on('show.bs.modal', function (e) {


            // });

            //toggleDropdown();
        }

        $scope.removeFeatureToSelectedList = function (context) {

            context.distinguishingFeatures.map((item, index) => {
                context.distinguishingFeaturesOptions.splice(context.distinguishingFeaturesOptions.indexOf(item), 1);
                if (item.parentId == context.distinguishingFeature[0].id) {
                    $scope.distinguishFeaturesDetails.push(rmsService.cloneObject(item));
                }
                if (context.distinguishingFeatureDetails[0].id == item.id) {
                    context.distinguishingFeatures.splice(index, 1);
                }
            });

            context.distinguishingFeaturesOptions = rmsService.cloneObject(context.distinguishingFeatures);
            $scope.distinguishFeaturesDetails.sort((a, b) => {
                if (a.description < b.description)
                    return -1;
                if (a.description > b.description)
                    return 1;
                return 0;
            });
        }
        $scope.addFeatureToSelectedList = function (context) {
            if (context.distinguishingFeatureDetail) {
                //shal delete context.distinguishingFeaturesOptions && distinguishingFeatureDetail distinguishingFeature properties when sending request to backend
                if (!context.distinguishingFeaturesOptions) {
                    context.distinguishingFeaturesOptions = [];
                    context.distinguishingFeatures = [];
                }
                context.distinguishingFeatureDetail.map(item => {
                    if (context.distinguishingFeaturesOptions.indexOf(item) == -1) {
                        context.distinguishingFeaturesOptions.push(rmsService.cloneObject(item));
                        context.distinguishingFeatures = rmsService.cloneObject(context.distinguishingFeaturesOptions);
                    }
                });
                context.distinguishingFeatures.map((item, index) => {
                    $scope.distinguishFeaturesDetails.map((element, index) => {
                        if (item.id == element.id)
                            $scope.distinguishFeaturesDetails.splice(index, 1);
                    });
                    //$scope.distinguishFeaturesDetails.splice( $scope.distinguishFeaturesDetails.indexOf(item),1)
                })

            }
        }

        $scope.openMap = function () {
            $("#mapModal").modal('show');
            $('#mapModal').on('shown.bs.modal', function () {
                $scope.map = true;
                $scope.$apply();
            })
        }

        $scope.getSuspectType = function () {
            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance/suspect-type/suspect-types',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token

                },
            }
            AppService.ShowLoader();
            var getIncident = $http(req);
            getIncident.then(function (response) {
                $scope.suspectType = response.data;
                console.log($scope.suspectType);
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();

            })
        }


        $scope.getIncidentType = function () {
            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance/incident-type/incident-types',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token

                },
            }
            AppService.ShowLoader();
            $http(req).then(function (response) {
                $scope.incidentType = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }

        $scope.getIncidentLoc = function () {
            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance/incident-location/incident-locations',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token

                },
            }
            AppService.ShowLoader();
            $http(req).then(function (response) {
                $scope.incidentLocations = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }
        $scope.getIncidentLocDetail = function () {
            if (!$scope.logIncidentDetails || !$scope.logIncidentDetails.incidentLocation) {
                return;
            }
            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance/incident-location-detail/incident-location/'
                    + $scope.logIncidentDetails.incidentLocation.id,
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token

                },
            }
            AppService.ShowLoader();
            $http(req).then(function (response) {
                $scope.incidentLocationDetails = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }


        $scope.getEntrypoint = function () {
            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance/entry-point/entry-points',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.entryPoint = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }

        $scope.getDistinguishFeatures = function () {

            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance/distinguishing-feature/distinguishing-features',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
            }
            AppService.ShowLoader();
            $http(req).then(function (response) {
                //change the options as required by the multiselect plugin/module
                $scope.distinguishFeatures = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }


        $scope.getDistinguishFeaturesDetails = function (feature) {
            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance/distinguishing-feature-detail/distinguishing-feature/' + feature[0].id,
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
            }
            AppService.ShowLoader();
            $http(req).then(function (response) {
                //change the options as required by the multiselect plugin/module
                $scope.distinguishFeaturesDetails = response.data;
                $scope.distinguishFeaturesDetails.map((item) => {
                    item.parentId = feature[0].id;
                })
                $scope.distinguishFeaturesDetailsOptions = $scope.distinguishFeaturesDetails;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }

        $scope.getAgency = function () {

            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance/external-agency/external-agencies',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.agencies = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }
        $scope.getAccidentLoc = function () {
            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance/accident-location/accident-locations',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token

                },
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.accidentLoc = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }
        $scope.getAccLocDetail = function () {
            if (!$scope.accidentDetails.accidentLocation) {
                return;
            }
            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance//accident-location-detail/accident-location/'
                    + $scope.accidentDetails.accidentLocation.id,
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token

                },
            }
            AppService.ShowLoader();
            $http(req).then(function (response) {
                $scope.incidentLocationDetails = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }
        $scope.getAccidentType = function () {
            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance/accident-type/accident-types',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.accidentType = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }
        $scope.getAssetCategory = function () {
            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance/asset-category/asset-categories',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.assetCat = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }
        var bodyPart = [];
        $scope.getBodyPart = function () {
            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance/body-part/body-parts',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token

                },
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                bodyPart = response.data;
                var storeDesc = [];
                var bodyPartsFrontArray = [];
                var bodyPartsBackArray = [];
                response.data.map(function (d) {
                    storeDesc.push(d.description);
                    if (d.bodyPartFrontOrBack == 'BACK') {
                        bodyPartsBackArray.push(d.description);
                    }
                    else {
                        bodyPartsFrontArray.push(d.description);
                    }
                });
                $scope.bodyPartsArray = storeDesc;
                $scope.bodyPartsFrontArray = bodyPartsFrontArray;
                $scope.bodyPartsBackArray = bodyPartsBackArray;
                AppService.HideLoader();
                // $scope.bodyPartsFrontArray = ["Chest", "Chin", "Face", "Hair", "Head", 
                //  "Left Ankle", "Left Arm", "Left Ear", "Left Elbow","Left Eye",
                //  "Left Fingers", "Left Foot", "Left Forearm", "Left Hand", "Left Heel",
                //  "Left Knee", "Left Leg", "Left Palm", "Left Shoulder", 
                //  "Left Shoulder Blade", "Left Thigh", "Left Toe", "Left Wrist", "Loin",
                //  "Nose", "Right Ankle", "Right Arm", "Right Ear", "Right Elbow", "Right Eye",
                //  "Right Fingers", "Right foot", "Right Forearm", "Right Hand", "Right Heel",
                //  "Right Knee", "Right Leg", "Right Palm", "Right Shoulder", "Right Shoulder Blade",
                //  "Right Thigh", "Right Toe", "Right Wrist", "Stomach", "Waist"
                //   ];
                // $scope.bodyPartsBackArray  =["Back" , "Buttock", "Nape","Neck", "Right Calf",
                // "Left Calf","Left Hip","Right Hip",""];

            }, function (error) {
                AppService.HideLoader();
            })
        }
        $scope.getClaimRegType = function () {
            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance/claim-request-registration-type/claim-request-registration-types',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token

                },
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.claimReg = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }
        $scope.getClaimStatus = function () {
            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance/claim-status/claim-statuses',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token

                },
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.claimStatus = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }
        $scope.getClaimType = function () {
            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance/claim-type/claim-types',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token

                },
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.claimType = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }
        $scope.getDepartment = function () {
            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance/department/departments',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.depType = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }
        $scope.getDocCategory = function () {
            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance/document-category/document-categories',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token

                },
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.docCategory = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }
        $scope.getDocType = function () {
            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance/document-type/document-types',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token

                },
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.docType = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }

        $scope.getEmpType = function () {
            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance/employee-type/employee-types',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token

                },
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.empType = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }

        $scope.getEventType = function () {
            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance/event-type/event-types',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token

                },
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.eventType = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }

        $scope.getGenderType = function () {
            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance/gender-type/gender-types',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token

                },
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.genderType = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }

        $scope.getInjuredPersonType = function () {
            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance/injured-person-type/injured-person-types',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token

                },
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.injuredPersonTypes = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }

        $scope.getInjuryCause = function () {
            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance/injury-cause/injury-causes',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
            }
            AppService.ShowLoader();
            $http(req).then(function (response) {
                $scope.injuryCauses = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }

        $scope.getInjuryType = function () {
            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance/injury-type/injury-types',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.injuryTypes = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }
        $scope.getInjuryTypeDetail = function () {
            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance/injury-type-detail/injury-type/'
                    + $scope.injuredPerson.injuryType.id,
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.injuryTypeDetails = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }
        $scope.getInjuryTypeDetailSpec = function () {
            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance/injury-type-detail-spec/injury-type-detail/' +
                    $scope.injuredPerson.injuryTypeDetail.id,
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.injuryTypeDetailSpecs = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }

        $scope.getLossType = function () {
            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance/loss-type/loss-types',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token

                },
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.lossType = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }

        $scope.getOrg = function () {
            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance/organization/organizations',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.organization = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }

        $scope.getPolicyType = function () {
            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance/policy-type/policy-types',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.policyType = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }

        $scope.getPos = function () {
            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance/position/positions',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.position = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }

        $scope.getPosLevel = function () {
            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance/position-level/position-levels',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.positionLevel = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }

        $scope.getVehicleDamageType = function () {
            $scope.vehDamageTypedesc = []
            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance/vehicle-damage-type/vehicle-damage-types',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.vehDamageType = response.data;
                response.data.map(function (d) {
                    $scope.vehDamageTypedesc.push(d.description);
                })
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }
        $scope.storeVehDamageType = function () {
            $scope.vehicleDamageType.temp.map(function (d) {
                $scope.vehDamageType.map(function (v) {
                    if (v.description == d) {
                        $scope.vehicle.vehicleDamageTypes.push({
                            "id": v.id

                        });
                    }
                })
            })
        }

        $scope.getWeaponType = function () {
            var req = {
                url: rmsService.baseEndpointUrl + 'table-maintenance/weapon-type/weapon-types',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.weaponType = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }


        $scope.addIncidentDetails = function () {

            $scope.incidentDetails.incidentId = $scope.incident.incidentId;
            $scope.incidentDetails.uniqueIncidentId = $scope.incident.uniqueIncidentId;
            var req = {
                url: rmsService.baseEndpointUrl + 'incident/add-incident-details',
                method: "POST",
                headers: {
                    'X-AUTH-TOKEN': $scope.token

                },
                data: $scope.incidentDetails
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                AppService.HideLoader();
                rmsService.showAlert(true, "Incident details added successfully");
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })
        }

        $scope.addCrimeDetails = function () {
            let crimeDetails = rmsService.cloneObject($scope.crimeDetails);
            if (crimeDetails.date == undefined) {
                crimeDetails.crimeDateTime = null
            } else {
                crimeDetails.crimeDateTime = rmsService.formatDate(crimeDetails.date) + " " + (crimeDetails.timeHrs || '00') + ":" + (crimeDetails.timeMin || '00') + ":00";
            }
            if (crimeDetails.incident == null) {
                crimeDetails.incident = {};
            }
            crimeDetails.incident.id = $scope.incident.incidentId;
            crimeDetails.uniqueIncidentId = $scope.incident.uniqueIncidentId;


            var req = {
                url: rmsService.baseEndpointUrl + 'crime/add-or-update-crime',
                method: "POST",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
                data: crimeDetails
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                //$scope.incidentSecond = response.data;
                AppService.HideLoader();
                $scope.crimeDetails.id = response.data.id;
                $scope.crimeAdded = true;
                rmsService.showAlert(true, "Crime details added successfully");
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);

            })
        }



        $scope.addInjuredPerson = function () {
            // $scope.accidentDetails.newInjuredPersons.push($scope.injuredPerson);
            // $scope.injuredPersons.push($scope.injuredPerson);
            //reset the object
            // $scope.injuredPerson = {
            //     addresses: [],
            //     bodyParts: [],
            // }

            // $scope.myObj = { temp: [] };


            $scope.injuredPerson.distinguishingFeatureDetails = $scope.injuredPerson.distinguishingFeatures;
            $scope.myObj.temp.map(function (d, index) {
                bodyPart.map(function (item, i) {
                    if (item.description == d) {
                        var part = {
                            id: item.id,
                            description: d
                        }
                        $scope.injuredPerson.bodyParts[index] = part;
                    }

                })

            })
            var req = {
                url: rmsService.baseEndpointUrl + 'accident/add-injured-person/accidentId/' + $scope.accidentDetails.id,
                method: "PUT",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
                data: $scope.injuredPerson
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.getInjuredData();
                AppService.HideLoader();
                rmsService.showAlert(true, "Injured person added successfully");
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);

            })
            //reinitialize the injured person so that new can be added
            $scope.injuredPerson = {
                addresses: [],
                bodyParts: [],
                distinguishingFeatureDetails: null,
                distinguishingFeature: null,

            }
            $scope.myObj = { temp: [] };
        }
        $scope.getPartsString = function (person) {
            return person.bodyParts.map(function (el) { return el.description }).join(",");
        }
        $scope.getInjuredData = function () {
            if (!$scope.accidentDetails.id) {
                return;
            }
            var req = {
                url: rmsService.baseEndpointUrl + 'injured-person/injured-person-table/accidentId/' + $scope.accidentDetails.id,
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.injuredPersons = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error.data.errorMessages[0]);
            })
        }


        $scope.addEmployeeInjured = function (person) {
            if (person.selected) {
                var req = {
                    url: rmsService.baseEndpointUrl +
                        'accident/add-employee-injured-person/accidentId/' +
                        $scope.accidentDetails.id + '/employeeId/' + person.id,
                    method: "PUT",
                    headers: {
                        'X-AUTH-TOKEN': $scope.token
                    },
                }
                AppService.ShowLoader();

                $http(req).then(function (response) {
                    $scope.getInjuredData();
                    AppService.HideLoader();
                    rmsService.showAlert(true, "Employee Injured person added successfully");
                }, function (error) {
                    AppService.HideLoader();
                    rmsService.showAlert(false, error);
                })

            } else {

                var req = {
                    url: rmsService.baseEndpointUrl +
                        'accident/remove-employee-injured-person/accidentId/' +
                        $scope.accidentDetails.id + '/employeeId/' + person.id,
                    method: "DELETE",
                    headers: {
                        'X-AUTH-TOKEN': $scope.token
                    },

                }
                AppService.ShowLoader();

                $http(req).then(function (response) {
                    $scope.getInjuredData();
                    rmsService.showAlert(true, "Employee injured person deleted successfully");
                    AppService.HideLoader();
                }, function (error) {
                    AppService.HideLoader();
                    rmsService.showAlert(false, error);
                })

            }
        }

        $scope.addExistingInjured = function (person) {
            if (person.selected) {
                var req = {
                    url: rmsService.baseEndpointUrl +
                        'accident/add-existing-injured-person/accidentId/' +
                        $scope.accidentDetails.id + '/injuredPersonId/' + person.id,
                    method: "PUT",
                    headers: {
                        'X-AUTH-TOKEN': $scope.token
                    },

                }
                AppService.ShowLoader();

                $http(req).then(function (response) {
                    $scope.getInjuredData();
                    AppService.HideLoader();
                    rmsService.showAlert(true, "Existing injured person added successfully");
                }, function (error) {
                    AppService.HideLoader();
                    rmsService.showAlert(false, error);
                })

            } else {

                var req = {
                    url: rmsService.baseEndpointUrl +
                        'accident/remove-injured-person/accidentId/' +
                        $scope.accidentDetails.id + '/injuredPersonId/' + person.id,
                    method: "DELETE",
                    headers: {
                        'X-AUTH-TOKEN': $scope.token
                    },

                }
                AppService.ShowLoader();

                $http(req).then(function (response) {
                    $scope.getInjuredData();
                    AppService.HideLoader();
                    rmsService.showAlert(true, "Existing injured person deleted successfully");
                }, function (error) {
                    AppService.HideLoader();
                    rmsService.showAlert(false, error);
                })

            }
        }
        //Delete Injured person data
        $scope.deleteInjured = function (person) {
            if (!confirm("Are you sure you wnat to delete this item/record")) {
                return;
            }
            var req = {
                url: rmsService.baseEndpointUrl +
                    'accident/remove-injured-person/accidentId/' +
                    $scope.accidentDetails.id + '/injuredPersonId/' + person.id,
                method: "DELETE",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },

            }
            AppService.ShowLoader();
            $http(req).then(function (response) {
                $scope.getInjuredData();
                AppService.HideLoader();
                rmsService.showAlert(true, 'Injured person deleted successfully.');
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })

        }
        $scope.loadInjured = function (person) {
            $scope.editInjured = true;
            $scope.injuredPerson = rmsService.cloneObject(person);
            $scope.injuredPerson.distinguishingFeaturesOptions = rmsService.cloneObject($scope.injuredPerson.distinguishingFeatureDetails);
            $scope.injuredPerson.distinguishingFeatures = rmsService.cloneObject($scope.injuredPerson.distinguishingFeatureDetails);
            $scope.injuredPerson.distinguishingFeature = [];
            $scope.injuredPerson.distinguishingFeature.push($scope.distinguishFeatures[0]);
            $scope.myObj = { temp: [] }
            person.bodyParts.map(function (part) {
                $scope.myObj.temp.push(part.description)
            })
            $scope.getDistinguishFeaturesDetails([$scope.distinguishFeatures[0]]);
            if (person.injuryType) $scope.getInjuryTypeDetail();
            if (person.injuryTypeDetail) $scope.getInjuryTypeDetailSpec();


        }
        //update existing injuredPerson record
        $scope.updateInjured = function (person) {

            $scope.editInjured = false;
            $scope.injuredPerson.bodyParts = [];
            $scope.myObj.temp.map(function (d, index) {
                bodyPart.map(function (item, i) {
                    if (item.description == d) {
                        var part = {
                            id: item.id,
                            description: d
                        }
                        $scope.injuredPerson.bodyParts[index] = part;
                    }

                })

            });

            var req = {
                url: rmsService.baseEndpointUrl +
                    'injured-person/update-injured-person',
                method: "PUT",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
                data: $scope.injuredPerson
            }

            AppService.ShowLoader();

            $http(req).then(function (response) {

                $scope.getInjuredData();
                // $scope.injuredPerson.distinguishingFeatures = $scope.injuredPerson.distinguishFeaturesDetails;
                $scope.injuredPerson = {
                    addresses: [],
                    bodyParts: [],
                    distinguishingFeatureDetails: null,
                    distinguishingFeature: null,

                }
                $scope.myObj = { temp: [] };
                AppService.HideLoader();
                rmsService.showAlert(true, "Injured person updated successfully");

            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })
        }
        //Witness 
        $scope.addWitness = function () {
            $scope.witness.distinguishingFeatureDetails = $scope.witness.distinguishingFeatures;

            var req = {
                url: rmsService.baseEndpointUrl +
                    'accident/add-witness/accidentId/'
                    + $scope.accidentDetails.id,
                method: "PUT",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
                data: $scope.witness
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.getWitnessData();

                AppService.HideLoader();
                rmsService.showAlert(true, 'Witness successfully added');
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })


            // $scope.accidentDetails.newWitnesses.push($scope.witness);
            // $scope.witnesses.push($scope.witness);
            //reset the object
            $scope.witness = {
                addresses: [],
                distinguishingFeatureDetails: null,
                distinguishingFeature: null
            }

        }
        $scope.getWitnessData = function () {
            if (!$scope.accidentDetails.id) {
                return;
            }
            var req = {
                url: rmsService.baseEndpointUrl +
                    'witness/witness-table/accidentId/' +
                    $scope.accidentDetails.id,
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },

            }
            AppService.ShowLoader();

            $http(req).then(function (response) {

                $scope.witnesses = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }
        $scope.addEmployeeWitness = function (person) {
            if (person.selected) {
                var req = {
                    url: rmsService.baseEndpointUrl +
                        'accident/add-employee-witness/accidentId/' +
                        $scope.accidentDetails.id + '/employeeId/' + person.id,
                    method: "PUT",
                    headers: {
                        'X-AUTH-TOKEN': $scope.token
                    },

                }
                AppService.ShowLoader();

                $http(req).then(function (response) {
                    $scope.getWitnessData();

                    AppService.HideLoader();
                    rmsService.showAlert(true, 'Witness added successfully.');
                }, function (error) {
                    AppService.HideLoader();
                    rmsService.showAlert(false, error);
                })

            } else {

                var req = {
                    url: rmsService.baseEndpointUrl +
                        'accident/remove-employee-witness/accidentId/' +
                        $scope.accidentDetails.id + '/employeeId/' + person.id,
                    method: "DELETE",
                    headers: {
                        'X-AUTH-TOKEN': $scope.token
                    },
                    data: $scope.suspect
                }
                AppService.ShowLoader();

                $http(req).then(function (response) {
                    $scope.getWitnessData();

                    AppService.HideLoader();
                    rmsService.showAlert(true, 'Witness removed successfully.');
                }, function (error) {
                    AppService.HideLoader();
                    rmsService.showAlert(false, error);
                })

            }
        }
        //delete witness
        $scope.deleteWitness = function (person) {
            if (!confirm("Are you sure you wnat to delete this item/record")) {
                return;
            }
            var req = {
                url: rmsService.baseEndpointUrl +
                    'accident/remove-witness/accidentId/' +
                    $scope.accidentDetails.id + '/witnessId/' + person.id,
                method: "DELETE",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },

            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.getWitnessData();

                AppService.HideLoader();
                rmsService.showAlert(true, 'Witness removed successfully.');
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })

        }
        $scope.loadWitness = function (person) {
            $scope.editWitness = true;
            $scope.witness = rmsService.cloneObject(person);
            $scope.witness.distinguishingFeaturesOptions = rmsService.cloneObject($scope.witness.distinguishingFeatureDetails);
            $scope.witness.distinguishingFeatures = rmsService.cloneObject($scope.witness.distinguishingFeatureDetails);
            $scope.witness.distinguishingFeature = [];
            $scope.witness.distinguishingFeature.push($scope.distinguishFeatures[0]);
            $scope.getDistinguishFeaturesDetails([$scope.distinguishFeatures[0]]);
        }
        $scope.updateWitness = function (person) {

            $scope.editWitness = false;
            var req = {
                url: rmsService.baseEndpointUrl +
                    'witness/update-witness/',
                method: "PUT",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
                data: $scope.witness
            }

            AppService.ShowLoader();

            $http(req).then(function (response) {

                $scope.getWitnessData();
                $scope.witness.distinguishingFeatures = $scope.witness.distinguishFeaturesDetails;
                AppService.HideLoader();
                rmsService.showAlert(true, 'Witness updated successfully.');
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })
        }


        $scope.addExistingWitness = function (person) {
            if (person.selected) {
                var req = {
                    url: rmsService.baseEndpointUrl +
                        'accident/add-existing-witness/accidentId/' +
                        $scope.accidentDetails.id + '/witnessId/' + person.id,
                    method: "PUT",
                    headers: {
                        'X-AUTH-TOKEN': $scope.token
                    },

                }
                AppService.ShowLoader();

                $http(req).then(function (response) {
                    $scope.getWitnessData();
                    $scope.witness.distinguishingFeatures = $scope.witness.distinguishFeaturesDetails;

                    AppService.HideLoader();
                    rmsService.showAlert(true, 'Witness added successfully');
                }, function (error) {
                    AppService.HideLoader();
                    rmsService.showAlert(false, error);
                })

            } else {

                var req = {
                    url: rmsService.baseEndpointUrl +
                        'accident/remove-witness/accidentId/' +
                        $scope.accidentDetails.id + '/witnessId/' + person.id,
                    method: "DELETE",
                    headers: {
                        'X-AUTH-TOKEN': $scope.token
                    },

                }
                AppService.ShowLoader();

                $http(req).then(function (response) {
                    $scope.getWitnessData();
                    $scope.witness.distinguishingFeatures = $scope.witness.distinguishFeaturesDetails;

                    AppService.HideLoader();
                    rmsService.showAlert(true, 'Witness removed successfully.');
                }, function (error) {
                    AppService.HideLoader();
                    rmsService.showAlert(false, error);
                })

            }
        }
        $scope.addAssetDetails = function () {
            if ($scope.assetDetail.incident) {
                $scope.assetDetail.incident.id = $scope.incident.incidentId
            } else {
                $scope.assetDetail.incident = {
                    id: $scope.incident.incidentId
                }
            }

            var req = {
                url: rmsService.baseEndpointUrl + 'asset/add-or-update-asset',
                method: "POST",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
                data: $scope.assetDetail
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.assetDetail.id = response.data.id;
                $scope.assetAdded = true;
                AppService.HideLoader();
                rmsService.showAlert(true, 'Asset added successfully');
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })
        }
        $scope.addBuilding = function () {
            var req = {
                url: rmsService.baseEndpointUrl +
                    'asset/add-building/assetId/'
                    + $scope.assetDetail.id,
                method: "PUT",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
                data: $scope.building
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.getBuilding();

                AppService.HideLoader();
                rmsService.showAlert(true, 'Building added successfully.');
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })



            $scope.building = {};

        }
        $scope.getBuilding = function () {
            var req = {
                url: rmsService.baseEndpointUrl +
                    'building/building-table/assetId/'
                    + $scope.assetDetail.id,
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },

            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.buildings = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error.data.errorMessages[0]);
            })
        }
        $scope.deleteBuilding = function (building) {
            if (!confirm("Are you sure you wnat to delete this item/record")) {
                return;
            }
            var req = {
                url: rmsService.baseEndpointUrl +
                    'asset/remove-building/assetId/' +
                    $scope.assetDetail.id + '/buildingId/' + building.id,
                method: "DELETE",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },

            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.getBuilding();

                AppService.HideLoader();
                rmsService.showAlert(true, 'Building deleted successfully.');
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })
        }
        $scope.loadBuilding = function (data) {
            $scope.editBuilding = true;
            $scope.building = data;

        }
        $scope.updateBuilding = function () {
            $scope.editBuilding = false;
            var req = {
                url: rmsService.baseEndpointUrl +
                    'building/update-building/',
                method: "PUT",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
                data: $scope.building
            }

            AppService.ShowLoader();

            $http(req).then(function (response) {

                $scope.getBuilding();
                AppService.HideLoader();
                rmsService.showAlert(true, 'Building successfully updated.');

            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            });

            $scope.building = {};


        }
        $scope.addVehicle = function () {
            $scope.storeVehDamageType();
            var req = {
                url: rmsService.baseEndpointUrl + 'asset/add-vehicle/assetId/' + $scope.assetDetail.id,
                method: "PUT",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
                data: $scope.vehicle
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.getVehicle();
                $scope.vehicle = {};
                $scope.vehicleDamageType.temp = [];

                AppService.HideLoader();
                rmsService.showAlert(true, 'Vehicle added successfully.');
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            });


        }
        $scope.loadVehicle = function (data) {
            $scope.vehicleDamageType.temp = [];
            $scope.editvehicle = true;
            $scope.vehicle = data;
            $scope.vehicle.vehicleDamageTypes.map(function (d) {
                $scope.vehicleDamageType.temp.push(d.description);
            })
        }
        $scope.getVehicle = function () {
            var req = {
                url: rmsService.baseEndpointUrl +
                    'vehicle/vehicle-table/assetId/'
                    + $scope.assetDetail.id,
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },

            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.vehicles = response.data;
                $scope.vehicle = {};
                $scope.vehicleDamageType.temp = [];
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }
        $scope.deleteVehicle = function (data) {
            if (!confirm("Are you sure you wnat to delete this item/record")) {
                return;
            }
            var req = {
                url: rmsService.baseEndpointUrl +
                    'asset/remove-vehicle/assetId/' +
                    $scope.assetDetail.id + '/vehicleId/' + data.id,
                method: "DELETE",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },

            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.editvehicle = false;
                $scope.getVehicle();

                AppService.HideLoader();
                rmsService.showAlert(true, 'Vehicle deleted successfully.');
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })
        }
        $scope.updateVehicle = function () {
            // $scope.storeVehDamageType();
            $scope.editvehicle = false;
            var req = {
                url: rmsService.baseEndpointUrl +
                    'vehicle/update-vehicle/',
                method: "PUT",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
                data: $scope.vehicle
            }

            AppService.ShowLoader();

            $http(req).then(function (response) {

                $scope.getVehicle();
                AppService.HideLoader();
                rmsService.showAlert(true, 'Vehicle updated successfully.');
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })
        }
        //Add asset other//
        $scope.addAssetOther = function () {
            var req = {
                url: rmsService.baseEndpointUrl + 'asset/add-asset-type-other/assetId/' + $scope.assetDetail.id,
                method: "PUT",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
                data: $scope.assetOther
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.getAssetOther();

                AppService.HideLoader();
                rmsService.showAlert(true, 'Asset other added successfully.');
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })
            $scope.assetOther = {};

        }
        $scope.loadAssetOther = function (data) {
            $scope.editassetother = true;
            $scope.assetOther = data;
        }
        $scope.getAssetOther = function () {
            var req = {
                url: rmsService.baseEndpointUrl +
                    'asset-type-other/asset-type-other-table/assetId/'
                    + $scope.assetDetail.id,
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },

            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.assetOthers = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }
        $scope.deleteAssetOther = function (data) {
            if (!confirm("Are you sure you wnat to delete this item/record")) {
                return;
            }
            var req = {
                url: rmsService.baseEndpointUrl +
                    'asset/remove-asset-type-other/assetId/' +
                    $scope.assetDetail.id + '/assetTypeOtherId/' + data.id,
                method: "DELETE",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },

            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.getAssetOther();

                AppService.HideLoader();
                rmsService.showAlert(true, 'Asset other deleted successfully.');
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })
        }
        $scope.updateAssetOther = function () {
            $scope.editassetother = false;
            var req = {
                url: rmsService.baseEndpointUrl +
                    'asset-type-other/update-asset-type-other',
                method: "PUT",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
                data: $scope.assetOther
            }

            AppService.ShowLoader();

            $http(req).then(function (response) {

                $scope.getAssetOther();
                $scope.assetOther = {};
                AppService.HideLoader();
                rmsService.showAlert(true, 'Asset other updated successfully.');

            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })
        }
        //equipment//
        $scope.addEquipement = function () {
            var req = {
                url: rmsService.baseEndpointUrl +
                    'asset/add-equipment/assetId/'
                    + $scope.assetDetail.id,
                method: "PUT",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
                data: $scope.equipment
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.getEquipment();

                AppService.HideLoader();
                rmsService.showAlert(true, 'Equipment added successfully.');
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })

            $scope.equipment = {};


        }
        $scope.loadEquipment = function (data) {
            $scope.editequipment = true;
            $scope.equipment = data;
        }
        $scope.getEquipment = function () {
            var req = {
                url: rmsService.baseEndpointUrl +
                    'equipment/equipment-table/assetId/'
                    + $scope.assetDetail.id,
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },

            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.equipments = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }
        $scope.updateEquipment = function () {
            $scope.editequipment = false;
            var req = {
                url: rmsService.baseEndpointUrl +
                    'equipment/update-equipment/',
                method: "PUT",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
                data: $scope.equipment
            }

            AppService.ShowLoader();

            $http(req).then(function (response) {

                $scope.getEquipment();
                AppService.HideLoader();
                rmsService.showAlert(true, 'Equipment updated successfully.');
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })
        }
        $scope.deleteEquipment = function (data) {
            if (!confirm("Are you sure you wnat to delete this item/record")) {
                return;
            }
            var req = {
                url: rmsService.baseEndpointUrl +
                    'asset/remove-equipment/assetId/' +
                    $scope.assetDetail.id + '/equipmentId/' + data.id,
                method: "DELETE",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },

            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.getVehicle();

                AppService.HideLoader();
                rmsService.showAlert(true, 'Equipment deleted successfully.');
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })
        }

        $scope.addCrimeSuspect = function () {

            $scope.crimeSuspect.distinguishingFeatureDetails = $scope.crimeSuspect.distinguishingFeatures;
            var req = {
                url: rmsService.baseEndpointUrl + 'crime/add-crime-suspect/crimeId/' +
                    $scope.crimeDetails.id,
                method: "PUT",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
                data: $scope.crimeSuspect
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.getCrimeSuspectData();

                AppService.HideLoader();
                rmsService.showAlert(true, 'Crime suspect added successfully.');
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })
            //reinitialize the suspect so that new can be added

            $scope.crimeSuspect = {
                addresses: [],
                distinguishingFeatureDetail: null,
                distinguishingFeature: null
            }
        }
        $scope.updateCrimeSuspect = function (person) {
            $scope.editCrimeSuspect = false;
            var req = {
                url: rmsService.baseEndpointUrl + 'crime-suspect/update-crime-suspect',
                method: "PUT",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
                data: $scope.crimeSuspect
            }

            AppService.ShowLoader();

            $http(req).then(function (response) {

                $scope.getCrimeSuspectData();
                $scope.crimeSuspect.distinguishingFeatures = $scope.crimeSuspect.distinguishFeaturesDetails;
                AppService.HideLoader();
                rmsService.showAlert(true, 'Crime suspect updated successfully.');

            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })
        }
        $scope.getCrimeSuspectData = function () {
            if (!$scope.crimeDetails.id) {
                return;
            }
            var req = {
                url: rmsService.baseEndpointUrl +
                    'crime-suspect/crime-suspect-table/crimeId/' + $scope.crimeDetails.id,
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },

            }
            AppService.ShowLoader();

            $http(req).then(function (response) {

                $scope.crimesuspects = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }
        $scope.deleteCrimeSuspect = function (person) {
            if (!confirm("Are you sure you wnat to delete this item/record")) {
                return;
            }
            var req = {
                url: rmsService.baseEndpointUrl +
                    'crime/remove-crime-suspect/crimeId/' + $scope.crimeDetails.id + '/crimeSuspectId/' + person.id,

                method: "DELETE",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },

            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.getCrimeSuspectData();

                AppService.HideLoader();
                rmsService.showAlert(true, 'Crime suspect deleted successfully.');
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })

        }
        $scope.loadCrimeSuspect = function (person) {
            $scope.editCrimeSuspect = true;
            $scope.crimeSuspect = rmsService.cloneObject(person);
            $scope.crimeSuspect.distinguishingFeaturesOptions = rmsService.cloneObject($scope.crimeSuspect.distinguishingFeatureDetails);
            $scope.crimeSuspect.distinguishingFeatures = rmsService.cloneObject($scope.crimeSuspect.distinguishingFeatureDetails);
            $scope.crimeSuspect.distinguishingFeature = [];
            $scope.crimeSuspect.distinguishingFeature.push($scope.distinguishFeatures[0]);
            $scope.getDistinguishFeaturesDetails([$scope.distinguishFeatures[0]]);

        }
        $scope.addCrimeExistingSuspect = function (person) {
            if (person.selected) {
                var req = {
                    url: rmsService.baseEndpointUrl +
                        'crime/add-existing-crime-suspect/crimeId/' +
                        $scope.crimeDetails.id + '/crimeSuspectId/' + person.id,
                    method: "PUT",
                    headers: {
                        'X-AUTH-TOKEN': $scope.token
                    },

                }
                AppService.ShowLoader();

                $http(req).then(function (response) {
                    $scope.getCrimeSuspectData();

                    AppService.HideLoader();
                    rmsService.showAlert(true, 'Crime suspect added successfully.');
                }, function (error) {
                    AppService.HideLoader();
                    rmsService.showAlert(false, error);
                })

            } else {

                var req = {
                    url: rmsService.baseEndpointUrl +
                        'crime/remove-crime-suspect/crimeId/' +
                        $scope.crimeDetails.id + '/crimeSuspectId/' + person.id,
                    method: "DELETE",
                    headers: {
                        'X-AUTH-TOKEN': $scope.token
                    },

                }
                AppService.ShowLoader();

                $http(req).then(function (response) {
                    $scope.getCrimeSuspectData();

                    AppService.HideLoader();
                    rmsService.showAlert(true, 'Crime suspect deleted successfully.');
                }, function (error) {
                    AppService.HideLoader();
                    rmsService.showAlert(false, error);
                })

            }
        }
        $scope.addCrimeEmployeeSuspect = function (person) {
            if (person.selected) {
                var req = {
                    url: rmsService.baseEndpointUrl +
                        'crime/add-employee-crime-suspect/crimeId/' +
                        $scope.crimeDetails.id + '/employeeId/' + person.id,
                    method: "PUT",
                    headers: {
                        'X-AUTH-TOKEN': $scope.token
                    },

                }
                AppService.ShowLoader();

                $http(req).then(function (response) {
                    $scope.getCrimeSuspectData();

                    AppService.HideLoader();
                    rmsService.showAlert(true, 'Crime suspect added successfully.');
                }, function (error) {
                    AppService.HideLoader();
                    rmsService.showAlert(false, error);
                })

            } else {

                var req = {
                    url: rmsService.baseEndpointUrl +
                        'crime/remove-employee-crime-suspect/crimeId/' +
                        $scope.crimeDetails.id + '/employeeId/' + person.id,
                    method: "DELETE",
                    headers: {
                        'X-AUTH-TOKEN': $scope.token
                    },

                }
                AppService.ShowLoader();

                $http(req).then(function (response) {
                    $scope.getCrimeSuspectData();

                    AppService.HideLoader();
                    rmsService.showAlert(true, 'Crime suspect removed successfully.');
                }, function (error) {
                    AppService.HideLoader();
                    rmsService.showAlert(false, error);
                })

            }
        }

        $scope.addCrimeWitness = function () {

            $scope.crimeWitness.distinguishingFeatureDetails = $scope.crimeWitness.distinguishingFeatures;
            var req = {
                url: rmsService.baseEndpointUrl +
                    'crime/add-witness/crimeId/' +
                    $scope.crimeDetails.id,
                method: "PUT",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
                data: $scope.crimeWitness
            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.getCrimeWitnessData();

                AppService.HideLoader();
                rmsService.showAlert(true, 'Crime witness added successfully.');
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })
            //reinitialize the suspect so that new can be added

            $scope.crimeWitness = {
                addresses: [],
                distinguishingFeatureDetail: null,
                distinguishingFeature: null
            }
        }
        $scope.updateCrimeWitness = function (person) {
            $scope.editCrimeWitness = false;
            var req = {
                url: rmsService.baseEndpointUrl + 'witness/update-witness',
                method: "PUT",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
                data: $scope.crimeWitness
            }

            AppService.ShowLoader();

            $http(req).then(function (response) {

                $scope.getCrimeWitnessData();
                $scope.crimeWitness.distinguishingFeatures = $scope.crimeWitness.distinguishFeaturesDetails;
                AppService.HideLoader();
                rmsService.showAlert(true, 'Crime witness updated sccessfully.');
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })
        }
        $scope.getCrimeWitnessData = function () {
            if (!$scope.crimeDetails.id) {
                return;
            }
            var req = {
                url: rmsService.baseEndpointUrl +
                    'witness/witness-table/crimeId/' + $scope.crimeDetails.id,
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },

            }
            AppService.ShowLoader();

            $http(req).then(function (response) {

                $scope.crimeWitnesses = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }
        $scope.deleteCrimeWitness = function (person) {
            if (!confirm("Are you sure you wnat to delete this item/record")) {
                return;
            }
            var req = {
                url: rmsService.baseEndpointUrl +
                    'crime/remove-witness/crimeId/' + $scope.crimeDetails.id +
                    '/witnessId/' + person.id,

                method: "DELETE",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },

            }
            AppService.ShowLoader();

            $http(req).then(function (response) {
                $scope.getCrimeWitnessData();

                AppService.HideLoader();
                rmsService.showAlert(true, 'Crime witness deleted successfully.');
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })

        }
        $scope.loadCrimeWitness = function (person) {
            $scope.editCrimeWitness = true;
            $scope.crimeWitness = rmsService.cloneObject(person);
            $scope.crimeWitness.distinguishingFeaturesOptions = rmsService.cloneObject($scope.crimeWitness.distinguishingFeatureDetails);
            $scope.crimeWitness.distinguishingFeatures = rmsService.cloneObject($scope.crimeWitness.distinguishingFeatureDetails);
            $scope.crimeWitness.distinguishingFeature = [];
            $scope.crimeWitness.distinguishingFeature.push($scope.distinguishFeatures[0]);
            $scope.getDistinguishFeaturesDetails([$scope.distinguishFeatures[0]]);

        }
        $scope.addCrimeExistingWitness = function (person) {
            if (person.selected) {
                var req = {
                    url: rmsService.baseEndpointUrl + 'crime/add-existing-witness/crimeId/' + $scope.crimeDetails.id + '/witnessId/' + person.id,
                    method: "PUT",
                    headers: {
                        'X-AUTH-TOKEN': $scope.token
                    },

                }
                AppService.ShowLoader();

                $http(req).then(function (response) {
                    $scope.getCrimeWitnessData();

                    AppService.HideLoader();
                    rmsService.showAlert(true, 'Crime witness added successfully.');
                }, function (error) {
                    AppService.HideLoader();
                    rmsService.showAlert(false, error);
                })

            } else {

                var req = {
                    url: rmsService.baseEndpointUrl +
                        'crime/remove-witness/crimeId/' +
                        $scope.crimeDetails.id + '/witnessId/' + person.id,
                    method: "DELETE",
                    headers: {
                        'X-AUTH-TOKEN': $scope.token
                    },

                }
                AppService.ShowLoader();

                $http(req).then(function (response) {
                    $scope.getCrimeWitnessData();

                    AppService.HideLoader();
                    rmsService.showAlert(true, 'Crime witness deleted successfully.');
                }, function (error) {
                    AppService.HideLoader();
                    rmsService.showAlert(false, error);
                })

            }
        }
        $scope.addCrimeEmployeeWitness = function (person) {
            if (person.selected) {
                var req = {
                    url: rmsService.baseEndpointUrl +
                        'crime/add-employee-witness/crimeId/' +
                        $scope.crimeDetails.id + '/employeeId/' + person.id,
                    method: "PUT",
                    headers: {
                        'X-AUTH-TOKEN': $scope.token
                    },

                }
                AppService.ShowLoader();

                $http(req).then(function (response) {
                    $scope.getCrimeWitnessData();

                    AppService.HideLoader();
                    rmsService.showAlert(true, 'Crime witness added successfully.');
                }, function (error) {
                    AppService.HideLoader();
                    rmsService.showAlert(false, error);
                })

            } else {

                var req = {
                    url: rmsService.baseEndpointUrl +
                        'crime/remove-employee-witness/crimeId/' +
                        $scope.crimeDetails.id + '/employeeId/' + person.id,
                    method: "DELETE",
                    headers: {
                        'X-AUTH-TOKEN': $scope.token
                    },

                }
                AppService.ShowLoader();

                $http(req).then(function (response) {
                    $scope.getInjuredData();

                    AppService.HideLoader();
                    rmsService.showAlert(true, 'Crime witness deleted successfully.');
                }, function (error) {
                    AppService.HideLoader();
                    rmsService.showAlert(false, error);
                })

            }
        }

        $scope.addAssetWitness = function () {
            $scope.assetDetail.newWitnesses.push($scope.assetWitness);
            //reset the object
            $scope.assetWitness = {
                addresses: []
            }
        }
        $scope.addAssetEmployeeWitness = function (person) {
            if (person.selected) {
                $scope.assetdetail.employeeWitnesses.push({ 'loginId': person.id });
            } else {
                $scope.assetDetail.employeeWitnesses.map(function (val, index) {

                    if (val.id == person.id) {
                        $scope.assetDetail.employeeWitnesses.splice(index, 1);
                    }
                })
            }
        }

        $scope.addAssetExistingWitness = function (person) {
            if (person.selected) {
                $scope.assetDetail.existingWitnesses.push({ 'id': person.id });
            } else {
                $scope.assetDetail.existingWitnesses.map(function (val, index) {

                    if (val.id == person.id) {
                        $scope.assetdetail.existingWitnesses.splice(index, 1);
                    }
                })
            }
        }



        //    $scope.addAccidentDetails = function() {
        //        $scope.accidentDetails.incidentId = $scope.incident.incidentId;
        //        $scope.accidentDetails.uniqueIncidentId = $scope.incident.uniqueIncidentId;
        //        var req = {
        //            url: rmsService.baseEndpointUrl+'incident/add-accident-details',
        //            method: "POST",
        //            headers: {
        //                'X-AUTH-TOKEN': $scope.token

        //            },
        //            data: $scope.accidentDetails
        //        }
        //        AppService.ShowLoader();

        //        $http(req).then(function(response) {
        //            //$scope.incidentSecond = response.data;
        //            AppService.HideLoader();
        //        }, function(error) {
        //            AppService.HideLoader();
        //        })
        //    }
        $scope.clearUser = function () {
            $scope.employeeUser = [];
        }
        $scope.userLookup = function (args) {

            var fil = {
                "paging": { "currentPage": 0, "pageSize": 50 },
                "sorts": [{ "field": "firstName", "order": "ASC" }],
                "filters": [{

                    "field": "fullName",
                    "operator": "CONTAINS",
                    "value": args

                }]
            }

            var req = {
                url: rmsService.baseEndpointUrl + 'user-lookup',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token,
                    'Search': JSON.stringify(fil)


                },
            }
            AppService.ShowLoader();
            $http(req).then(function (response) {

                $scope.employeeUser = response.data;

                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();

                //rmsService.showAlert(false, error);
            })

        }

        $scope.suspectLookup = function (args) {

            var fil = {
                "paging": { "currentPage": 0, "pageSize": 50 },
                "sorts": [{ "field": "firstName", "order": "ASC" }],
                "filters": [{

                    "field": "fullName",
                    "operator": "CONTAINS",
                    "value": args

                }]
            }
            var req = {
                url: rmsService.baseEndpointUrl + 'suspect-lookup',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token,
                    'Search': JSON.stringify(fil)
                },
            }

            $http(req).then(function (response) {
                $scope.suspectData = response.data;
            }, function (error) {
                //rmsService.showAlert(false, error);
            })

        }

        $scope.injuredPersonLookup = function (args) {

            var fil = {
                "paging": { "currentPage": 0, "pageSize": 50 },
                "sorts": [{ "field": "firstName", "order": "ASC" }],
                "filters": [{

                    "field": "fullName",
                    "operator": "CONTAINS",
                    "value": args

                }]
            }
            var req = {
                url: rmsService.baseEndpointUrl + 'injured-person-lookup',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token,
                    'Search': JSON.stringify(fil)
                },
            }
            AppService.ShowLoader();
            $http(req).then(function (response) {

                $scope.injuredPersonData = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }
        $scope.witnessLookup = function (args) {

            var fil = {
                "paging": { "currentPage": 0, "pageSize": 50 },
                "sorts": [{ "field": "firstName", "order": "ASC" }],
                "filters": [{
                    "field": "fullName",
                    "operator": "CONTAINS",
                    "value": args

                }]
            }
            var req = {
                url: rmsService.baseEndpointUrl + 'witness-lookup',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token,
                    'Search': JSON.stringify(fil)
                },
            }
            AppService.ShowLoader();
            $http(req).then(function (response) {

                $scope.witnessData = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }
        $scope.crimeWitnessLookup = function (args) {
            var fil = {
                "paging": { "currentPage": 0, "pageSize": 50 },
                "sorts": [{ "field": "firstName", "order": "ASC" }],
                "filters": [{
                    "field": "fullName",
                    "operator": "CONTAINS",
                    "value": args

                }]
            }
            var req = {
                url: rmsService.baseEndpointUrl + 'witness-lookup',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token,
                    'Search': JSON.stringify(fil)
                },
            }
            AppService.ShowLoader();
            $http(req).then(function (response) {

                $scope.crimeWitnessData = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }
        $scope.crimeSuspectLookup = function (args) {
            var fil = {
                "paging": { "currentPage": 0, "pageSize": 50 },
                "sorts": [{ "field": "firstName", "order": "ASC" }],
                "filters": [{
                    "field": "fullName",
                    "operator": "CONTAINS",
                    "value": args

                }]
            }
            var req = {
                url: rmsService.baseEndpointUrl + 'crime-suspect-lookup',
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token,
                    'Search': JSON.stringify(fil)
                },
            }
            AppService.ShowLoader();
            $http(req).then(function (response) {

                $scope.crimeSuspectData = response.data;
                AppService.HideLoader();
            }, function (error) {
                AppService.HideLoader();
            })
        }

        $scope.addInvestigationDetails = function () {
            if ($scope.investigationDetails.incident == null) {
                $scope.investigationDetails.incident = {};
            }
            $scope.investigationDetails.incident.id = $scope.incident.incidentId;
            $scope.investigationDetails.incident.uniqueIncidentId = $scope.incident.uniqueIncidentId;
            var req = {
                url: rmsService.baseEndpointUrl + 'investigation/add-or-update-investigation',
                method: "POST",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
                data: $scope.investigationDetails
            }
            AppService.ShowLoader();
            $http(req).then(function (response) {
                $scope.investigationDetails.id = response.data.id;
                AppService.HideLoader();
                rmsService.showAlert(true, 'Investigation details added successfully.');
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })
        }

        $scope.removeSupportingDocumnet = function (doc, index) {
            if (!confirm("Are you sure you wnat to delete this item/record")) {
                return;
            }
            var req = {
                url: rmsService.baseEndpointUrl + 'document/delete-document/' + doc.id,
                method: "DELETE",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                }
            }
            AppService.ShowLoader();
            $http(req).then(function (response) {
                AppService.HideLoader();
                $scope.incident.supportingDocuments.splice(index, 1);
                rmsService.showAlert(true, 'Document deleted successfully.');
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })

        }

        $scope.downloadSupportingDocumnet = function (doc) {
            let req = {
                url: rmsService.baseEndpointUrl + 'document/download-document/' + doc.id,
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
                responseType: 'arraybuffer'
            }
            AppService.ShowLoader();
            $http(req).then(function (response) {
                AppService.HideLoader();
                let blob = new Blob([response.data], { type: doc.fileContentType });
                saveAs(blob, doc.originalFileName);
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
            })
        }

        $scope.getincidentSummary = function () {
            //incident/uniqueIncidentId/IN010917203918
            let req = {
                //url: rmsService.baseEndpointUrl+'incident/uniqueIncidentId/IN011117154413',
                url: rmsService.baseEndpointUrl + 'incident/uniqueIncidentId/' + $scope.incident.uniqueIncidentId,
                method: "GET",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
            }
            AppService.ShowLoader();
            $http(req).then(function (response) {
                $scope.incidentSummary = response.data;
                if ($scope.editIncidentMode) {
                    $scope.prepareEditIncidentData();
                }
                AppService.HideLoader();
                //console.log(response.data);
            }, function (error) {
                AppService.HideLoader();
            })
        }

        $scope.submitIncident = function () {
            //incident/uniqueIncidentId/IN010917203918
            let req = {
                url: rmsService.baseEndpointUrl + 'incident/submit-incident',
                method: "POST",
                headers: {
                    'X-AUTH-TOKEN': $scope.token
                },
                data: {
                    "incidentId": $scope.incident.incidentId,
                    "uniqueIncidentId": $scope.incident.uniqueIncidentId
                }
            }
            AppService.ShowLoader();
            $http(req).then(function (response) {
                //$scope.incidentSummary = response.data;
                //console.log(response.data);
                AppService.HideLoader();
                $location.path("/incidents");
                rmsService.showAlert(true, 'Incident submitted successfully.');
            }, function (error) {
                AppService.HideLoader();
                rmsService.showAlert(false, error);
                // alert("Some issue occured while submitting the incident!");
            })
        }

        $scope.prepareEditIncidentData = function () {
            let incidentSummary = rmsService.cloneObject($scope.incidentSummary);
            $scope.incident.incidentId = incidentSummary.id;
            $scope.incident.id = incidentSummary.id;
            $scope.incident.uniqueIncidentId = incidentSummary.uniqueIncidentId;
            $scope.userInfo = incidentSummary.incidentReportedBy;
            for (let key in $scope.logIncidentDetails) {
                if (key !== 'date' && key != 'timeHrsOfIncident' && key != 'timeMinOfIncident') {
                    $scope.logIncidentDetails[key] = incidentSummary[key];
                }
                if (key.indexOf("Date") > -1 && incidentSummary[key] != null) {
                    let dt = incidentSummary[key].split(" ");
                    $scope.logIncidentDetails.dateIncident = new Date(rmsService.formatDate(dt[0]));
                    $scope.logIncidentDetails.timeHrsOfIncident = dt[1].split(":")[0];
                    $scope.logIncidentDetails.timeMinOfIncident = dt[1].split(":")[1];
                }
                if (incidentSummary[key] == 'Y') {
                    $scope.logIncidentDetails[key] = true;
                    if ($scope.activeTab.tab != 9) {
                        if (key == "accidentDamage") {
                            $scope.addTab('accidentForm');
                        }
                        if (key == "assetDamage") {
                            $scope.addTab('assetsForm');
                        }
                        if (key == "criminalAttack") {
                            $scope.addTab('crimeForm');
                        }
                    }

                }
                if (incidentSummary[key] == 'N') {
                    $scope.logIncidentDetails[key] = false
                }
            }

            $scope.logIncidentDetails.incidentLocationDetail = incidentSummary.incidentLocationDetail;
            //  $scope.suspects = incidentSummary.suspects;

            $scope.incidentDetails = {
                "incidentId": incidentSummary.incidentId,
                "uniqueIncidentId": incidentSummary.uniqueIncidentId,
                "newSuspects": incidentSummary.newSuspects || [],
                "existingSuspects": incidentSummary.existingSuspects || [],
                "employeeSuspects": incidentSummary.employeeSuspects || [],
                "reportedLosses": incidentSummary.reportedLosses || []
            }
            $scope.incidentDetails.reportedLosses.map((loss) => {
                loss = $scope.lossDateFormat(loss);
            });
            $scope.getSuspectData();
            $scope.getLossData();
            $scope.loss = {
                "id": null,
                "incident": {},
                "statusFlag": "ACTIVE",
                "date": null,
                "timeHrsContacted": null,
                "timeMinContacted": null

            }

            $scope.incident.supportingDocuments = incidentSummary.documents;

            incidentSummary.accident == null ? incidentSummary.accident = {} : incidentSummary.asset;
            $scope.accidentDetails = incidentSummary.accident;
            $scope.accAdded = incidentSummary.accident ? true : false
            $scope.assetDetail = incidentSummary.asset;
            $scope.accidentDetails.accidentDate = null;
            $scope.accidentDetails.accidentTimeHrs = null;
            $scope.accidentDetails.accidentTimeMin = null;
            if ($scope.accidentDetails.accidentDateTime != null) {
                let dt = $scope.accidentDetails.accidentDateTime.split(" ");
                $scope.accidentDetails.accidentDate = new Date(rmsService.formatDate(dt[0]));
                $scope.accidentDetails.accidentTimeHrs = dt[1].split(":")[0];
                $scope.accidentDetails.accidentTimeMin = dt[1].split(":")[1];
            }
            else {
                $scope.initializeAccidentPlaceAndTime();
            }
            // $scope.witnesses = incidentSummary.accident.witnesses;
            // $scope.injuredPersons = incidentSummary.accident.injuredPersons;
            $scope.getWitnessData();
            $scope.getInjuredData();


            //$scope.getDistinguishFeaturesDetails();
            incidentSummary.asset == null ? incidentSummary.asset = {} : incidentSummary.asset;
            if (incidentSummary.asset != null) {
                $scope.assetDetail = incidentSummary.asset;
                $scope.buildings = incidentSummary.asset.buildings || [];
                $scope.equipments = incidentSummary.asset.equipments || [];
                $scope.vehicles = incidentSummary.asset.vehicles || [];
                $scope.assetOthers = incidentSummary.asset.assetTypeOthers || [];
            }
            $scope.assetAdded = true;
            incidentSummary.crime == null ? incidentSummary.crime = rmsService.cloneObject($scope.crimeDetails) : incidentSummary.crime;
            $scope.crimeDetails.date = null;
            $scope.crimeDetails.timeHrs = null;
            $scope.crimeDetails.timeMin = null;
            $scope.crimeDetails = incidentSummary.crime;

            if ($scope.crimeDetails.crimeDateTime != null) {
                let dt = $scope.crimeDetails.crimeDateTime.split(" ");
                $scope.crimeDetails.date = new Date(rmsService.formatDate(dt[0]));
                $scope.crimeDetails.timeHrs = dt[1].split(":")[0];
                $scope.crimeDetails.timeMin = dt[1].split(":")[1];
            }
            else {
                $scope.initializeCrimeTime();
            }
            $scope.crimeAdded = true;
            //  $scope.crimeWitnesses = incidentSummary.crime.witnesses.concat(incidentSummary.crime.employeeWitnesses);
            // $scope.crimesuspects = incidentSummary.crime.crimeSuspects.concat(incidentSummary.crime.employeeCrimeSuspects);
            $scope.getCrimeSuspectData();
            $scope.getCrimeWitnessData();
            if (incidentSummary.claim != null) {
                $scope.claimDetail = incidentSummary.claim;
                for (let key in $scope.claimDetail) {
                    $scope.claimDetail[key] = incidentSummary.claim[key];
                    if (key.toLowerCase().indexOf("date") > -1 && incidentSummary.claim[key] != null
                        && key != 'lastUpdated' && key != 'lastUpdatedBy') {
                        $scope.claimDetail[key] = new Date(rmsService.formatDate($scope.claimDetail[key]));
                    }
                }
                if (incidentSummary.claim.claimHandler) {
                    $scope.claimHandler = incidentSummary.claim.claimHandler.firstName + " " + incidentSummary.claim.claimHandler.lastName;

                }


                $scope.claimRefId = incidentSummary.claim.claimId;

            }

            $scope.investigationDetails = incidentSummary.investigation != null ? incidentSummary.investigation : $scope.investigationDetails;

            if (incidentSummary.investigation != null && incidentSummary.investigation.investigator == null) {


                incidentSummary.investigation.investigator = {
                    "id": null,
                    "loginId": null,
                    "username": null
                }
            }


            $scope.getIncidentLocDetail();
            $scope.getAccLocDetail();

        }

        if ($scope.editIncidentMode) {
            $scope.getincidentSummary();
        } else {
            $scope.getUserInfo();
        }

        $scope.showPostcodeLookup = function (whatFor) {

            $scope.clearPostCodeLookup();
            $scope.whatFor = whatFor;
            $('#postcodeModal').modal('show');
        }

        $scope.formatGoogleApiResult = function (results) {
            formattedAddresses = [];
            results.forEach(function (add) {
                let address = {
                    "organizationName": null,
                    "buildingName": null,
                    "streetName": null,
                    "localityName": null,
                    "postTown": null,
                    "county": null,
                    "city": null,
                    "postcode1": null,
                    "postcode2": null,
                    "country": null,
                    "doorNumber": null,
                    "blockNumber": null,
                    "apartmentNumber": null
                };
                address.postcode1 = $scope.postcode1;
                address.postcode2 = $scope.postcode2;
                add.address_components.forEach((c) => {
                    switch (c.types[0]) {
                        case 'street_number':
                            address.streetName = c.long_name;
                            break;
                        case 'route':
                            if (address.streetName) {
                                address.streetName = address.streetName + ' ' + c.long_name;
                            } else {
                                address.streetName = c.long_name;
                            }
                            break;
                        case 'sublocality':
                            address.streetName = c.long_name;
                            break;
                        case 'sublocality_level_1':
                            address.suburb = c.long_name;
                            break;
                        case 'sublocality_level_2':
                            if (!address.suburb) { address.suburb = c.long_name; }
                            break;
                        case 'neighborhood':
                            address.localityName = c.long_name;
                            break;
                        case 'postal_town':
                            address.postTown = c.long_name;
                            break;
                        case 'administrative_area_level_2':
                            address.city = c.long_name;
                            break;
                        case 'administrative_area_level_1':
                            address.state = c.long_name;
                            break;
                        case 'country':
                            address.country = c.long_name;
                            break;
                    }
                });
                formattedAddresses.push(address);
                console.log(address);
            });

            return formattedAddresses;
        }

        $scope.selectLookupAddress = function (add) {
            $scope[$scope.whatFor].addresses[0] = add;
            $('#postcodeModal').modal('hide');
            $scope.clearPostCodeLookup();
        }
        $scope.clearPostCodeLookup = function () {
            $scope.postcode1 = null;
            $scope.postcode2 = null;
            $scope.whatFor = null;
            $scope.postCodeResults = [];
        }

        $scope.postcodeLookup = function () {
            AppService.ShowLoader();
            var req = {
                url: "https://maps.googleapis.com/maps/api/geocode/json?sensor=false&libraries=places&key=AIzaSyAiomJS84bB9JOsgqoCKUh47jTAjjVuAWU&address=" + $scope.postcode1 + "+" + $scope.postcode2,
                method: "GET",
            }
            AppService.ShowLoader();
            $http(req).then(function (response) {
                AppService.HideLoader();
                $scope.postCodeResults = $scope.formatGoogleApiResult(response.data.results);
            }, function (error) {
                AppService.HideLoader();
            })
        }

        //get data for dropdown and for other details
        $scope.getSuspectType();
        $scope.getAgency();
        $scope.getDistinguishFeatures();

        $scope.getEntrypoint();
        $scope.getIncidentLoc();

        $scope.getIncidentType();
        $scope.getSuspectType();
        $scope.getAccidentLoc();
        $scope.getAccidentType();
        $scope.getAssetCategory();
        $scope.getBodyPart();
        $scope.getClaimRegType();
        $scope.getClaimStatus();
        $scope.getClaimType();
        $scope.getDepartment();
        $scope.getDocCategory();
        $scope.getDocType();
        $scope.getEmpType();
        $scope.getEventType();
        $scope.getGenderType();
        $scope.getInjuredPersonType();
        $scope.getInjuryType();

        $scope.getInjuryCause();
        $scope.getLossType();
        $scope.getOrg();
        $scope.getPolicyType();
        $scope.getPos();
        $scope.getPosLevel();
        $scope.getVehicleDamageType();
        $scope.getWeaponType();



    }])


