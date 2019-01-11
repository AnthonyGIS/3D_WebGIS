// https://cesiumjs.org/tutorials/3D-Models-Tutorial/

var viewer = new Cesium.Viewer('cesiumContainer');


var entity = viewer.entities.add({
    // Load the Cesium plane model to represent the entity
    model : {
        uri : '../../Cesium/Apps/SampleData/models/CesiumAir/Cesium_Air.gltf',
        minimumPixelSize : 64
    },
    position : Cesium.Cartesian3.fromDegrees(-112.110693, 36.0994841, 1000.0)
});
viewer.trackedEntity = entity;




















