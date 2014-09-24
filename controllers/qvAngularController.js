angular.module("QvAngular", ["ngRoute", "ngResource", "googlechart"])
    .constant("version", "0.0.1b")
    .config(function ($routeProvider) {
        $routeProvider.when("/doclist", {
            templateUrl: "views/docList.html",
            controller: 'qvAngularCtrl'
        })
        $routeProvider.when("/doc/:id", {
            templateUrl: "views/doc.html",
        })
        $routeProvider.when("/docchart/:id", {
            templateUrl: "views/docchart.html",
        })
        $routeProvider.when("/doc/:id/table/:table", {
            templateUrl: "views/doctable.html",

        })
        $routeProvider.otherwise({
            templateUrl: "views/welcome.html"
        })
    })
    .controller("qvAngularCtrl", function ($scope, $q, $rootScope, version, qvCommService, qsClientService, qGlobalRPCs, $timeout) {
        $scope.q = {}
        var socket;
        var socket_msg_id = 0;
        var socket_history = []
        $scope.version = version
        $scope.qHandle = -1;

        $scope.qvs = {
            url: "ws://localhost:4848/app/",
        }
        $scope.qvCommService = qvCommService;
        $scope.isConnected = qvCommService.isConnected()
        $scope.connect = function () {

            qsClientService.connect().then(function () {
                console.log("CONNECTED")
            })

        }
        $scope.transmitting = false;
        console.log($scope.transmitting)
        qsClientService.onTransmissionStatusChange(function (isTransmitting) {
            $timeout(function () {
                $scope.transmitting = isTransmitting
                $scope.$apply();
            }, 100);
            //$scope.$digest("");

        })
        $scope.test = function () {
            /*
            var OSName = qGlobalRPCs.OSName;
            qvCommService.send(OSName, $scope, function (scope, data) {
                console.log("scope is ", scope);
                scope.OSName = angular.copy(data.qReturn);
                scope.$apply("");
            });
*/
            console.log("test")
            qsClientService.getOSName().then(function (data) {
                console.log("return:", data)
                $scope.OSName = data[0];

                console.log("strange callback")
            })
                .then(function (x) {
                    return qsClientService.getQvVersion();
                })
                .then(function (qsversion) {
                    console.log("version", qsversion)
                    $scope.QvVersion = qsversion[0]
                })
                .catch(function error(error) {
                    console.log("errror in der kette", error)
                })
        }

        $scope.disconnect = function () {
            console.log("disconnecting...")
            qvCommService.disconnect();
            console.log("disconnected")
        }

        $scope.getFileList = function () {
            $scope.qHandle = -1;
            if ($scope.q && $scope.q.qHandle) {

            }
            $scope.q = {};

            qsClientService.getDocList().then(function (data) {
                console.log("got docs", data)
                $scope.qDocList = angular.copy(data[0]);
                //$scope.$apply("");
            }).catch(function (error) {

                console.error("error", error)
            })

        }
    })
