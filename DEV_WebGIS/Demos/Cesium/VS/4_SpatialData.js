/// <reference path="../Cesium/Cesium.js" />
//var viewer = new Cesium.Viewer('cesiumContainer');
var viewer = new Cesium.Viewer('cesiumContainer', {

    animation: false,//是否创建动画小器件，左下角仪表  
    baseLayerPicker: false,//是否显示图层选择器  
    fullscreenButton: false,//是否显示全屏按钮  
    geocoder: false,//是否显示geocoder小器件，右上角查询按钮  
    homeButton: false,//是否显示Home按钮  
    infoBox: true,//是否显示信息框
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




var instance = new Cesium.GeometryInstance({
    geometry: new Cesium.RectangleGeometry({
        rectangle: Cesium.Rectangle.fromDegrees(110.0, 20.0, 120.0, 30.0),
        vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
    })
});

var anotherInstance = new Cesium.GeometryInstance({
    geometry: new Cesium.RectangleGeometry({
        rectangle: Cesium.Rectangle.fromDegrees(95.0, 20.0, 105.0, 30.0),
        vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
    })
});

scene.primitives.add(new Cesium.Primitive({
    geometryInstances: [instance, anotherInstance],
    appearance: new Cesium.EllipsoidSurfaceAppearance({
        material: Cesium.Material.fromType('Stripe')
    })
}));



// Load STK World Terrain
viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
    url: 'https://assets.agi.com/stk-terrain/world',
    requestWaterMask: true, // required for water effects
    requestVertexNormals: true // required for terrain lighting
});




//让镜头飞行（动画）到某个地点和方向  
//setTimeout(function () {
//    camera.flyTo({
//        destination: Cesium.Cartesian3.fromDegrees(116, 15, 6000000),
//        orientation: {
//            heading: Cesium.Math.toRadians(15),
//            pitch: Cesium.Math.toRadians(-70), //倾斜
//            roll: Cesium.Math.toRadians(-10)
//        },
//        duration: 3, //动画持续时间  
//        complete: function () //飞行完毕后执行的动作  
//        {
//            //addEntities();
//        }
//    });
//}, 1000);




// 2. Using a HeadingPitchRange offset
//var center = Cesium.Cartesian3.fromDegrees(116, 25);
//var heading = Cesium.Math.toRadians(15.0);
//var pitch = Cesium.Math.toRadians(-70.0);
//var range = 6000000.0;
//camera.lookAt(center, new Cesium.HeadingPitchRange(heading, pitch, range));

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



/*

var kmlOptions = {
    camera: camera,
    canvas: scene,
    clampToGround: true
};
// Load geocache points of interest from a KML file
// Data from : http://catalog.opendata.city/dataset/pediacities-nyc-neighborhoods/resource/91778048-3c58-449c-a3f9-365ed203e914
var geocachePromise = Cesium.KmlDataSource.load('./data/multilevel.kmz', kmlOptions);

// Add geocache billboard entities to scene and style them
geocachePromise.then(function (dataSource) {
    // Add the new data as entities to the viewer
    viewer.dataSources.add(dataSource);

    // Get the array of entities
    var geocacheEntities = dataSource.entities.values;

    for (var i = 0; i < geocacheEntities.length; i++) {
        var entity = geocacheEntities[i];
        if (Cesium.defined(entity.billboard)) {
            // Entity styling code here
            // Adjust the vertical origin so pins sit on terrain
            entity.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
            // Disable the labels to reduce clutter
            entity.label = undefined;
            // Add distance display condition
            entity.billboard.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(10.0, 20000.0);

            // Compute latitude and longitude in degrees
            var cartographicPosition = Cesium.Cartographic.fromCartesian(entity.position.getValue(Cesium.JulianDate.now()));
            var latitude = Cesium.Math.toDegrees(cartographicPosition.latitude);
            var longitude = Cesium.Math.toDegrees(cartographicPosition.longitude);
            // Modify description
            var description = '<table class="cesium-infoBox-defaultTable cesium-infoBox-defaultTable-lighter"><tbody>';
            description += '<tr><th>' + "Latitude" + '</th><td>' + latitude + '</td></tr>';
            description += '<tr><th>' + "Longitude" + '</th><td>' + longitude + '</td></tr>';
            description += '</tbody></table>';
            entity.description = description;

        }
    }
});
*/


// 多边形绘制
// http://www.cnblogs.com/wanghui2011/articles/5992092.html
var wyoming = viewer.entities.add({
    name:'weng',
    polygon:{
        hierarchy:Cesium.Cartesian3.fromDegreesArray(
            [
                120.73902,21.91655,
                120.63902,22.26264,
                120.49839,22.40327,
                120.25230,22.54389,
                120.00620,23.07124,
                120.30105,24.02046,
                121.02573,25.03999,
                121.55308,25.32124,
                122.00464,25.03999,
                121.41245,23.21186,
                121.27183,22.96577,
                121.09605,22.82514,
                120.98511,22.50874,
                120.84995,21.91655
            ]),
        material:Cesium.Color.RED.withAlpha(0.5),
        outline:true,
        outlineColor:Cesium.Color.BLACK
    }
});

var citizensBankPark = viewer.entities.add({
    name : 'Taiwan belongs to China',
    position : Cesium.Cartesian3.fromDegrees(120.86753, 23.75679),
    point : {
                pixelSize : 5,
            color : Cesium.Color.RED,
             outlineColor : Cesium.Color.WHITE,
            outlineWidth : 2
      },
    label : {
                 text : 'Taiwan belongs to China',
             font : '14pt monospace',
             style: Cesium.LabelStyle.FILL_AND_OUTLINE,
             outlineWidth : 2,
             outlineColor: Cesium.Color.YELLOW,
             verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
             pixelOffset : new Cesium.Cartesian2(0, -9)
       }
    });

var citizensBankPark = viewer.entities.add({
    position : Cesium.Cartesian3.fromDegrees(111.64781, 16.46626),
    billboard : {
        image : '../../LIBS/Data/img/flag2.png',
        width : 32,
        height : 32
    },
    label : {
        text : '祖国万岁',
        font : '14pt monospace',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth : 2,
        verticalOrigin : Cesium.VerticalOrigin.TOP,
        pixelOffset : new Cesium.Cartesian2(0, 32)
    }
});

viewer.zoomTo(viewer.entities);