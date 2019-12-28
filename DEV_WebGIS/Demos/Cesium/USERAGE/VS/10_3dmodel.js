// https://cesiumjs.org/tutorials/3D-Models-Tutorial/

var viewer = new Cesium.Viewer('cesiumContainer');

var scene = viewer.scene;
//A modelMatrix is also provided to fromGltf to position and rotate the model.
var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
    Cesium.Cartesian3.fromDegrees(-75.62898254394531, 40.02804946899414, 0.0));
var model = scene.primitives.add(Cesium.Model.fromGltf({
    url: '../../Cesium/Apps/SampleData/models/CesiumGround/Cesium_Ground.gltf',
    modelMatrix: modelMatrix,
    scale: 200.0
}));

Cesium.when(model.readyPromise).then(function(model) {
    model.activeAnimations.addAll({
        loop : Cesium.ModelAnimationLoop.REPEAT,
        speedup : 0.5,
        reverse : true
    });
});

// usage of the upping : use the geocoder tool in the upper right to zoom to Exton, PA.
viewer.extend(Cesium.viewerCesiumInspectorMixin);


// Cesium 获取鼠标当前位置的模型高度，地形高度，OSGB高度，及其经纬度。
// https://blog.csdn.net/qq_40288344/article/details/79012572
var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection);
var ray, position1, cartographic1, lon, lat, height;
handler.setInputAction(function (event) {

    var pick = viewer.scene.pick(event.endPosition);
    if (Cesium.defined(pick) && Cesium.defined(pick.node) && Cesium.defined(pick.mesh)) {
        console.log('node: ' + pick.node.name + '. mesh: ' + pick.mesh.name);
    }




    /*// 1 二维坐标，获取椭球体表面的经纬度坐标
    //https://blog.csdn.net/u012123612/article/details/78621498
    var cartesian = viewer.camera.pickEllipsoid(event.endPosition, viewer.scene.globe.ellipsoid);
    var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    var lng = Cesium.Math.toDegrees(cartographic.longitude);//经度值
    var lat = Cesium.Math.toDegrees(cartographic.latitude);//纬度值
    var mapPosition = {x: lng, y: lat, z: cartographic.height};//cartographic.height的值始终为零。
    //console.log('椭球体坐标（lng:' + lng + ',lat:' + lat);

    // 2 地形表面的高度
    var ray = viewer.camera.getPickRay(event.endPosition);
    cartesian = viewer.scene.globe.pick(ray, viewer.scene);
    cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    lng = Cesium.Math.toDegrees(cartographic.longitude);//经度值
    lat = Cesium.Math.toDegrees(cartographic.latitude);//纬度值
    var mapPosition_terrain = {x: lng, y: lat, z: cartographic.height};//cartographic.height的值为地形高度。

    //height结果与cartographic.height相差无几，注意：cartographic.height可以为0，也就是说，可以根据经纬度计算出高程。
    var height = viewer.scene.globe.getHeight(cartographic);
    mapPosition_terrain = {x: lng, y: lat, z: height.height};//height的值为地形高度。*/
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
                var height = cartographic.height;//模型高度
                // mapPosition = {x: lng, y: lat, z: height};
                console.log('模型表面的的高度（lng:' + lng + ',lat:' + lat + 'height:' + height);
            }
        }
    }

    // 获取倾斜摄影模型的高度
    // ---------------------------------------------------------------------------------
    ray = viewer.scene.camera.getPickRay(event.endPosition);
    position1 = viewer.scene.globe.pick(ray, viewer.scene);
    cartographic1 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position1);
    var feature = viewer.scene.pick(event.endPosition);
    if (feature == undefined) {
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
            console.log('osgb:' + height);
        }
    }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE); //, Cesium.ScreenSpaceEventType.LEFT_CLICK

