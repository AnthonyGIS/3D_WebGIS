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
    //imageryProviderViewModels: Cesium.createDefaultImageryProviderViewModels(),//可供BaseLayerPicker选择的图像图层ProviderViewModel数组  
    selectedTerrainProviderViewModel: undefined,//当前地形图层的显示模型，仅baseLayerPicker设为true有意义  
    terrainProviderViewModels: Cesium.createDefaultTerrainProviderViewModels(),//可供BaseLayerPicker选择的地形图层ProviderViewModel数组
    terrainProvider: new Cesium.EllipsoidTerrainProvider(),//地形图层提供者，仅baseLayerPicker设为false有意义
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

// cordinate display
/*
var displayPanel = new CesiumCordinateDisplay(viewer);
displayPanel.AddStatusPanelHTML();
displayPanel.InitialStatusPanel();
displayPanel.SetMouseMoveEvent();
*/


// OSGB control points add
var promise = viewer.dataSources.add(Cesium.GeoJsonDataSource.load('../OSGB_SHP_Overlay/River_ControlPoint.json',{
    stroke: Cesium.Color.BLUE.withAlpha(0.3),
    fill: Cesium.Color.RED,
    strokeWidth:2
}));

viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(120.666401,30.560613,1500.0),
    easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT
});



//底图切换
var MapConfig = {
    extent: {//初始化范围
        xmin: 12445986.749812808,
        ymin: 2460330.5958780753,
        xmax: 12450572.971510038,
        ymax: 2462313.1812992743
    },
    spatialReference: {//地图空间参考坐标系
        wkid: 3857
    },
    /*备注说明:配置底图列表
     *type代表地图服务类型(0代表ArcGisMapServerImageryProvider;1代表createOpenStreetMapImageryProvider;
                     2代表WebMapTileServiceImageryProvider;3代表createTileMapServiceImageryProvider;
                     4 代表UrlTemplateImageryProvider;5 代表WebMapServiceImageryProviderr)
     *proxyUrl代理请求服务
     *iconUrl图标
     *name显示名称
     *Url地图Url
     */
    imageryViewModels: [
        //{"id":0,"label":"广东影像",className:"imgType",type:5,proxyUrl:'',Url:'http://gisserver:18081/geoserver/gwc/service/wms',credit:'wms服务',layers: 'GD:GDImage',tilingScheme:new Cesium.WebMercatorTilingScheme()},
        //{"id":1,"label":"广东海图",className:"vecType",type:5,proxyUrl:'',Url:'http://gisserver:18081/geoserver/gwc/service/wms',credit:'wms服务',layers: 'GD:SeaMap',tilingScheme:new Cesium.WebMercatorTilingScheme()},
        /*{
            "id": 0,
            "label": "广东影像",
            className: "imgType",
            type: 0,
            proxyUrl: GLOBAL.domainRest + '/mapproxy/support',
            Url: 'http://GISSERVER:6080/arcgis/rest/services/GDImage/MapServer'
        },
        {
            "id": 1,
            "label": "广东海图",
            className: "vecType",
            type: 0,
            proxyUrl: GLOBAL.domainRest + '/mapproxy/support',
            Url: 'http://GISSERVER:6080/arcgis/rest/services/SeaMap/MapServer'
        },*/
        {
            "id": 2,
            "label": "影像图",
            className: "imgType",
            type: 0,
            proxyUrl: '',
            Url: 'http://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer'
        },
        {
            "id": 3,
            "label": "街道图",
            className: "vecType",
            type: 0,
            proxyUrl: '',
            Url: 'http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer'
        },
        {
            "id": 4,
            "label": "WMS",
            className: "imgType",
            type: 5,
            proxyUrl: '',
            Url: 'http://gisserver:18081/geoserver/gwc/service/wms',
            credit: 'wms服务',
            layers: 'GD:GDImage',
            tilingScheme: new Cesium.WebMercatorTilingScheme()
        },
        {
            "id": 5,
            "label": "OSM",
            className: "vecType",
            type: 1,
            proxyUrl: '',
            Url: 'https://a.tile.openstreetmap.org/'
        },
        {
            "id": 6,
            "label": "天地街道",
            className: "vecType",
            type: 2,
            proxyUrl: '',
            Url: 'http://t{l}.tianditu.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles',
            layer: 'tdtVecBasicLayer',
            style: 'default',
            format: 'image/jpeg',
            tileMatrixSetID: 'tdtMap'
        },
        {
            "id": 7,
            "label": "天地影像",
            className: "imgType",
            type: 2,
            proxyUrl: '',
            Url: 'http://t{l}.tianditu.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles',
            layer: 'tdtImgBasicLayer',
            style: 'default',
            format: 'image/jpeg',
            tileMatrixSetID: 'tdtMap'
        },
    ]

};
loadSwitcherMap(MapConfig.imageryViewModels);

//-------------------------------------------------------------------------------
var _position, _pm_position, _cartesian, max_width = 300, max_height = 500, infoDiv;
var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
handler.setInputAction(function (CLICK) {
    //http://blog.csdn.net/u013929284/article/details/52503295
    var cartesian = scene.globe.pick(camera.getPickRay(CLICK.position), scene);
    var cartographic = scene.globe.ellipsoid.cartesianToCartographic(cartesian);
    var picks = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, cartesian);

    _position = CLICK.position;
    _cartesian = cartesian;
    _pm_position = {x: picks.x, y: picks.y};

    var lng = cartographic.longitude * 180 / Math.PI;
    var lat = cartographic.latitude * 180 / Math.PI;
    var hei = cartographic.height;

    if (infoDiv) {
        console.warn("气泡尚未关闭");
        return false;
    }else {
        infoDiv = window.document.createElement("div");
        infoDiv.id = "trackPopUp";
        infoDiv.style.display = "none";
        infoDiv.innerHTML = '<div id="trackPopUpContent" class="leaflet-popup" style="top:0;left:0;">' +
            '<a class="leaflet-popup-close-button" href="javascript:void(0)">×</a>' +
            '<div class="leaflet-popup-content-wrapper">' +
            '<div id="trackPopUpLink" class="leaflet-popup-content" style="max-width: ' + max_width + 'px;max-height: ' + max_height + 'px"><h2>这是一个大大的提示气泡</h2></div>' +
            '</div>' +
            '<div class="leaflet-popup-tip-container">' +
            '<div class="leaflet-popup-tip"></div>' +
            '</div>' +
            '</div>';

        window.document.getElementById("cesiumContainer").appendChild(infoDiv);
        window.document.getElementById("trackPopUp").style.display = "block";
    }

}, Cesium.ScreenSpaceEventType.LEFT_CLICK);


var _pm_position_2;
viewer.scene.postRender.addEventListener(function () {

    if (_pm_position != _pm_position_2) {
        _pm_position_2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(_teemo_scene, _cartesian);
        var popw = document.getElementById("trackPopUpContent").offsetWidth;
        var poph = document.getElementById("trackPopUpContent").offsetHeight;

        var trackPopUpContent_ = window.document.getElementById("trackPopUpContent");
        trackPopUpContent_.style.left = _pm_position_2.x-(popw/2);
        trackPopUpContent_.style.top = _pm_position_2.y-(poph-10);
    }

});
