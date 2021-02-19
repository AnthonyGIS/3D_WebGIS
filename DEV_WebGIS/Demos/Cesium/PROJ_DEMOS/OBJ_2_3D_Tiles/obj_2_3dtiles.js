// REF:
// https://www.cnblogs.com/HandyLi/p/11113030.html
// 20.6.8

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkYTgyZmMzMC0xM2UzLTQyZjYtODVkYi0yNGYyNjk2ZDk4YmIiLCJpZCI6Mzc2MDYsImlhdCI6MTYwNTI0OTMwM30._tGGnG1gO-9KO6oRm3yFeGQ6l3E-ragZG0Wv5hmzRtM';

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
    /*imageryProvider : Cesium.createWorldImagery({
        style : Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS
    }),*/
    baseLayerPicker : false,
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

// 黑夜亮灯效果
/*scene.globe.enableLighting = true //必须开启光照效果，
var layer = viewer.scene.imageryLayers.addImageryProvider(
    new Cesium.SingleTileImageryProvider({
        url: 'img/2012c_satellite_night.jpg'
    })
)
layer.dayAlpha = 0.0 //白天图层透明值
layer.nightAlpha = 1.0 //夜晚图层透明值
layer.brightness = 3.5 //图层发光亮度*/

// set lighting to true
scene.globe.enableLighting = false;  // 使用黑夜、白天效果
scene.globe.depthTestAgainstTerrain = true;

// add terrain
var cesiumTerrainProviderMeshes = Cesium.createWorldTerrain({
    requestWaterMask : true,
    requestVertexNormals : true
});
viewer.terrainProvider = cesiumTerrainProviderMeshes;


// osgb 2 tiles set add
var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
    // note that this is the ip and endpoint
    url: './Cesium3DTiles/assert_id_40866/tileset.json'   // local tileset
    // url: './Cesium3DTiles/Hierarchy/BatchTableHierarchy/tileset.json'   // local tileset
    // url: './Cesium3DTiles/out/BatchedTilesets/tileset.json'
    // url: Cesium.IonResource.fromAssetId(40866)            // cesium io
    // the following should run: E:\Projs\tasks\200605_3dtiles\lib_test
    // url: 'http://localhost:8003/tilesets/TilesetWithDiscreteLOD/tileset.json'  // Tileset With Discrete LOD (come from 3d-tiles-samples) TilesetWithDiscreteLOD、TilesetWithExpiration
}));

function  initialScreenDisplay() {
    var displayPanel = new CesiumCoordinateDisplay(viewer);
    displayPanel.AddStatusPanelHTML();
    displayPanel.InitialStatusPanel();
    displayPanel.SetMouseMoveEvent();
}

// load ready
tileset.readyPromise.then(function(tileset) {
    console.log('entered tileset ready.');

    var height = -30;　　//根据地形设置调整高度
    var longitude = 120.16;
    var latitude = 30.215;
    height = 60.38590702090875;
    var heading = 2;

    //贴地显示
    var cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
    var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
    var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height + height);
    var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
    tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);

    // 指定经纬高调整模型位置
    var position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
    var mat = Cesium.Transforms.eastNorthUpToFixedFrame(position);
    var rotationX = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(heading)));
    Cesium.Matrix4.multiply(mat, rotationX, mat);
    tileset._root.transform = mat;

    // look at the model.
    viewer.camera.viewBoundingSphere(tileset.boundingSphere, new Cesium.HeadingPitchRange(0, -0.5, 0));
    viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);

    // add event
    initialScreenDisplay();
});






