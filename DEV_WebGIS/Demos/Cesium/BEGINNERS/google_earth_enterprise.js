// Add image from WMS 

var geeMetadata = new Cesium.GoogleEarthEnterpriseMetadata({
    url : 'http://www.earthenterprise.org/3d',
    proxy : new Cesium.DefaultProxy('/proxy/')
});

var viewer = new Cesium.Viewer('cesiumContainer', {
    imageryProvider : new Cesium.GoogleEarthEnterpriseImageryProvider({
        metadata : geeMetadata
    }),
    terrainProvider : new Cesium.GoogleEarthEnterpriseTerrainProvider({
        metadata : geeMetadata
    }),
    baseLayerPicker : false
});

// Start off looking at San Francisco.
viewer.camera.setView({
    destination: Cesium.Rectangle.fromDegrees(-123.0, 36.0, -121.7, 39.0)
});
