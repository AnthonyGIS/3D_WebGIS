/// <reference path="../Cesium/Cesium.js" />
//var viewer = new Cesium.Viewer('cesiumContainer');
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



// Load STK World Terrain
viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
    url: 'https://assets.agi.com/stk-terrain/world',
    requestWaterMask: true, // required for water effects
    requestVertexNormals: true // required for terrain lighting
});


//设置镜头位置与方向  
camera.setView({
    // View rectangle with a top-down view
    //destination : Cesium.Rectangle.fromDegrees(west, south, east, north)
    destination: Cesium.Cartesian3.fromDegrees(116.3, 8.0, 8000000), //100000公里上空  
    orientation: {
        heading: Cesium.Math.toRadians(15),   // x. east, default value is 0.0 (north)
        pitch: Cesium.Math.toRadians(-75),    // y. default value (looking down)
        roll: Cesium.Math.toRadians(-10)      // z. default value
        // Set position with an orientation using unit vectors.
        // direction : new Cesium.Cartesian3(-0.04231243104240401, -0.20123236049443421, -0.97862924300734),
        //up : new Cesium.Cartesian3(-0.47934589305293746, -0.8553216253114552, 0.1966022179118339)
    }
});


// Cesium加载Geoserver发布的WMS服务
var url = "http://localhost:8080/geoserver/weng_test/wms?transparent=true";  //请求路径为透明的方式  
var parameters = { service: "WMS", version: "1.1.1", request: "GetMap", styles: "", format: "image/png" };  //请求方式：format为png格式  
var privider = new Cesium.WebMapServiceImageryProvider({
    url: url,
    layers: 'weng_test:dw_country',  //图层的名称  
    parameters: parameters
})
var layer = viewer.imageryLayers.addImageryProvider(privider);



//Seed the random number generator for repeatable results.
// https://www.cnblogs.com/lilyxusi/p/6628056.html
//Cesium.Math.setRandomNumberSeed(0);
//var promise = Cesium.GeoJsonDataSource.load('http://localhost:8080/geoserver/weng_test/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=weng_test:dw_country&maxFeatures=50&outputFormat=application%2Fjson');
//promise.then(function (dataSource) {
//    viewer.dataSources.add(dataSource);
//    var entities = dataSource.entities.values;
//    var colorHash = {};
//    for (var i = 0; i < entities.length; i++) {
//        var entity = entities[i];
//        var name = entity.name;
//        var color = colorHash[name];
//        if (!color) {
//            color = Cesium.Color.fromRandom({
//                alpha: 1.0
//            });
//            colorHash[name] = color;
//        }
//        entity.polygon.material = color;
//        entity.polygon.outline = false;
//        entity.polygon.extrudedHeight = 5000.0;
//    }
//});
//viewer.flyTo(promise);