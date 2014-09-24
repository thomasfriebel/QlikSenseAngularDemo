angular.module("QvAngular")
    .controller("qvDocCtrl", function ($scope, $q, $routeParams, qvCommService, qsClientService, qGlobalRPCs) {
        console.log("doc", $routeParams)

        //        $scope.docId = '';
        /*

        $scope.setdocId = function(newDocId) {
            if (angular.isDefined(newDocId) && angular.isString(newDocId)) {
                newDocId = newDocId.replaceAll(".qvf","")
                $scope.docId = newDocId
            }

            return $scope.docId
        }

*/
        //        $scope.setdocId($routeParams.id)
        $scope.q.docId = $routeParams.id
        $scope.q.docId = $scope.q.docId.replace(".qvf", "")
        $scope.q.qtr = {}
        $scope.q.dimselect = 'Country'
        $scope.q.aggrselect = 'SUM'
        $scope.q.measelect = 'Car sales'
        $scope.q.chartType = "BarChart";

        $scope.open = function () {
            /**
        get the type of a variable
        @param content content of document
        @param variable name of the variable
        @return type of the variable: unknown,String,Array or RegExp
    */

            console.log("opening doc", $scope.q.docId)
            return qsClientService.openDoc($scope.q.docId).then(function (data) {
                $scope.qHandle = data[0].qHandle;
                $scope.q.qHandle = data[0].qHandle;
                return $scope.q.qHandle
            }).then(function (qHandle) {
                return qsClientService.getTablesAndKeys(qHandle).then(function (data) {
                    $scope.q.qtr = data[0]
                    return qHandle
                })
            }).then(function (qHandle) {
                return qsClientService.getAppLayout(qHandle).then(function (data) {
                    $scope.q.doc = data
                    return data
                })
            }).finally(function (done) {
                console.log("DONE", done)
            }).catch(function (error) {
                console.error("ERROR", error)
            })
        };





        $scope.getFields = function () {
            qsClientService.createFieldList($scope.q.qHandle)
                .then(function (data) {
                    console.info("DATA IS", data)
                    $scope.q.fieldlist = data[0].qFieldList.qItems
                })
        }

        $scope.selectnow = function () {
            qsClientService.selectInCube($scope.q.cube.qHandle).then(function (data) {
                console.log(data)
                if (data[0] == true) {
                    $scope.getCube('again')
                }
            })
        }
        $scope.onselect = function (e) {
            console.log("select:", e.row)
            var selectedIdx = -1
            if ($scope.q.selected) {
                selectedIdx = $scope.q.selected
                $scope.q.selected = null
            } else {
                selectedIdx = $scope.q.selected = $scope.q.qTop + e.row
            }
            qsClientService.selectInCube($scope.q.cube.qHandle, selectedIdx).then(function (data) {
                console.log(data)
                if (data[0] == true) {
                    $scope.getCube('again')
                }
            })

        }

        $scope.getCube = function (dir) {
            var height = 10;
            $scope.q.cube = $scope.q.cube || {}
            console.log("dir", dir)
            switch (dir) {
            case 'again':
                break;
            case 'next':
                $scope.q.qTop = $scope.q.qTop + height;
                break;
            case 'previous':
                $scope.q.qTop = $scope.q.qTop - height;
                break;
            default:
                $scope.q.qTop = 0;
                $scope.q.cube = {};
                $scope.q.chart = null

            }
            console.log("getting cube", $scope.q);
            var params = {
                "qHandle": $scope.q.qHandle,
                "dimension": $scope.q.dimselect,
                "measure": $scope.q.aggrselect + "([" + $scope.q.measelect + "])",
                "offset": $scope.q.qTop,
                "height": height,
                "width": 2

            };
            var promise;
            if (!$scope.q.chart) {
                promise = qsClientService.dynamicHyperCube(params)
            } else {
                params = {
                    qHandle: $scope.q.cube.qHandle,
                    qTop: $scope.q.qTop,
                    qHeight: height,
                    qWidth: 2,
                    qLeft: 0
                }
                promise = qsClientService.getHyperCube(params)
            }
            promise.then(function (data) {
                if (data[0].qHandle) {
                    $scope.q.cube.qHandle = data[0].qHandle
                }
                console.log("got back cube ", data)

                $scope.q.chart = data[0].qDataPages

                $scope.chartObject = {
                    "type": $scope.q.chartType,
                    "displayed": true,
                    "data": {
                        "cols": [
                            {
                                "id": "country",
                                "label": params.dimension,
                                "type": "string",
                                "p": {}
      },
                            {
                                "id": "Sales",
                                "label": params.measure,
                                "type": "number",
                                "p": {}
      }

                        ],
                        "rows": [

      ]

                    },
                    "options": {
                        "title": "Chart with Cube qHandle = " + data[0].qHandle,
                        "isStacked": "false",
                        "fill": 20,
                        "displayExactValues": true,
                        "vAxis": {
                            "title": params.dimension,
                            "gridlines": {
                                "count": 10
                            }
                        },
                        "hAxis": {
                            "title": params.measure
                        },
                        "tooltip": {
                            "isHtml": false
                        }
                    },
                    "formatters": {},
                    "view": {}
                }
                for (var i = 0; i < $scope.q.chart[0].qMatrix.length; i++) {
                    $scope.chartObject.data.rows.push({

                        "c": [
                            {
                                "v": $scope.q.chart[0].qMatrix[i][0].qText,
                                "p": {}
          },
                            {
                                "v": $scope.q.chart[0].qMatrix[i][1].qNum,
                                "f": $scope.q.chart[0].qMatrix[i][1].qText,
                                "p": {}
          }

                    ]

                    })

                }


            })
                .then(function () {
                    return qsClientService.getLayout(2)
                })
                .catch(function (error) {
                    console.error("fehler", error)
                })
        }

        $scope.open().then(function () {
            $scope.getFields()
        })
            .then(function () {
                $scope.getCube()
            });
    })
    .controller("qvDocTableCtrl", function ($scope, $routeParams, qvCommService, qGlobalRPCs) {
        $scope.getTableData = function (tablename) {
            var GetTableData = qGlobalRPCs.GetTableData;
            GetTableData.handle = $scope.q.qHandle;
            $scope.q.qTable = tablename;
            GetTableData.params.qTableName = tablename
            GetTableData.params.qRows = 100;

            qvCommService.send(GetTableData, $scope, function (scope, data) {
                scope.q.qData = angular.copy(data.qData);
                scope.$apply("");
            }, function (scope, e) {
                console.log("error", e);
                scope.$apply("");
            });

        }
        $scope.q.qTable = $routeParams.table;
        if ($routeParams.table) {
            $scope.getTableData($routeParams.table)
        }

        $scope.getFields = function (tablename) {
            var hit = {};
            console.log($scope.q)
            for (var i = 0; i < $scope.q["qtr"].length; i++) {
                var table = $scope.q["qtr"][i]
                console.log("looking hot ", table)
                if (table.qName == tablename) {
                    hit = table;
                }
            }
            console.log("HI TTT:", hit)
            return hit.qFields
        }

        $scope.q.filterSystemFields = function (item) {
            return angular.isUndefined(item.qIsSystem) ? true : false;
        }




    })
