
// 三维WebGIS底图


// 影像底图
var imageryLayers;
var dataSources;
var entities;
var scene;
var viewer;



$(function () {

    // ArcGIS 影像
    var earth = new Cesium.ArcGisMapServerImageryProvider({
        url: 'http://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer'
    });
    viewer = new Cesium.Viewer('cesiumContainer', {
        vrButton: true, infoBox: false, selectionIndicator: false,
        terrainExaggeration: 1.0,
        //creditContainer: 'bukejian',
        baseLayerPicker: false,
        navigationHelpButton: false,
        shadows: false,
        terrainShadows: true,
        fullscreenElement: 'cesiumContainer',
        imageryProvider: earth
    });
    viewer.extend(Cesium.viewerCesiumNavigationMixin, {});

    // 地形数据
    viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
        url: 'https://assets.agi.com/stk-terrain/world',
        requestWaterMask: true, // required for water effects
        requestVertexNormals: true // required for terrain lighting
    });

    // 要素图层， WMS服务
    var tdturl = "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg"
    var tdt = new Cesium.WebMapTileServiceImageryProvider({
        url: tdturl, layer: "tdtlayer",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible"
    });
    viewer.imageryLayers.addImageryProvider(tdt);

    
    imageryLayers = viewer.imageryLayers;
    dataSources = viewer.dataSources;
    entities = viewer.entities;
    scene = viewer.scene;
});


