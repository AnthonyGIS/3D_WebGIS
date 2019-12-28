
var viewer = new Cesium.Viewer('cesiumContainer', {

    animation: false,//是否创建动画小器件，左下角仪表  
    baseLayerPicker: false,//是否显示图层选择器  
    fullscreenButton: false,//是否显示全屏按钮  
    geocoder: false,//是否显示geocoder小器件，右上角查询按钮  
    homeButton: false,//是否显示Home按钮  
    infoBox: false,//是否显示信息框  
    sceneModePicker: false,//是否显示3D/2D选择器  
    selectionIndicator: false,//是否显示选取指示器组件  
    timeline: false,//是否显示时间轴  
    navigationHelpButton: false,//是否显示右上角的帮助按钮  
    scene3DOnly: true,//如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源  
    clock: new Cesium.Clock(),//用于控制当前时间的时钟对象  
    selectedImageryProviderViewModel: undefined,//当前图像图层的显示模型，仅baseLayerPicker设为true有意义  
    imageryProviderViewModels: Cesium.createDefaultImageryProviderViewModels(),//可供BaseLayerPicker选择的图像图层ProviderViewModel数组  
    selectedTerrainProviderViewModel: undefined,//当前地形图层的显示模型，仅baseLayerPicker设为true有意义  
    terrainProviderViewModels: Cesium.createDefaultTerrainProviderViewModels(),//可供BaseLayerPicker选择的地形图层ProviderViewModel数组

    //imageryProvider: new Cesium.OpenStreetMapImageryProvider({
    //    credit: '',
    //    url: '//192.168.0.89:5539/planet-satellite/'
    //}),//图像图层提供者，仅baseLayerPicker设为false有意义

    terrainProvider: new Cesium.EllipsoidTerrainProvider(),//地形图层提供者，仅baseLayerPicker设为false有意义  
    skyBox: new Cesium.SkyBox({
        sources: {
            positiveX: 'Cesium-1.7.1/Skybox/px.jpg',
            negativeX: 'Cesium-1.7.1/Skybox/mx.jpg',
            positiveY: 'Cesium-1.7.1/Skybox/py.jpg',
            negativeY: 'Cesium-1.7.1/Skybox/my.jpg',
            positiveZ: 'Cesium-1.7.1/Skybox/pz.jpg',
            negativeZ: 'Cesium-1.7.1/Skybox/mz.jpg'
        }
    }),//用于渲染星空的SkyBox对象  
    fullscreenElement: document.body,//全屏时渲染的HTML元素,  
    useDefaultRenderLoop: true,//如果需要控制渲染循环，则设为true  
    targetFrameRate: undefined,//使用默认render loop时的帧率  
    showRenderLoopErrors: false,//如果设为true，将在一个HTML面板中显示错误信息  
    automaticallyTrackDataSourceClocks: true,//自动追踪最近添加的数据源的时钟设置  
    contextOptions: undefined,//传递给Scene对象的上下文参数（scene.options）  
    sceneMode: Cesium.SceneMode.SCENE3D,//初始场景模式  
    mapProjection: new Cesium.WebMercatorProjection(),//地图投影体系  
    dataSources: new Cesium.DataSourceCollection()
    //需要进行可视化的数据源的集合  
});

var scene = viewer.scene;
var canvas = viewer.canvas;
var clock = viewer.clock;
var camera = viewer.scene.camera;
var entities = viewer.entities;

//加快时钟的运行  
clock.multiplier = 0.1 * 60 * 60;
//阳光照射区域高亮  
scene.globe.enableLighting = true;





//设置镜头位置与方向  
camera.setView({
    //镜头的经纬度、高度。镜头默认情况下，在指定经纬高度俯视（pitch=-90）地球  
    position: Cesium.Cartesian3.fromDegrees(116.3, 39.9, 100000000),//北京100000公里上空  
    //下面的几个方向正好反映默认值  
    heading: Cesium.Math.toRadians(0),
    pitch: Cesium.Math.toRadians(-90),
    roll: Cesium.Math.toRadians(0)
});



//让镜头飞行（动画）到某个地点和方向  
setTimeout(function () {
    camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(116, 15, 6000000),
        orientation: {
            heading: Cesium.Math.toRadians(-15),
            pitch: Cesium.Math.toRadians(-65),
            roll: Cesium.Math.toRadians(0)
        },
        duration: 3,//动画持续时间  
        complete: function ()//飞行完毕后执行的动作  
        {
            addEntities();
        }
    });
}, 1000);


//监听键盘事件，用于平移或者旋转镜头  
var ellipsoid = scene.globe.ellipsoid;
canvas.onclick = function () {
    canvas.focus();
};
var flags = {
    looking: false,
    rotateLeft: false,
    rotateRight: false,
    moveUp: false,
    moveDown: false,
    moveLeft: false,
    moveRight: false
};

var handler = new Cesium.ScreenSpaceEventHandler(canvas);
function getFlagForKeyCode(keyCode) {
    switch (keyCode) {
        case 'W'.charCodeAt(0): //向下平移镜头  
            return 'moveDown';
        case 'S'.charCodeAt(0): //向上平移镜头  
            return 'moveUp';
        case 'A'.charCodeAt(0): //向右平移镜头  
            return 'moveRight';
        case 'D'.charCodeAt(0): //向左平移镜头  
            return 'moveLeft';
        case 'Q'.charCodeAt(0): //向右旋转镜头  
            return 'rotateRight';
        case 'E'.charCodeAt(0): //向左旋转镜头  
            return 'rotateLeft';
        default:
            return undefined;
    }
}
document.addEventListener('keydown', function (e) {
    var flagName = getFlagForKeyCode(e.keyCode);
    if (typeof flagName !== 'undefined') {
        flags[flagName] = true;
    }
}, false);
document.addEventListener('keyup', function (e) {
    var flagName = getFlagForKeyCode(e.keyCode);
    if (typeof flagName !== 'undefined') {
        flags[flagName] = false;
    }
}, false);
viewer.clock.onTick.addEventListener(function (clock) {
    var cameraHeight = ellipsoid.cartesianToCartographic(camera.position).height;
    var moveRate = cameraHeight / 100.0;

    if (flags.rotateLeft) {
        camera.rotateLeft(0.01);
    }
    if (flags.rotateRight) {
        camera.rotateRight(0.01);
    }
    if (flags.moveUp) {
        camera.moveUp(moveRate);
    }
    if (flags.moveDown) {
        camera.moveDown(moveRate);
    }
    if (flags.moveLeft) {
        camera.moveLeft(moveRate);
    }
    if (flags.moveRight) {
        camera.moveRight(moveRate);
    }
});




/** 
 * 添加实体 
 */
function addEntities() {

    /** 
     * 根据偏移量计算目标点经纬度 
     * @param {} start  起始点经纬度数组，单位度 
     * @param {} offset 东北方向的偏移量，单位米 
     * @param {} 目标点经纬度数组，单位度 
     */
    function offsetToLongLat(start, offset) {
        var er = 6378137;
        var lat = parseFloat(start[1]);
        var lon = parseFloat(start[0]);
        var dn = parseFloat(offset[1]);
        var de = parseFloat(offset[0]);

        dLat = dn / er;
        var pi = Math.PI;
        var dLon = de / (er * Math.cos(pi * lat / 180));
        return [
            lon + dLon * 180 / pi, lat + dLat * 180 / pi
        ];
    }
    /** 
     * 通过绘制三角形模拟卫星光束效果 
     * @param {} entities 实体集 
     * @param {} stltPos 卫星三维坐标数组 
     * @param {} points 地面点 
     * @param {} color CSS颜色代码，例如#FF0000 
     */
    function lightShinePolygon(entities, stltPos, points, color) {
        for (var i = 0; i < points.length; i += 2) {
            var array = [
                stltPos[0], stltPos[1], stltPos[2], points[i], points[i + 1], 0
            ];
            if (i + 2 == points.length) {
                array.push(points[0]);
                array.push(points[1]);
            }
            else {
                array.push(points[i + 2]);
                array.push(points[i + 3]);
            }
            array.push(0);
            entities.add({
                polygon: {
                    hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(array),
                    perPositionHeight: true,
                    outline: false,
                    material: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(color), .1)
                }
            });
        }
    }

    //卫星一  
    {
        var stltPos = [
            110.0, 40.0, 2500000
        ];
        entities.add({
            position: Cesium.Cartesian3.fromDegrees.apply(this, stltPos),
            billboard: {
                image: 'images/satellite-1.png',
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM, //垂直方向位置计算基准设为底部，默认中心  
                width: 92,
                height: 36
            }
        });
        //一个多边形覆盖范围  
        {
            var color = '#FF0000';
            //模拟光照效果的若干多边形  
            var points = [
                100, 48, 110, 40, 115, 40, 120, 43, 120, 55
            ];
            lightShinePolygon(entities, stltPos, points, color);
            //地面多边形  
            entities.add({
                polygon: {
                    hierarchy: Cesium.Cartesian3.fromDegreesArray(points),
                    outline: true,
                    outlineColor: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(color), .4),
                    material: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(color), .3)
                }
            });
        }

        //一个圆形覆盖范围  
        {
            var r = 600000;//半径  
            var color = '#0000FF';
            //圆心  
            var ecLong = 120.0;
            var ecLat = 33.0;
            var ec = Cesium.Cartesian3.fromDegrees(ecLong, ecLat, 0);
            //模拟光照效果的若干多边形  
            var points = [];
            for (var i = 0; i < 360; i += 30) {
                var coord = offsetToLongLat([ ecLong, ecLat], [Math.cos(Math.PI * i / 180) * r, Math.sin(Math.PI * i / 180) * r ]);
                points.push(coord[0]);
                points.push(coord[1]);
            }
            lightShinePolygon(entities, stltPos, points, color);
            //圆  
            viewer.entities.add({
                position: ec,
                ellipse: {
                    semiMinorAxis: r,
                    semiMajorAxis: r,
                    height: 0.0,
                    outline: true,
                    outlineColor: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(color), .4),
                    material: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(color), .3)
                }
            });
        }

    }//卫星一 end

}





