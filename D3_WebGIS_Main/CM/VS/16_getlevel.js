var viewer = new Cesium.Viewer('cesiumContainer', {
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    navigationHelpButton: false,
    timeline: false,
    animation: false
});

viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(112.52133465950095, 23.071194052564465, 1063.5910571697082),
    orientation: {
        heading: 0.9183320934226114,
        pitch: -0.2851308873567558,
        roll: 0.00200137740773787
    }
});

/*
viewer.imageryLayers.removeAll();


//天地图在线影像
var TDTimageryLayer = new Cesium.WebMapTileServiceImageryProvider({
    url: "http://{s}.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
    layer: "tdtImgBasicLayer",
    style: "default",
    subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
    format: "image/jpeg",
    tileMatrixSetID: "GoogleMapsCompatible",
    maximumLevel: 17,
    credit: "天地图",
    show: true
});
//天地图在线影像注记
var TDTimageryLabel = new Cesium.WebMapTileServiceImageryProvider({
    url: "http://{s}.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
    layer: "tdtImgBasicLayer",
    style: "default",
    subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
    format: "image/jpeg",
    tileMatrixSetID: "GoogleMapsCompatible",
    maximumLevel: 17,
    credit: "天地图影像注记",
    show: true
});

viewer.imageryLayers.addImageryProvider(TDTimageryLayer);
viewer.imageryLayers.addImageryProvider(TDTimageryLabel);*/

// ------------------------------------------------------------------------------------------------------





var cartographic = new Cesium.Cartographic();
var cartesian = new Cesium.Cartesian3();
var camera = viewer.scene.camera;
var ellipsoid = viewer.scene.mapProjection.ellipsoid;
var toolbar = document.getElementById('toolbar');
toolbar.innerHTML = '<div id="hud"></div>' +
    '<button type="button" class="cesium-button" id="h1">100km height</button>' +
    '<button type="button" class="cesium-button" id="h2">1000km height</button>' +
    '<button type="button" class="cesium-button" id="h3">3000km height</button>';

toolbar.setAttribute('style', 'background: rgba(42,42,42,0.9); border-radius: 5px;');

var hud = document.getElementById('hud');

viewer.clock.onTick.addEventListener(function(clock) {
    ellipsoid.cartesianToCartographic(camera.positionWC, cartographic);
    hud.innerHTML =
        'Lon: ' + Cesium.Math.toDegrees(cartographic.longitude).toFixed(3) + ' deg<br/>' +
        'Lat: ' + Cesium.Math.toDegrees(cartographic.latitude).toFixed(3) + ' deg<br/>' +
        'Alt: ' + (cartographic.height * 0.001).toFixed(1) + ' km';
});

function setHeightKm(heightInKilometers) {
    ellipsoid.cartesianToCartographic(camera.position, cartographic);
    cartographic.height = heightInKilometers * 1000;  // convert to meters
    ellipsoid.cartographicToCartesian(cartographic, cartesian);
    camera.position = cartesian;
}

document.getElementById('h1').addEventListener('click', function() {
    setHeightKm(100);
}, false);

document.getElementById('h2').addEventListener('click', function() {
    setHeightKm(1000);
}, false);

document.getElementById('h3').addEventListener('click', function() {
    setHeightKm(3000);
}, false);





