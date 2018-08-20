/// <reference path="ObjLoader.js" />

window.onload = function onLoad() {
    var viewer = new Cesium.Viewer("cesiumContainer");

    // 人民英雄纪念碑
    ObjLoader.load("../../Data/models/Peoples/rmyx.obj").then(function (gltf) {
        showModel(gltf, [116.391402337129, 39.9031909, 0]);
    });

    // 天安门城楼
    ObjLoader.load("../../Data/models/TianAnMen/tiananmen-cl.obj").then(function (gltf) {
        showModel(gltf, [116.39121465, 39.9073865, 0.0]);
    }, showError);

    function showModel(gltf, position) {
        var center = Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2])
        var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);

        var model = new Cesium.Model({
            gltf: gltf, 
            modelMatrix: modelMatrix,
            scene: viewer.scene,
            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
        });
        viewer.scene.primitives.add(model);

        console.log(gltf);
    }

    function showError(err) {
        alert(err);
    }


    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(116.391402337129, 39.9031909, 1000)
    });
}