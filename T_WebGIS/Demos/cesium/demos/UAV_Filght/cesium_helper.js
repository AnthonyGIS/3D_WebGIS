
function CesiumHelper(cesiumContainer) {

    // 属性
    this.div_cesium = cesiumContainer;
    this.ion_defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmNTdmYzUwZS0yYmJkLTQwNTQtYjk3OC01ND" +
        "Q4ODhlZmFjZmEiLCJpZCI6NjY4Mywic2NvcGVzIjpbImFzbCIsImFzciIsImFzdyIsImdjIl0sImlhdCI6MTU0NzEyNjAyMX0.9C_6xLe-gC17O0_" +
        "0pRxDygYdzeMmvvYqiP2gzQLA5Vo";
    this.viewer = null;
    this.scene = null;
    this.camera = null;
    this.canvas = null;

    // 方法

    // PART 1  initial

    if(typeof this.initialIonToken!= "function"){
        CesiumHelper.prototype.initialIonToken = function () {
            Cesium.Ion.defaultAccessToken = this.ion_defaultAccessToken;
        };
    }

    if(typeof this.createViewer!= "function") {
        CesiumHelper.prototype.createViewer = function () {
            this.viewer = new Cesium.Viewer(this.div_cesium, {

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
        };
    }

    if(typeof this.initialCesiumObjsRef!= "function") {
        CesiumHelper.prototype.initialCesiumObjsRef = function () {
            this.scene = this.viewer.scene;
            this.camera = this.scene.camera;
            this.canvas = this.scene.canvas;
        };
    }

    if(typeof this.initialMain!= "function"){
        CesiumHelper.prototype.initialMain = function () {
            this.initialIonToken();
            this.createViewer();
            this.initialCesiumObjsRef();
            this.addTerrain();
        };
    }


    // Part 2  Load RES
    if(typeof this.addTerrain!= "function"){
        CesiumHelper.prototype.addTerrain = function () {
            var terrainProv = new Cesium.CesiumTerrainProvider({
                url: Cesium.IonResource.fromAssetId(1),
                requestVertexNormal: true
            });
            // Load STK World Terrain
            this.viewer.terrainProvider = terrainProv;
        };
    }


    // Part 3 Visual
    if(typeof this.setCameraLocAndOrient!= "function"){
        CesiumHelper.prototype.setCameraLocAndOrient = function (lng,lat,height,heading,pitch,roll) {
            // lng,lat,height: 116.3, 8.0, 8000000
            // heading（以北为0的航向）,pitch（俯仰）,roll（翻滚）：0，-90, 0

            //设置镜头位置与方向
            this.camera.setView({
                // View rectangle with a top-down view
                //destination : Cesium.Rectangle.fromDegrees(west, south, east, north)
                destination: Cesium.Cartesian3.fromDegrees(lng, lat, height), //height公里上空
                orientation: {
                    heading: Cesium.Math.toRadians(heading),   // x. east, default value is 0.0 (north)
                    pitch: Cesium.Math.toRadians(pitch),    // y. default value (looking down)
                    roll: Cesium.Math.toRadians(roll)      // z. default value
                    // Set position with an orientation using unit vectors.
                    // direction : new Cesium.Cartesian3(-0.04231243104240401, -0.20123236049443421, -0.97862924300734),
                    // up : new Cesium.Cartesian3(-0.47934589305293746, -0.8553216253114552, 0.1966022179118339)
                }
            });

        };
    }

    //让镜头飞行（动画）到某个地点和方向
    if(typeof this.flyCameraToLoc!= "function"){
        CesiumHelper.prototype.flyCameraToLoc = function (lng,lat,height,heading,pitch,roll, delay_m_second, func_complete) {
            // lng,lat,height: 116.3, 12.0, 8000000
            // heading,pitch,roll: 15,-75,-10
            // delay_m_second: 1000
            var that = this;
            setTimeout(function () {
                that.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(lng,lat,height),
                    orientation: {
                        heading: Cesium.Math.toRadians(heading),
                        pitch: Cesium.Math.toRadians(pitch),
                        roll: Cesium.Math.toRadians(roll)
                    },
                    duration: 3,//动画持续时间
                    complete: function ()//飞行完毕后执行的动作
                    {
                        // post data
                        func_complete(); // post data call back call
                    }
                });
            }, delay_m_second);
        };
    }



    // 构造函数中的方法形式的初始化

    this.initialMain();

}