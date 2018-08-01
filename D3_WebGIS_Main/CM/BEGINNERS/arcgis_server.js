var viewer = new Cesium.Viewer('cesiumContainer');


// Add an ArcGIS MapServer imagery layer
var imageryLayers = viewer.imageryLayers;
imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
    url : 'https://nationalmap.gov.au/proxy/http://services.ga.gov.au/site_3/rest/services/Electricity_Infrastructure/MapServer'
}));

// Start off looking at Australia.
viewer.camera.setView({
    destination: Cesium.Rectangle.fromDegrees(114.591, -45.837, 148.970, -5.730)
});