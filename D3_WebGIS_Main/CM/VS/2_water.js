var viewer = new Cesium.Viewer('cesiumContainer');

// set lighting to true
viewer.scene.globe.enableLighting = true;

var cesiumTerrainProviderMeshes = new Cesium.CesiumTerrainProvider({
    url: 'https://assets.agi.com/stk-terrain/v1/tilesets/world/tiles',
    requestWaterMask: true,
    requestVertexNormals: true
});
viewer.terrainProvider = cesiumTerrainProviderMeshes;

// setup alternative terrain providers
//..