var particleCanvas;

function getImage() {
    if (!Cesium.defined(particleCanvas)) {
        particleCanvas = document.createElement('canvas');
        particleCanvas.width = 20;
        particleCanvas.height = 20;
        var context2D = particleCanvas.getContext('2d');
        context2D.beginPath();
        context2D.arc(8, 8, 8, 0, Cesium.Math.TWO_PI, true);
        context2D.closePath();
        context2D.fillStyle = 'rgb(255, 255, 255)';
        context2D.fill();
    }
    return particleCanvas;
}
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

function computeModelMatrix(entity, time) {
    var position = Cesium.Property.getValueOrUndefined(entity.position, time, new Cesium.Cartesian3());
    if (!Cesium.defined(position)) {
        return undefined;
    }
    var orientation = Cesium.Property.getValueOrUndefined(entity.orientation, time, new Cesium.Quaternion());
    if (!Cesium.defined(orientation)) {
        var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position, undefined, new Cesium.Matrix4());
    } else {
        modelMatrix = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromQuaternion(orientation, new Cesium.Matrix3()), position, new Cesium.Matrix4());
    }
    return modelMatrix;
 }

function computeEmitterModelMatrix() {
    var hpr = Cesium.HeadingPitchRoll.fromDegrees(0.0, 180.0, 0.0, new Cesium.HeadingPitchRoll());
    var trs = new Cesium.TranslationRotationScale();
    trs.translation = Cesium.Cartesian3.fromElements(2.5, 4.0, 1.0, new Cesium.Cartesian3());
    trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, new Cesium.Quaternion());
    return Cesium.Matrix4.fromTranslationRotationScale(trs, new Cesium.Matrix4());
}

var particleSystem = viewer.scene.primitives.add(new Cesium.ParticleSystem({
    image :getImage(),
    startScale : 1.0,
    endScale : 1.0,
    life : 50.0,
    speed : 5.0,
    width : 5,
    height : 5,
    rate : 500.0,
    lifeTime : 16.0,
    modelMatrix : computeModelMatrix(entity, Cesium.JulianDate.now()),
    emitterModelMatrix : computeEmitterModelMatrix(),
    emitter: new Cesium.CircleEmitter(500.0)
}));