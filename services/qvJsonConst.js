angular.module("QvAngular")
    .constant("qGlobalRPCs", {
        "GetDocList": {
            "handle": -1,
            "method": "GetDocList",
            "params": [],
            "id": -1,
            "jsonrpc": "2.0"
        },
        "QSVersion": {
            "handle": -1,
            "method": "QvVersion",
            "params": [],
            "id": -1,
            "jsonrpc": "2.0"
        },
        "OSName": {
            "handle": -1,
            "method": "OSName",
            "params": [],
            "id": -1,
            "jsonrpc": "2.0"
        },
        "OpenDoc": {
            "handle": -1,
            "method": "OpenDoc",
            "params": {
                "qDocName": "Equity Sales Analysis",
                "qUserName": "",
                "qPassword": "",
                "qSerial": ""
            }
        },
        "GetAppLayout": {
            "handle": -1,
            "method": "GetAppLayout",
            "params": [],
            "id": -1,
            "jsonrpc": "2.0"

        },
        "GetLayout": {
            "handle": -1,
            "method": "GetLayout",
            "params": [],
            "id": -1,
            "jsonrpc": "2.0"

        },

        "GetTablesAndKeys": {
            "handle": 1,
            "method": "GetTablesAndKeys",
            "params": [{
                    "qcx": 0,
                    "qcy": 0
                }, {
                    "qcx": 0,
                    "qcy": 0
                },
                2, true, false]

        },

        "CreateFieldList": {
            "method": "CreateSessionObject",
            "handle": 1,
            "params": [
                {
                    "qFieldListDef": {
                        "qShowSystem": false,
                        "qShowHidden": false,
                        "qShowSrcTables": true,
                        "qShowSemantic": true
                    },
                    "qInfo": {
                        "qId": "FieldList",
                        "qType": "FieldList"
                    }
        }
    ],
            "id": 37,
            "jsonrpc": "2.0"
        },

        "GetFieldDescriptions": {
            "handle": 1,
            "method": "GetFieldDescriptions",
            "params": []
        },
        "GetTableData": {
            "handle": 1,
            "method": "GetTableData",
            "params": {
                "qOffset": 0,
                "qRows": 100,
                "qSyntheticMode": false,
                "qTableName": ""
            }
        },

        "createHyperCube": {
            "method": "CreateSessionObject",
            "handle": 1,
            "params": [
                {
                    "qInfo": {
                        "qType": "Chart"
                    },

                    "qHyperCubeDef": {
                        "qDimensions": [
                            {
                                "qLibraryId": "",
                                "qDef": {
                                    "qFieldDefs": [
                            "OICA region"
                          ]

                                }
                      }
                    ],
                        "qMeasures": [
                            {
                                "qLibraryId": "",
                                "qDef": {
                                    "qLabel": "Cars sold",
                                    "qDef": "Sum([Car sales])"
                                }
                      }
                    ],
                        "qSuppressZero": false,
                        "qSuppressMissing": false
                        /*,
                        "qInitialDataFetch": [
                            {
                                "qTop": 0,
                                "qHeight": 100,
                                "qLeft": 0,
                                "qWidth": 2
                      }
                    ],*/
                    }
                }
              ]
        },

        "getHyperCube": {
            "method": "GetHyperCubeData",
            "handle": 2,
            "params": [
    "/qHyperCubeDef",
    [
                    {
                        "qTop": 0,
                        "qLeft": 0,
                        "qHeight": 99,
                        "qWidth": 99
      }
    ]
  ]
        },

        "getDimensionList": {
            "method": "GetHyperCubeData",
            "handle": 2,
            "params": []
        },

        "SelectHyperCubeValues": {
            "jsonrpc": "2.0",
            "method": "SelectHyperCubeValues",
            "handle": -1,
            "params": [
    "/qHyperCubeDef",
    0,
    [
     0
    ],
    true
  ]
        }
    })
