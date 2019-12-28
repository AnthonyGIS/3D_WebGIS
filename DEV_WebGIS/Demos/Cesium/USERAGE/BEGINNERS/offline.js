// This is an example of using Cesium "Offline", meaning disconnected from the
// external Internet.  It must still be served from a local web server, but
// does not rely on any outside resources or services.  For more info, see:
// https://github.com/AnalyticalGraphicsInc/cesium/wiki/Offline-Guide

var viewer = new Cesium.Viewer('cesiumContainer', {
    imageryProvider : Cesium.createTileMapServiceImageryProvider({
        url : Cesium.buildModuleUrl('../../LIBS/Cesium/Assets/Textures/NaturalEarthII')
    }),
    baseLayerPicker : false,
    geocoder : false
});
