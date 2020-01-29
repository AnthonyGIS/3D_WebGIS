//飞机飞行 https://blog.csdn.net/UmGsoil/article/details/74923013

var viewer = new Cesium.Viewer('cesiumContainer');
var canvas = viewer.canvas;
viewer._cesiumWidget._creditContainer.style.display="none";


canvas.setAttribute('tabindex', '0'); // 将焦点放在画布上
//如果点击就获取画布焦点
canvas.addEventListener('click', function () {
    canvas.focus();
});
canvas.focus();

//飞行路径的位置
var pathPosition = new Cesium.SampledPositionProperty();
//添加飞机飞行路径
var entityPath = viewer.entities.add({
    position: pathPosition,
    name: 'path',
    path: {
        show: true,
        leadTime: 0,
        trailTime: 60,
        width: 10,
        resolution: 1,
        material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.3,
            color: Cesium.Color.PALEGOLDENROD
        })
    }
});

var camera = viewer.camera;
var controller = viewer.scene.screenSpaceCameraController;
var r = 0;
var center = new Cesium.Cartesian3();//中心点
var hpRoll = new Cesium.HeadingPitchRoll();//机身模型的偏移参数
var hpRange = new Cesium.HeadingPitchRange();//相机模型的偏移参数
var speed = 10;
var deltaRadians = Cesium.Math.toRadians(3.0);//默认按一下偏移3度
var position = Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706, 5000.0);//飞机位置
var speedVector = new Cesium.Cartesian3();//速度向量
var fixedFrameTransform = Cesium.Transforms.localFrameToFixedFrameGenerator('north', 'west');//生成一个由两个参考系生成的矩阵

//添加模型
var planePrimitive = viewer.scene.primitives.add(Cesium.Model.fromGltf({
    //这里需要把模型路径改下(如果你用的还是HelloWord.html的话就用这个,不是的话请自行修改)
    url: '../../Cesium//Apps/SampleData/models/CesiumAir/Cesium_Air.glb',
    modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(position, hpRoll, Cesium.Ellipsoid.WGS84, fixedFrameTransform),
    minimumPixelSize: 128
}));

//动画播放
planePrimitive.readyPromise.then(function (model) {
    // 以半速循环动画
    model.activeAnimations.addAll({
        speedup: 0.5,
        loop: Cesium.ModelAnimationLoop.REPEAT
    });

    //r=2*max(模型的半径，相机的最近距离)
    r = 2.0 * Math.max(model.boundingSphere.radius, camera.frustum.near);
    //镜头最近距离
    controller.minimumZoomDistance = r * 0.5;
    //计算center位置(也为下面的镜头跟随提供了center位置)
    Cesium.Matrix4.multiplyByPoint(model.modelMatrix, model.boundingSphere.center, center);
    //相机偏移角度
    var heading = Cesium.Math.toRadians(230.0);
    var pitch = Cesium.Math.toRadians(-20.0);
    hpRange.heading = heading;
    hpRange.pitch = pitch;
    hpRange.range = r * 50.0;
    //固定相机
    camera.lookAt(center, hpRange);
});

//键盘监听
document.addEventListener('keydown', function (e) {
    switch (e.keyCode) {
        case 40:
            if (e.shiftKey) {
                // 按住shift加下箭头减速
                speed = Math.max(--speed, 1);
            } else {
                // 直接按下箭头降低角度
                hpRoll.pitch -= deltaRadians;
                if (hpRoll.pitch < -Cesium.Math.TWO_PI) {
                    hpRoll.pitch += Cesium.Math.TWO_PI;
                }
            }
            break;
        case 38:
            if (e.shiftKey) {
                // 按住shift加上箭头加速
                speed = Math.min(++speed, 100);
            } else {
                // 直接按上箭头抬高角度
                hpRoll.pitch += deltaRadians;
                if (hpRoll.pitch > Cesium.Math.TWO_PI) {
                    hpRoll.pitch -= Cesium.Math.TWO_PI;
                }
            }
            break;
        case 39:
            if (e.shiftKey) {
                // 飞机本身向右旋转
                hpRoll.roll += deltaRadians;
                if (hpRoll.roll > Cesium.Math.TWO_PI) {
                    hpRoll.roll -= Cesium.Math.TWO_PI;
                }
            } else {
                // 向右飞行
                hpRoll.heading += deltaRadians;
                if (hpRoll.heading > Cesium.Math.TWO_PI) {
                    hpRoll.heading -= Cesium.Math.TWO_PI;
                }
            }
            break;
        case 37:
            if (e.shiftKey) {
                // 飞机本身向左旋转
                hpRoll.roll -= deltaRadians;
                if (hpRoll.roll < 0.0) {
                    hpRoll.roll += Cesium.Math.TWO_PI;
                }
            } else {
                // 向左飞行
                hpRoll.heading -= deltaRadians;
                if (hpRoll.heading < 0.0) {
                    hpRoll.heading += Cesium.Math.TWO_PI;
                }
            }
            break;
        default:
    }
});

var headingSpan = document.getElementById('heading');
var pitchSpan = document.getElementById('pitch');
var rollSpan = document.getElementById('roll');
var speedSpan = document.getElementById('speed');
var fromBehind = document.getElementById('fromBehind');

//给左边的通知栏更新数据同时刷新飞机位置(这里也是个1ms一次的回调)
viewer.scene.preRender.addEventListener(function (scene, time) {
    headingSpan.innerHTML = Cesium.Math.toDegrees(hpRoll.heading).toFixed(1);
    pitchSpan.innerHTML = Cesium.Math.toDegrees(hpRoll.pitch).toFixed(1);
    rollSpan.innerHTML = Cesium.Math.toDegrees(hpRoll.roll).toFixed(1);
    speedSpan.innerHTML = speed.toFixed(1);

    //选择的笛卡尔分量Cartesian3.UNIT_X（x轴单位长度）乘以一个标量speed/10，得到速度向量speedVector
    speedVector = Cesium.Cartesian3.multiplyByScalar(Cesium.Cartesian3.UNIT_X, speed / 10, speedVector);
    //飞机的模型矩阵与速度向量speedVector相乘，得到position
    position = Cesium.Matrix4.multiplyByPoint(planePrimitive.modelMatrix, speedVector, position);
    //添加一个路径模型(就是白色的尾气)
    pathPosition.addSample(Cesium.JulianDate.now(), position);
    //飞机位置+旋转角度+地球+坐标矩阵=飞机模型矩阵
    Cesium.Transforms.headingPitchRollToFixedFrame(position, hpRoll, Cesium.Ellipsoid.WGS84, fixedFrameTransform, planePrimitive.modelMatrix);

    if (fromBehind.checked) {
        // 镜头跟随
        Cesium.Matrix4.multiplyByPoint(planePrimitive.modelMatrix, planePrimitive.boundingSphere.center, center);
        hpRange.heading = hpRoll.heading;
        hpRange.pitch = hpRoll.pitch;
        camera.lookAt(center, hpRange);
    }
});
