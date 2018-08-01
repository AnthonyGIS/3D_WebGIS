var viewer = new Cesium.Viewer('cesiumContainer',{
    animation: false,//是否创建动画小器件，左下角仪表
    baseLayerPicker: true,//是否显示图层选择器
    fullscreenButton: true,//是否显示全屏按钮
    geocoder: false,//是否显示geocoder小器件，右上角查询按钮
    homeButton: true,//是否显示Home按钮
    infoBox: true,//是否显示信息框
    sceneModePicker: false,             //是否显示3D/2D选择器
    selectionIndicator: true,           //是否显示选取指示器组件[]
    timeline: false,                    //是否显示时间轴
    //shouldAnimate: true,
    navigationHelpButton: false,//是否显示右上角的帮助按钮
    scene3DOnly: true,//如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
    clock: new Cesium.Clock(),//用于控制当前时间的时钟对象


    selectedImageryProviderViewModel: undefined,//当前图像图层的显示模型，仅baseLayerPicker设为true有意义
    //imageryProviderViewModels: Cesium.createDefaultImageryProviderViewModels(),//可供BaseLayerPicker选择的图像图层ProviderViewModel数组
    selectedTerrainProviderViewModel: undefined,//当前地形图层的显示模型，仅baseLayerPicker设为true有意义
    terrainProviderViewModels: Cesium.createDefaultTerrainProviderViewModels(),//可供BaseLayerPicker选择的地形图层ProviderViewModel数组
    /*imageryProvider: new Cesium.OpenStreetMapImageryProvider({
       credit: '',
       url: '//192.168.0.89:5539/planet-satellite/'
    }),//图像图层提供者，仅baseLayerPicker设为false有意义*/
    terrainProvider: new Cesium.EllipsoidTerrainProvider(),//地形图层提供者，仅baseLayerPicker设为false有意义

    /* //用于渲染星空的SkyBox对象
    skyBox: new Cesium.SkyBox({
       sources: {
           positiveX: 'Cesium-1.7.1/Skybox/px.jpg',
           negativeX: 'Cesium-1.7.1/Skybox/mx.jpg',
           positiveY: 'Cesium-1.7.1/Skybox/py.jpg',
           negativeY: 'Cesium-1.7.1/Skybox/my.jpg',
           positiveZ: 'Cesium-1.7.1/Skybox/pz.jpg',
           negativeZ: 'Cesium-1.7.1/Skybox/mz.jpg'
       }
    }),*/
    fullscreenElement: document.body,//全屏时渲染的HTML元素,
    useDefaultRenderLoop: true,//如果需要控制渲染循环，则设为true
    targetFrameRate: undefined,//使用默认render loop时的帧率
    showRenderLoopErrors: false,//如果设为true，将在一个HTML面板中显示错误信息
    automaticallyTrackDataSourceClocks: true,//自动追踪最近添加的数据源的时钟设置
    contextOptions: undefined,//传递给Scene对象的上下文参数（scene.options）
    sceneMode: Cesium.SceneMode.SCENE3D,//初始场景模式
    mapProjection: new Cesium.WebMercatorProjection(),//地图投影体系
    dataSources: new Cesium.DataSourceCollection()
});

// Load STK World Terrain
/*
viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
    url: 'https://assets.agi.com/stk-terrain/world',
    requestWaterMask: true, // required for water effects
    requestVertexNormals: true // required for terrain lighting
});
*/


viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
    url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
    layer: "tdtImgBasicLayer",
    style: "default",
    format: "image/jpeg",
    tileMatrixSetID: "GoogleMapsCompatible",
    show: false
}));


viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({

    url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
    layer: "tdtImgAnnoLayer",
    style: "default",
    format: "image/jpeg",
    tileMatrixSetID: "GoogleMapsCompatible",
    show: false
}));







// 这样数据就被加载到cesium中了
$.ajax({
    // ST
    // url: "http://10.33.168.220:8080/geoserver/weng_test/ows?service=WFS&request=GetFeature&typeName=weng_test:st_layer&outputFormat=application/json",
    // PWK
    url: "http://10.33.168.220:8080/geoserver/weng_test/ows?service=WFS&request=GetFeature&typeName=weng_test:PWK_ZS_2017&outputFormat=application/json",
    cache: false,
    async: true,
    success: function (data) {
        var datasource = Cesium.GeoJsonDataSource.load(data);
        viewer.dataSources.add(datasource);

        /*// 使用 datasource.entities.values，就可以对矢量图层进行渲染了
        var entities = datasource.entities.values;
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            var polylineVolume = {
                positions: entity.polyline._positions,
                shape: computeCircle(50.0),
                material: Cesium.Color.RED
            };
            entity.polylineVolume = polylineVolume;
            entity.polyline = null;
        }*/
    },
    error: function (data) {
        console.log("error");
    }
});

// Start off looking at Australia.
viewer.camera.setView({
    destination: Cesium.Rectangle.fromDegrees(119.829617, 29.547073, 120.259616, 29.073752)
});
Cesium.GeoJsonDataSource.clampToGround = true;