
// https://github.com/kaktus40/Cesium-GeoserverTerrainProvider

/*var canvas = document.getElementById('cesiumContainer');
var scene = new Cesium.Scene(canvas);
var primitives = scene.primitives;
var globe = new Cesium.Globe(Cesium.Ellipsoid.WGS84);
scene.globe=globe;*/

var terrainProvider = new Cesium.CesiumTerrainProvider({ //GeoserverTerrainProvider
    // M1 Geoserver
    // url : "http://10.33.168.159:8080/geoserver/weng_test/wms?transparent=true",
    // layerName: "QTJ_TERRAIN_201611",
    // styleName:"grayToColor",
    // hasWaterMask:true,
    // hasVertexNormals:true

    // M2 Tomcat
    // tomcat published terrain tile service and data pleased in LIBS/Data/ directory
    //url : '../../LIBS/Data/DEM_TILE'


    // M3 node.js Server Method
    // F:\JOBS\Design\Dev\Cesium_LOD\3d-tiles-samples-master\tilesets
    // should start tile server first, heightmap-1.0
    url: "http://10.33.168.242:8003/tilesets/testtiles" //QINGDAO_Terrain14


    // M5 Default
    // url : 'https://assets.agi.com/stk-terrain/v1/tilesets/world/tiles',
    // //请求水波纹效果
    //requestWaterMask: true

});


/*globe.terrainProvider = terrainProvider;*/
var viewer = new Cesium.Viewer("cesiumContainer",{
    baseLayerPicker:false,
    terrainProvider:terrainProvider
});

/*
var hand = new Cesium.ScreenSpaceEventHandler(canvas);
// return altitude with double click in console.log!!
hand.setInputAction(
    function (movement) {
        if(movement.position != null) {
            var cartesian = scene.camera.pickEllipsoid(movement.position, ellipsoid);
            if (cartesian) {
                var cartographic = ellipsoid.cartesianToCartographic(cartesian);
                cartographic.height=globe.getHeight(cartographic);
                console.log("lat= "+(cartographic.latitude*180/Math.PI)+"°; long="+(cartographic.longitude*180/Math.PI)+"°; altitude="+cartographic.height+" meters")
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);*/



// Cesium解决按住滚轮旋转时进入地下的问题
var x =10;

viewer.clock.onTick.addEventListener(function () {
    setMinCamera();
});
// 判断当相机的高度小于x时，相机设置最小的角度
var setMinCamera = function () {
    if(viewer.camera.positionCartographic.height < x)
    {
        viewer.camera.positionCartographic.height = x;
        var ellipsoid = viewer.scene.globe.ellipsoid;
        var center = ellipsoid.cartographicToCartesian(viewer.camera.positionCartographic);
        viewer.camera.setView({
            destination: center, // 设置位置
            orientation: {
                heading: viewer.camera.heading, // 方向
                pitch: Cesium.Math.toRadians(0), // 倾斜角度
                roll: viewer.camera.roll
            }
        })
    }
}