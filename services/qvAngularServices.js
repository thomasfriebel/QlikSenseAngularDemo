        /**
         */

        angular.module("QvAngular")
            .service("qvCommService", function ($rootScope, $q) {
                return {
                    _prevTransmittingStatus: null,
                    transmitting: false,
                    _transmissionStatus: function () {},
                    socket: null,
                    socket_msg_id: 0,
                    socket_history: {},
                    url: "ws://localhost:4848/app/" /*Equity%20Sales%20Analysis"*/ ,
                    setOnTransmissionStatus: function (callback) {
                        var self = this;
                        this._transmissionStatus = function () {
                            if (self.transmitting != self._prevTransmittingStatus) {
                                self._prevTransmittingStatus = self.transmitting
                                callback(self.transmitting)
                            } else {}
                        }
                    },

                    connect: function (callback) {
                        /**
                    Connects to Qlik Sense (desktop)
                */

                        var deferred = $q.defer();
                        var promise = deferred.promise;

                        var self = this
                        this.transmitting = true;
                        this._transmissionStatus();
                        this.socket = new WebSocket(this.url);
                        this.socket.addEventListener('open', function (e) {
                            self.transmitting = false;
                            self._transmissionStatus();
                            deferred.resolve("connected")
                            /*
                    if (callback) {
                        callback()
                    }
*/
                        });
                        this.socket.addEventListener('message', function (e) {
                            var asJson = angular.fromJson(e.data)
                            var replyId = asJson.id;
                            var histItem = self.socket_history[replyId]
                            self.transmitting = false;
                            self._transmissionStatus();
                            console.info(asJson)
                            if (angular.isUndefined(asJson.error)) {
                                $rootScope.$apply(histItem.defer.resolve(asJson.result)) //then(function(s){console.log("PRO ",s)})
                                //                        histItem.callback(histItem.scope, asJson.result);
                                //deferred.resolve(histItem) //.callback(histItem.scope, asJson.result);

                            } else {
                                $rootScope.$apply(histItem.defer.reject(asJson.error)) //then(function(s){console.log("PRO ",s)})
                                //                        histItem.onError(histItem.scope, asJson);
                                //deferred.reject(histItem) //.onError(histItem.scope, asJson);
                            }
                            //self.socket_history[replyId] = (function (){}());

                        });
                        return promise;
                    },
                    disconnect: function () {
                        this.socket.close();
                        this.transmitting = false;
                        this._transmissionStatus();
                        return this;
                    },
                    send: function (msg, scope, callback, onerror) {
                        console.info("SEND:", msg)
                        var _this = this;
                        this.transmitting = true;
                        this._transmissionStatus();
                        if (!this.socket) {
                            return this.connect().then(
                                function (histItem) {
                                    console.log("CONNECT SUCCESS", histItem)


                                },
                                function (histItem) {
                                    console.log("CONNECT ERROR", histItem)
                                }

                            ).then(function () {
                                console.log("opend und nu weg")
                                return _this.send(msg, scope);
                            })
                        } else if (this.socket) {
                            console.log("socket is open")
                            var deferred = $q.defer();
                            var promise = deferred.promise;
                            msg.id = this.socket_msg_id;
                            this.socket_history[msg.id] = {
                                id: msg.id,
                                defer: deferred,
                                scope: scope,
                                msg: msg
                            };
                            this.socket_msg_id++
                            this.socket.send(angular.toJson(msg))
                            return promise
                        }
                        //                return this;
                    },
                    isConnected: function () {
                        return this.socket ? true : false;
                    }
                }
            });

        angular.module("QvAngular")
            .service("qsClientService", function ($rootScope, $q, qvCommService, qGlobalRPCs) {
                var _this = this
                    // -------------------- onTransmissionStatusChange BEGIN---------------
                this.onTransmissionStatusChange = function (callback) {
                    qvCommService.setOnTransmissionStatus(callback)
                }
                // -------------------- onTransmissionStatusChange END  ---------------


                this.connect = function () {
                    return qvCommService.connect() //.then(callback)
                }

                // -------------------- getQvVersion BEGIN-------------------------
                this.getQvVersion = function () {
                    var QSVersion = qGlobalRPCs.QSVersion;
                    return qvCommService.send(QSVersion).then(function (data) {
                        return [data.qReturn, data]
                    });
                }
                // -------------------- getQvVersion END-------------------------

                // -------------------- getOSName BEGIN-------------------------
                this.getOSName = function () {
                    var OSName = qGlobalRPCs.OSName;
                    return qvCommService.send(OSName).then(function (data) {
                        return [data.qReturn, data]
                    });
                }
                // -------------------- getOSName END-------------------------

                // -------------------- getDocList BEGIN-------------------------

                this.getDocList = function () {
                    var GetDocList = qGlobalRPCs.GetDocList;
                    return qvCommService.send(GetDocList).then(function (data) {
                        return [data.qDocList, data]
                    });
                    //return deferred.promise;
                }
                // -------------------- getDocList END-------------------------

                // -------------------- openDoc BEGIN -------------------------

                this.openDoc = function (docId) {
                    var OpenDoc = qGlobalRPCs.OpenDoc;
                    OpenDoc.params.qDocName = docId;
                    return qvCommService.send(OpenDoc).then(function (data) {
                        return [data.qReturn, data]
                    });

                }
                // -------------------- openDoc END -------------------------


                // -------------------- getTablesAndKeys BEGIN -------------------------

                this.getTablesAndKeys = function (qHandle) {
                    var GetTablesAndKeys = qGlobalRPCs.GetTablesAndKeys;
                    GetTablesAndKeys.handle = qHandle;
                    return qvCommService.send(GetTablesAndKeys).then(function (data) {
                        //scope.q.qtr = angular.copy(data.qtr);
                        return [data.qtr, data]
                    });
                }
                // -------------------- getTablesAndKeys END  -------------------------


                // -------------------- getAppLayout BEGIN    -------------------------

                this.getAppLayout = function (qHandle) {
                    var GetAppLayout = qGlobalRPCs.GetAppLayout;
                    GetAppLayout.handle = qHandle;
                    return qvCommService.send(GetAppLayout).then(function (data) {
                        return [data.qLayout, data]
                    });
                }
                // -------------------- getAppLayout END      -------------------------

                // -------------------- getLayout BEGIN      ---------------------------
                this.getLayout = function (qHandle) {
                    var getLayout = qGlobalRPCs.GetLayout;
                    getLayout.handle = qHandle;
                    return qvCommService.send(getLayout).then(function (data) {
                        return [data.qLayout, data]
                    })
                }
                // -------------------- getLayout END        ---------------------------

                // -------------------- getHyperCube BEGIN   ---------------------------
                this.getHyperCube = function (query) {
                    var getHyperCube = qGlobalRPCs.getHyperCube;
                    getHyperCube.handle = query.qHandle;
                    getHyperCube.params[1][0].qHeight = query.qHeight;
                    getHyperCube.params[1][0].qWidth = query.qWidth;
                    getHyperCube.params[1][0].qTop = query.qTop;
                    return qvCommService.send(getHyperCube).then(function (data) {
                        console.log("HYPERCUBE", data)
                        return [{
                                qDataPages: data.qDataPages,
                                qHandle: query.qHandle
                            },
                            data]
                    })
                }
                // -------------------- getHyperCube END     ---------------------------

                // -------------------- dynamicHypercube BEGIN -------------------------

                this.dynamicHyperCube = function (params) {
                    /*
                    create a transient hypercube, according to the params
                    and directly receive the cubes content
                */
                    var createHyperCube = qGlobalRPCs.createHyperCube;
                    createHyperCube.handle = params.qHandle
                    createHyperCube.params[0].qHyperCubeDef.qDimensions[0].qDef.qFieldDefs[0] = params.dimension
                    //createHyperCube.params[0].qHyperCubeDef.qDimensions.push({qDef:{qFieldDefs :["Year"]}})
                    createHyperCube.params[0].qHyperCubeDef.qMeasures[0].qDef.qDef = params.measure
                    createHyperCube.params[0].qHyperCubeDef.qMeasures[0].qDef.qLabel = params.measure


                    createHyperCube.params[0].qHyperCubeDef.qSuppressZero = true;

                    return qvCommService.send(createHyperCube).then(function (data) {
                            console.log("hc = ", data)
                            return {
                                qHandle: data.qReturn.qHandle,
                                qWidth: params.width,
                                qHeight: params.height,
                                qTop: params.offset
                            }
                        }).then(this.getHyperCube)
                        //.then(function(data){return _this.getLayout(data.qHandle)})


                }
                // -------------------- dynamicHypercube END ---------------------------

                // -------------------- CreateFieldList BEGIN -------------------------
                this.createFieldList = function (qHandle) {
                    var CreateFieldList = qGlobalRPCs.CreateFieldList;
                    CreateFieldList.handle = qHandle;
                    return qvCommService.send(CreateFieldList).then(function (data) {
                            return data.qReturn.qHandle
                        }).then(this.getLayout)
                        /*.then(function (data) {
                    console.log("FIELDLIST", data);
                    return [data.qLayout,data]
                })*/
                }
                // -------------------- CreateFieldList END   -------------------------


                // -------------------- selectInCube BEGIN -------------------------
                this.selectInCube = function (qHandle, selectionIndex) {
                    var SelectHyperCubeValues = qGlobalRPCs.SelectHyperCubeValues;
                    SelectHyperCubeValues.handle = qHandle
                    SelectHyperCubeValues.params[2] = [selectionIndex]
                    return qvCommService.send(SelectHyperCubeValues).then(function (data) {
                        console.log("selected", data)
                        return [data.qSuccess, data]
                    })
                }
                // -------------------- selectInCube END -------------------------

            });
