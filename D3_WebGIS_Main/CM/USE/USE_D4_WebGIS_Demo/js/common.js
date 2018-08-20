requirejs.config({
    waitSeconds : 60,
    paths : {
        Cesium : '../Build/Cesium/Cesium',
        Zlib : '../Build/Cesium/Workers/zlib.min',
        jquery : "lib/jquery.min",
        underscore : "lib/underscore-min.1.4.4",
        backbone : "lib/backbone-min",
        Config : 'Config',
        bootstrapTree : 'lib/bootstrap-treeview',
        iScroll : 'lib/iscroll',
        Tabs : 'views/tabs',
        dropdown : 'views/dropdown'
    },
    shim : {
        underscore : {
            deps : [],
            exports : "_"
        },
        backbone : {
            deps : [ "jquery", "underscore" ],
            exports : "Backbone"
        },
        Cesium: {
            exports: 'Cesium'
        },
        Zlib : {
            exports : 'Zlib'
        },
        bootstrapTree : {
            exports : 'bootstrapTree'
        },
        iScroll : {
        	exports : 'iScroll'
        },
        Tabs : {
        	exports : 'Tabs',
        	deps : ['jquery']
        },
        dropdown : {
        	exports : 'dropdown',
        	deps : ['jquery']
        }

    }
});