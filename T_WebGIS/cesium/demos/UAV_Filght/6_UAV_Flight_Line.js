/// <reference path="../Cesium/Cesium.js" />


// panel
$('#left-panel-link').panelslider();

$('#right-panel-link').panelslider({
    bodyClass: 'ps-active-right',
    clickClose: false, // Clicking outside this panel wont close it because this line
    onOpen: function () {
        console.log('right panel open');
    }
});

$('#close-panel-bt').click(function () {
    $.panelslider.close();
});

$('#left-panel, #right-panel').on('psBeforeOpen psOpen psBeforeClose psClose', function (e) {
    console.log(e.type, e.target.getAttribute('id'));
});



// cesium
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
    //shouldAnimate: true,
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

    ////用于渲染星空的SkyBox对象  
    //skyBox: new Cesium.SkyBox({
    //    sources: {
    //        positiveX: 'Cesium-1.7.1/Skybox/px.jpg',
    //        negativeX: 'Cesium-1.7.1/Skybox/mx.jpg',
    //        positiveY: 'Cesium-1.7.1/Skybox/py.jpg',
    //        negativeY: 'Cesium-1.7.1/Skybox/my.jpg',
    //        positiveZ: 'Cesium-1.7.1/Skybox/pz.jpg',
    //        negativeZ: 'Cesium-1.7.1/Skybox/mz.jpg'
    //    }
    //}),
  

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
var camera = scene.camera;
var canvas = scene.canvas;



// Load STK World Terrain
viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
    url: 'https://assets.agi.com/stk-terrain/world',
    requestWaterMask: true, // required for water effects
    requestVertexNormals: true // required for terrain lighting
});

// -----------------------------------------------------------------------------------




//设置镜头位置与方向  
camera.setView({
    // View rectangle with a top-down view
    //destination : Cesium.Rectangle.fromDegrees(west, south, east, north)
    destination: Cesium.Cartesian3.fromDegrees(116.3, 8.0, 8000000), //100000公里上空  
    orientation: {
        heading: Cesium.Math.toRadians(0),   // x. east, default value is 0.0 (north)
        pitch: Cesium.Math.toRadians(-90),    // y. default value (looking down)
        roll: Cesium.Math.toRadians(0)      // z. default value
        // Set position with an orientation using unit vectors.
        // direction : new Cesium.Cartesian3(-0.04231243104240401, -0.20123236049443421, -0.97862924300734),
        // up : new Cesium.Cartesian3(-0.47934589305293746, -0.8553216253114552, 0.1966022179118339)
    }
});


//让镜头飞行（动画）到某个地点和方向  
setTimeout(function () {
    camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(116.3, 12.0, 8000000),
        orientation: {
            heading: Cesium.Math.toRadians(15),
            pitch: Cesium.Math.toRadians(-75),
            roll: Cesium.Math.toRadians(-10)
        },
        duration: 3,//动画持续时间  
        complete: function ()//飞行完毕后执行的动作  
        {
            // post data
            addEntities(); // post data call back call
        }
    });
}, 1000);



// JQury post data  call back
function addEntities() {

    // uav line
    var orangeOutlined = viewer.entities.add({
        name: 'Orange line with black outline at height and following the surface',
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights([
            119.5220, 29.3460, 200,
			119.5041, 29.3320, 200,
			119.5041, 29.3320, 200,
			119.5041, 29.3320, 200,
			119.5041, 29.3321, 190,
			119.5041, 29.3321, 190,
			119.5042, 29.3322, 190,
			119.5042, 29.3324, 190,
			119.5043, 29.3325, 190,
			119.5044, 29.3326, 190,
			119.5044, 29.3327, 190,
			119.5045, 29.3329, 190,
			119.5046, 29.3330, 190,
			119.5047, 29.3332, 190,
			119.5047, 29.3333, 190,
			119.5048, 29.3335, 190,
			119.5049, 29.3336, 190,
			119.5050, 29.3338, 190,
			119.5051, 29.3339, 190,
			119.5052, 29.3340, 190,
			119.5053, 29.3342, 190,
			119.5053, 29.3343, 190,
			119.5054, 29.3345, 190,
			119.5055, 29.3346, 190,
			119.5056, 29.3348, 190,
			119.5057, 29.3349, 190,
			119.5057, 29.3350, 200,
			119.5058, 29.3352, 200,
			119.5059, 29.3353, 200,
			119.5060, 29.3355, 190,
			119.5060, 29.3356, 190,
			119.5061, 29.3357, 190,
			119.5062, 29.3359, 200,
			119.5063, 29.3360, 200,
			119.5064, 29.3362, 190,
			119.5064, 29.3363, 190,
			119.5065, 29.3365, 200,
			119.5066, 29.3366, 200,
			119.5067, 29.3367, 190,
			119.5067, 29.3369, 190,
			119.5068, 29.3370, 200,
			119.5069, 29.3372, 200,
			119.5070, 29.3373, 200,
			119.5071, 29.3374, 200,
			119.5071, 29.3376, 200,
			119.5072, 29.3377, 200,
			119.5073, 29.3378, 200,
			119.5074, 29.3380, 200,
			119.5074, 29.3381, 200,
			119.5075, 29.3383, 200,
			119.5076, 29.3384, 190,
			119.5077, 29.3385, 200,
			119.5078, 29.3387, 200,
			119.5078, 29.3388, 200,
			119.5079, 29.3390, 200,
			119.5080, 29.3391, 200,
			119.5081, 29.3393, 190,
			119.5082, 29.3394, 200,
			119.5083, 29.3395, 200,
			119.5083, 29.3397, 200,
			119.5084, 29.3398, 200,
			119.5085, 29.3399, 200,
			119.5086, 29.3401, 200,
			119.5086, 29.3402, 200,
			119.5087, 29.3404, 190,
			119.5088, 29.3405, 200,
			119.5089, 29.3406, 200,
			119.5090, 29.3408, 190,
			119.5090, 29.3409, 190,
			119.5091, 29.3411, 190,
			119.5092, 29.3412, 190,
			119.5093, 29.3413, 200,
			119.5094, 29.3415, 200,
			119.5095, 29.3416, 200,
			119.5095, 29.3417, 200,
			119.5096, 29.3419, 200,
			119.5097, 29.3420, 190,
			119.5098, 29.3421, 190,
			119.5099, 29.3423, 190,
			119.5100, 29.3424, 190,
			119.5101, 29.3425, 190,
			119.5101, 29.3427, 190,
			119.5102, 29.3428, 190,
			119.5103, 29.3429, 190,
			119.5104, 29.3430, 190,
			119.5105, 29.3432, 190,
			119.5106, 29.3433, 190,
			119.5107, 29.3434, 190,
			119.5108, 29.3435, 190,
			119.5109, 29.3436, 190,
			119.5110, 29.3438, 190,
			119.5111, 29.3439, 190,
			119.5112, 29.3440, 190,
			119.5113, 29.3442, 190,
			119.5114, 29.3443, 190,
			119.5115, 29.3444, 190,
			119.5116, 29.3445, 190,
			119.5117, 29.3447, 190,
			119.5117, 29.3448, 190,
			119.5118, 29.3449, 190,
			119.5119, 29.3451, 190,
			119.5120, 29.3452, 190,
			119.5121, 29.3453, 190,
			119.5122, 29.3454, 190,
			119.5123, 29.3456, 190,
			119.5124, 29.3457, 190,
			119.5125, 29.3458, 190,
			119.5126, 29.3460, 200,
			119.5127, 29.3461, 190,
			119.5128, 29.3462, 190,
			119.5129, 29.3463, 190,
			119.5130, 29.3465, 190,
			119.5131, 29.3466, 190,
			119.5132, 29.3467, 190,
			119.5133, 29.3469, 190,
			119.5134, 29.3470, 190,
			119.5135, 29.3471, 190,
			119.5136, 29.3473, 190,
			119.5136, 29.3474, 190,
			119.5137, 29.3475, 190,
			119.5138, 29.3476, 190,
			119.5139, 29.3478, 190,
			119.5140, 29.3479, 190,
			119.5141, 29.3480, 190,
			119.5142, 29.3482, 190,
			119.5143, 29.3483, 190,
			119.5144, 29.3484, 190,
			119.5145, 29.3486, 190,
			119.5146, 29.3487, 190,
			119.5147, 29.3488, 190,
			119.5148, 29.3489, 190,
			119.5149, 29.3491, 190,
			119.5150, 29.3492, 190,
			119.5151, 29.3493, 190,
			119.5151, 29.3495, 190,
			119.5152, 29.3496, 190,
			119.5153, 29.3497, 190,
			119.5154, 29.3498, 190,
			119.5155, 29.3500, 190,
			119.5156, 29.3501, 190,
			119.5157, 29.3502, 190,
			119.5158, 29.3503, 190,
			119.5159, 29.3505, 200,
			119.5160, 29.3506, 190,
			119.5161, 29.3507, 190,
			119.5162, 29.3509, 190,
			119.5163, 29.3510, 190,
			119.5164, 29.3511, 190,
			119.5165, 29.3512, 190,
			119.5166, 29.3514, 190,
			119.5167, 29.3515, 190,
			119.5167, 29.3516, 190,
			119.5168, 29.3518, 190,
			119.5169, 29.3519, 190,
			119.5170, 29.3520, 190,
			119.5171, 29.3522, 190,
			119.5172, 29.3523, 190,
			119.5173, 29.3524, 190,
			119.5174, 29.3525, 190,
			119.5175, 29.3527, 190,
			119.5176, 29.3528, 190,
			119.5177, 29.3529, 190,
			119.5178, 29.3531, 190,
			119.5179, 29.3532, 190,
			119.5180, 29.3533, 190,
			119.5181, 29.3534, 190,
			119.5182, 29.3536, 190,
			119.5182, 29.3537, 190,
			119.5183, 29.3538, 200,
			119.5184, 29.3540, 200,
			119.5185, 29.3541, 200,
			119.5186, 29.3542, 200,
			119.5186, 29.3544, 200,
			119.5187, 29.3545, 200,
			119.5188, 29.3546, 200,
			119.5189, 29.3548, 200,
			119.5190, 29.3549, 200,
			119.5190, 29.3550, 200,
			119.5191, 29.3552, 200,
			119.5192, 29.3553, 200
            ]),
            width: 5,
            material: new Cesium.PolylineOutlineMaterialProperty({
                color: Cesium.Color.ORANGE,
                outlineWidth: 2,
                outlineColor: Cesium.Color.BLACK
            })
        }
    });

    // start mark
    var redBox = viewer.entities.add({
        name: 'Red box with black outline',
        position: Cesium.Cartesian3.fromDegrees(119.5220, 29.3460, 200),
        box: {
            dimensions: new Cesium.Cartesian3(40.0, 30.0, 50.0),
            material: Cesium.Color.RED.withAlpha(0.5),
            outline: true,
            outlineColor: Cesium.Color.BLACK
        }
    });




    // 缩放到实体
    viewer.zoomTo(viewer.entities);
}


//显示坐标 
var handler = new Cesium.ScreenSpaceEventHandler(canvas);
handler.setInputAction(function (movement) {
    var cartesian = scene.camera.pickEllipsoid(movement.endPosition, ellipsoid); 
    var ellipsoid = scene.globe.ellipsoid; 
    if (cartesian) {
        //能获取，显示坐标
        var cartographic = ellipsoid.cartesianToCartographic(cartesian);
        var coords = 'Lng ' + Cesium.Math.toDegrees(cartographic.longitude).toFixed(2) +
            ', Lat ' + Cesium.Math.toDegrees(cartographic.latitude).toFixed(2) +
            ', Z ' + Math.ceil(viewer.camera.positionCartographic.height);
        document.getElementById('coords').innerHTML = coords;
        document.getElementById('coords').style.display = '';
    } else {
        //不能获取不显示
        document.getElementById('coords').style.display = 'none';
    }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);



