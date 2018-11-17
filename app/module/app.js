var riskManagementSystem = angular.module("riskManagementSystem", ['ui.router', 'btorfs.multiselect', 'ui.bootstrap']);
riskManagementSystem.config(['$stateProvider', '$urlRouterProvider', '$compileProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $compileProvider, $httpProvider) {

    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
    $urlRouterProvider.otherwise('/index.html');
    $stateProvider.
        state('home', {
            url: "/index.html",
            templateUrl: 'app/views/login.html',
            controller: 'loginController',
        }).state('login', {
            url: "/login",
            templateUrl: 'app/views/login.html',
            controller: 'loginController',
        }).state('dashboard', {
            url: "/dashboard",
            templateUrl: 'app/views/dashboard.html',
            controller: 'dashboardController',
        }).state('incidents', {
            url: "/incidents",
            templateUrl: 'app/views/incidents.html',
            controller: 'incidentsController',
        }).state('addincident', {
            url: "/addincident",
            templateUrl: 'app/views/addincident.html',
            controller: 'addIncidentController',
        }).state('editincident', {
            url: "/editincident/:uniqueIncidentId",
            // resolve: {
            //     stateToGo: function(service) {
            //       if (service.getItems().length > 0) {
            //         return 'child1';
            //       } else {
            //         return 'child2';
            //       }
            //     },
            templateUrl: 'app/views/addincident.html',
            controller: 'addIncidentController',
        }).state('claims', {
            url: "/claims",
            templateUrl: 'app/views/claims.html',
            controller: 'claimsController',
        }).state('investigations', {
            url: "/investigations",
            templateUrl: 'app/views/investigations.html',
            controller: 'investigationsController',
        })
    //investigations
}]);

riskManagementSystem.run(function ($rootScope, $location) {
    var token = localStorage.getItem("rmsAuthToken");
    var expired;
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

    if (expired) {
        //if expired redirect to login
        $location.path("/login");
    }
});

riskManagementSystem.directive('autoComplete', function ($timeout) {
    return function (scope, iElement, iAttrs) {
        iElementautocomplete({
            source: scope[iAttrs.uiItems],
            select: function () {
                $timeout(function () {
                    iElement.trigger('input');
                }, 0);
            }
        });
    };
});
riskManagementSystem.directive('blurToCurrency', function ($filter) {
    return {
        scope: {
            amount: '='
        },
        link: function (scope, el, attrs) {
            el.val($filter('currency')(scope.amount));
            el.bind('focus', function () {
                el.val(scope.amount);
            });
            el.bind('input', function () {
                scope.amount = el.val();
                scope.$apply();
            });
            el.bind('blur', function () {
                el.val($filter('currency')(scope.amount, ""));
            });
        }
    }
});

// riskManagementSystem.directive('dateFormatter', [
//     function () {
//         return {
//             restrict: 'A',
//             require: 'ngModel',
//             link: function postLink(scope, element, attrs, ngModel) {
//                 ngModel.$parsers.push(function (data) {
//                     //console.log("parsers.push " + data);
//                     var date = new Date(data);
//                     var out = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
//                     //console.log("$parsers.out = " + out);
//                     return out;
//                 });

//                 ngModel.$formatters.push(function (data) {
//                     //console.log("$formatters.push " + data);
//                     var date = new Date(data);
//                     var out = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
//                     //console.log("$formatters.out =" + out);
//                     return out;
//                 });
//             }
//         };
//     }
// ]);

riskManagementSystem.filter('dateformatter', function () {
    return function (input) {
        if (input == null || typeof input == 'undefined') {
            return null;
        }
        input = input || '';
        let out = '';
        if (typeof input.getMonth === 'function') {
            input = input.toLocaleDateString();
        }
        let date = new Date(input.split(" ")[0]);
        out = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        return out;
    };
})
riskManagementSystem.directive("ngUploadChange", function () {
    return {
        scope: {
            ngUploadChange: "&"
        },
        link: function ($scope, $element, $attrs) {
            $element.on("change", function (event) {
                $scope.$apply(function () {
                    $scope.ngUploadChange({ $event: event })
                })
            })
            $scope.$on("$destroy", function () {
                $element.off();
            });
        }
    }
});
riskManagementSystem.directive("mapsDirective", function () {
    return {
        restrict: 'E',
        template: `<div>
        <input id="pac-input" class="form-control" type="text" placeholder="Search Box">
        <div id = "sample" style = "width:570px; height:400px;"></div>
        </div>
        `,
        link: function (scope, element, attrs) {

            var markers = [];
            var mapOptions = {
                center: new google.maps.LatLng(51.5073391, -0.1284288), zoom: 18,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("sample"), mapOptions);
            google.maps.event.addListener(map, 'click', function (event) {
                setMapOnAll(null);
                placeMarkerAndPanTo(event.latLng, map);
            });

            var input = document.getElementById('pac-input');
            var searchBox = new google.maps.places.SearchBox(input);
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

            map.addListener('bounds_changed', function () {
                searchBox.setBounds(map.getBounds());
            });
            searchBox.addListener('places_changed', function () {
                var places = searchBox.getPlaces();

                if (places.length == 0) {
                    return;
                }

                // Clear out the old markers.
                markers.forEach(function (marker) {
                    marker.setMap(null);
                });
                markers = [];

                // For each place, get the icon, name and location.
                var bounds = new google.maps.LatLngBounds();
                places.forEach(function (place) {
                    if (!place.geometry) {
                        console.log("Returned place contains no geometry");
                        return;
                    }
                    var icon = {
                        url: place.icon,
                        size: new google.maps.Size(71, 71),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(17, 34),
                        scaledSize: new google.maps.Size(25, 25)
                    };
                    placeMarkerAndPanTo(place.geometry.location, map)

                    if (place.geometry.viewport) {
                        // Only geocodes have viewport.
                        bounds.union(place.geometry.viewport);
                    } else {
                        bounds.extend(place.geometry.location);
                    }
                });
                map.fitBounds(bounds);
            });

            function setMapOnAll(map) {
                for (var i = 0; i < markers.length; i++) {
                    markers[i].setMap(map);
                }
            }
            function initAutocomplete() {
                var map = new google.maps.Map(document.getElementById('map'), {
                    center: { lat: -33.8688, lng: 151.2195 },
                    zoom: 13,
                    mapTypeId: 'roadmap'
                });
            }
            function geocodeLatLng(geocoder, map, latlang, infowindow) {
                var latlngStr = latlang.split(',');
                var latlng = { lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1]) };
                geocoder.geocode({ 'location': latlng }, function (results, status) {
                    if (status === 'OK') {
                        if (results[0]) {
                            //map.setZoom(11);
                            infowindow.setContent(results[0].formatted_address);
                            scope["selectedLocation"] = {
                                address: results[0].formatted_address,
                                latlng: latlng
                            }
                            if (typeof scope.$parent["logIncidentDetails"]["placeOfIncident"] != "undefined") {
                                scope.$parent["logIncidentDetails"]["placeOfIncident"] = "http://maps.google.com/maps?q=" + latlng.lat + "+" + latlng.lng
                            } else {
                                scope.$parent["logIncidentDetails"] = {};
                                scope.$parent["logIncidentDetails"]["placeOfIncident"] = "http://maps.google.com/maps?q=" + latlng.lat + "+" + latlng.lng
                            }
                        }
                    }
                    // else {
                    //     window.alert('Geocoder failed due to: ' + status);
                    // }
                });
            }

            function placeMarkerAndPanTo(latLng, map) {
                var marker = new google.maps.Marker({
                    position: latLng,
                    map: map
                });
                markers.push(marker);
                var geocoder = new google.maps.Geocoder;
                google.maps.event.addListener(marker, 'click', function (event) {
                    var infowindow = new google.maps.InfoWindow();
                    if (event) {
                        geocodeLatLng(geocoder, map, event.latLng.toUrlValue(), infowindow);
                    } else {
                        geocodeLatLng(geocoder, map, this.position.lat() + "," + this.position.lng(), infowindow);
                    }
                    infowindow.open(map, this);
                });
                google.maps.event.trigger(marker, 'click');
                map.panTo(latLng);
            }

        }
    };
})

riskManagementSystem.directive('wholeNumber', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('change', function () {
                val = element.val();
                if (val.length === 2) {
                    element.val(val);
                } else {
                    element.val('0' + val);
                }
            });
        }
    }
});