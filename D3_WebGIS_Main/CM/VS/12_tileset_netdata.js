
// F:\JOBS\Design\Dev\Cesium_LOD\3d-tiles-samples-master\tilesets
// should start tile server first


// Get your own Bing Maps API key at https://www.bingmapsportal.com, prior to publishing your Cesium application:
Cesium.BingMapsApi.defaultKey = 'put your API key here';


// Construct the default list of terrain sources.
var terrainModels = Cesium.createDefaultTerrainProviderViewModels();
// Construct the viewer with just what we need for this base application
var viewer = new Cesium.Viewer('cesiumContainer', {
    animation:false,
    vrButton:true,
    sceneModePicker:false,
    infoBox:true,
    scene3DOnly:true,
    terrainProviderViewModels: terrainModels,
    selectedTerrainProviderViewModel: terrainModels[1]  // Select STK high-res terrain
});


// No depth testing against the terrain to avoid z-fighting
viewer.scene.globe.depthTestAgainstTerrain = false;
// Add credit to Bentley
viewer.scene.frameState.creditDisplay.addDefaultCredit(new Cesium.Credit('Cesium 3D Tiles produced by Bentley ContextCapture', 'Resources/logoBentley.png', 'http://www.bentley.com/'));
// Bounding sphere
var boundingSphere = new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(103.703709, 30.83011853, 964.5101392), 1557.006273);
// Override behavior of home button
viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function(commandInfo) {
    // Fly to custom position
    viewer.camera.flyToBoundingSphere(boundingSphere);
    // Tell the home button not to do anything
    commandInfo.cancel = true;
});

// Set custom initial position
viewer.camera.flyToBoundingSphere(boundingSphere, {duration: 0});
// Add tileset. Do not forget to reduce the default screen space error to 2
var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
    // note that this is the ip and endpoint
    url: 'http://10.33.168.159:8003/tilesets/3D_Tiles_Net_Demo/Production_1.json',
    // or url: Cesium.IonResource.fromAssetId(3836)
    maximumScreenSpaceError: 2,
    maximumNumberOfLoadedTiles: 1000
}));

/*
tileset.readyPromise.then(function(tileset) {
    viewer.camera.viewBoundingSphere(tileset.boundingSphere, new Cesium.HeadingPitchRange(0, -0.5, 0));
    viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
});
*/
