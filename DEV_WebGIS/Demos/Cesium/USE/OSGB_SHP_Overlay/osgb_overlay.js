
// F:\JOBS\Design\Dev\Cesium_LOD\3d-tiles-samples-master\tilesets
// should start tile server first

var viewer = new Cesium.Viewer('cesiumContainer');

// set lighting to true
viewer.scene.globe.enableLighting = true;
viewer.scene.globe.depthTestAgainstTerrain = true;

// old create method. 20.6.8
// var cesiumTerrainProviderMeshes = new Cesium.CesiumTerrainProvider({
//     url: 'https://assets.agi.com/stk-terrain/v1/tilesets/world/tiles',
//     requestWaterMask: true,
//     requestVertexNormals: true
// });
// new
var cesiumTerrainProviderMeshes = Cesium.createWorldTerrain({
    requestWaterMask : true,
    requestVertexNormals : true
});
viewer.terrainProvider = cesiumTerrainProviderMeshes;



// event
var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection);
var ray, position1, cartographic1, mapPosition, lon, lat, height;
var mapPosition_terrain;
handler.setInputAction(function (event) {

    // gltf node and mesh pick
    var pick = viewer.scene.pick(event.endPosition);
    if (Cesium.defined(pick) && Cesium.defined(pick.node) && Cesium.defined(pick.mesh)) {
        console.log('node: ' + pick.node.name + '. mesh: ' + pick.mesh.name);
    }

   /*// 1 二维坐标，获取椭球体表面的经纬度坐标
    //https://blog.csdn.net/u012123612/article/details/78621498
    cartesian = viewer.camera.pickEllipsoid(event.endPosition, viewer.scene.globe.ellipsoid);
    cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    lng = Cesium.Math.toDegrees(cartographic.longitude);//经度值
    lat = Cesium.Math.toDegrees(cartographic.latitude);//纬度值
    mapPosition = {x: lng, y: lat, z: cartographic.height};//cartographic.height的值始终为零。*/

    // 2 地形表面的高度
    var ray = viewer.camera.getPickRay(event.endPosition);
    cartesian = viewer.scene.globe.pick(ray, viewer.scene);
    cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    lng = Cesium.Math.toDegrees(cartographic.longitude);//经度值
    lat = Cesium.Math.toDegrees(cartographic.latitude);//纬度值
    height = cartographic.height;//cartographic.height的值为地形高度。
    height = viewer.scene.globe.getHeight(cartographic); //height的值为地形高度。height结果与cartographic.height相差无几，注意：cartographic.height可以为0，也就是说，可以根据经纬度计算出高程。
    mapPosition_terrain = {x: lng, y: lat, z: height};
    console.log('椭球体坐标（lng:' + mapPosition_terrain.x + ',lat:' + mapPosition_terrain.y+ ',terrain_height:' + mapPosition_terrain.z);

    // 3 gltf等模型表面高度
    var scene = viewer.scene;
    if (scene.mode !== Cesium.SceneMode.MORPHING) {
        var pickedObject = scene.pick(event.endPosition);
        if (scene.pickPositionSupported && Cesium.defined(pickedObject) && pickedObject.node) {
            cartesian = viewer.scene.pickPosition(event.endPosition);
            if (Cesium.defined(cartesian)) {
                cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                var lng = Cesium.Math.toDegrees(cartographic.longitude);
                var lat = Cesium.Math.toDegrees(cartographic.latitude);
                height = cartographic.height;//模型高度
                // mapPosition = {x: lng, y: lat, z: height};
                console.log('gltf模型表面的的高度（lng:' + lng + ',lat:' + lat + 'height:' + height);
            }
        }
    }

    // 4 获取倾斜摄影模型的高度
    // ---------------------------------------------------------------------------------
    ray = viewer.scene.camera.getPickRay(event.endPosition);
    position1 = viewer.scene.globe.pick(ray, viewer.scene);
    cartographic1 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position1);
    var feature = viewer.scene.pick(event.endPosition);
    if (feature === undefined) {
        lon = Cesium.Math.toDegrees(cartographic1.longitude);
        lat = Cesium.Math.toDegrees(cartographic1.latitude);
        height = cartographic1.height;

        console.log('terrain:' + height);
    }
    else if (feature instanceof Cesium.Cesium3DTileFeature) {
        var cartesian = viewer.scene.pickPosition(event.endPosition);
        if (Cesium.defined(cartesian)) {
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            lng = Cesium.Math.toDegrees(cartographic.longitude);
            lat = Cesium.Math.toDegrees(cartographic.latitude);
            height = cartographic.height;//模型高度 } }
            console.log('osgb tiles height:' + height);
        }
    }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE); //, Cesium.ScreenSpaceEventType.LEFT_CLICK



// osgb control points add
var promise = viewer.dataSources.add(Cesium.GeoJsonDataSource.load('River_ControlPoint.json',{
    stroke: Cesium.Color.BLUE.withAlpha(0.3),
    fill: Cesium.Color.RED,
    strokeWidth:2
}));




// cordinate display
/*var displayPanel = new CesiumCordinateDisplay(viewer);
displayPanel.AddStatusPanelHTML();
displayPanel.InitialStatusPanel();
displayPanel.SetMouseMoveEvent();*/


// osgb 2 tiles set add
var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
    // note that this is the ip and endpoint
    url : 'http://10.33.168.94:8003/tilesets/DD_JX_RIVER' //DD_JX_RIVER，ZHD_ST_HJT
    // or url: Cesium.IonResource.fromAssetId(3836)
}));


tileset.readyPromise.then(function(tileset) {
    viewer.camera.viewBoundingSphere(tileset.boundingSphere, new Cesium.HeadingPitchRange(0, -0.5, 0));
    viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
});



// 天地图影像
viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({

    url: 'http://t0.tianditu.com/img_w/wmts?',
    layer: 'img',
    style: 'default',
    format: 'tile',
    tileMatrixSetID: 'w',
    credit: new Cesium.Credit('天地图全球影像'),
    maximumLevel: 18
}));









