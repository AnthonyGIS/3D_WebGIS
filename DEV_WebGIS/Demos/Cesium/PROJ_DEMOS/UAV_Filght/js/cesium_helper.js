function CesiumHelper(cesiumContainer) {

    // 2019.1.13 2117 version 1.0.0 weng

    // 属性
    this.div_cesium = cesiumContainer;
    this.ion_defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmNTdmYzUwZS0yYmJkLTQwNTQtYjk3OC01ND" +
        "Q4ODhlZmFjZmEiLCJpZCI6NjY4Mywic2NvcGVzIjpbImFzbCIsImFzciIsImFzdyIsImdjIl0sImlhdCI6MTU0NzEyNjAyMX0.9C_6xLe-gC17O0_" +
        "0pRxDygYdzeMmvvYqiP2gzQLA5Vo";
    this.viewer = null;
    this.scene = null;
    this.camera = null;
    this.canvas = null;
    this.terrain_provider = null;

    // 方法

    // PART 1  initial

    if (typeof this.initialIonToken != "function") {
        CesiumHelper.prototype.initialIonToken = function () {
            Cesium.Ion.defaultAccessToken = this.ion_defaultAccessToken;
        };
    }

    if (typeof this.createViewer != "function") {
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

    if (typeof this.initialCesiumObjsRef != "function") {
        CesiumHelper.prototype.initialCesiumObjsRef = function () {
            this.scene = this.viewer.scene;
            this.camera = this.scene.camera;
            this.canvas = this.scene.canvas;
        };
    }

    if (typeof this.initialMain != "function") {
        CesiumHelper.prototype.initialMain = function () {
            this.initialIonToken();
            this.createViewer();
            this.initialCesiumObjsRef();
            this.addTerrain();
        };
    }


    // Part 2  Load RES
    if (typeof this.addTerrain != "function") {
        CesiumHelper.prototype.addTerrain = function () {
            this.terrain_provider = new Cesium.CesiumTerrainProvider({
                url: Cesium.IonResource.fromAssetId(1),
                // 请求照明
                requestVertexNormals: true,
                // 请求水波纹效果
                requestWaterMask: true
            });
            // Load STK World Terrain
            this.viewer.terrainProvider = this.terrain_provider;
        };
    }

    // 请求数据
    if (typeof this.sendRequest != "function") {
        CesiumHelper.prototype.sendRequest = function (method, url, isAsyns, responseType, params, action, onload) {
            /// <summary>
            /// 发送数据，开始与服务器进行交互。原生发送请求。
            /// 函数来自于zTreeContent.js中定义的。
            /// </summary>
            /// <param name="method">post发送带参数的请求，请求要自己设置请求头</param>
            /// <param name="url"></param>
            /// <param name="isAsyns"></param>
            /// <param name="responseType"></param>
            /// <param name="params"></param>
            /// <param name="action"></param>
            /// <param name="onload"></param>

            if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari  
                xhr = new XMLHttpRequest();
            } else {// code for IE6, IE5  
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xhr.open(method, url, isAsyns);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");//xhr.setRequestHeader("desktop_web_access_key", _desktop_web_access_key);
            xhr.setRequestHeader("client_type", "DESKTOP_WEB");
            xhr.responseType = responseType; //"blob"
            xhr.onload = onload;
            xhr.onreadystatechange = action;
            xhr.send(params);
        };
    }

    //天地图影像
    if (typeof this.add_TianDitu_WMS != "function") {
        CesiumHelper.prototype.add_TianDitu_WMS = function () {
            this.viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({

                url: 'http://t0.tianditu.com/img_w/wmts?',
                layer: 'img',
                style: 'default',
                format: 'tile',
                tileMatrixSetID: 'w',
                credit: new Cesium.Credit('天地图全球影像'),
                maximumLevel: 18
            }));
        };
    }

    // 全球影像中文注记服务
    if (typeof this.add_TianDitu_WMTS_AnnoLayer != "function") {
        CesiumHelper.prototype.add_TianDitu_WMTS_AnnoLayer = function () {
            this.viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
                url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg",
                layer: "tdtAnnoLayer",
                style: "default",
                format: "image/jpeg",
                tileMatrixSetID: "GoogleMapsCompatible",
                maximumLevel: 13,
                minimumLevel: 1,
                show: false
            }));
        };
    }

    // Google地图
    if (typeof this.add_GoogleMap != "function") {
        CesiumHelper.prototype.add_GoogleMap = function () {

            var image_googleSource = new Cesium.UrlTemplateImageryProvider({
                url: 'http://mt0.google.cn/vt/lyrs=s@702&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Ga',
                credit: ''
            });
            this.viewer.imageryLayers.addImageryProvider(image_googleSource);

        };
    }

    if (typeof this.add_GoogleMap_AnnoLayer != "function") {
        CesiumHelper.prototype.add_GoogleMap_AnnoLayer = function () {
            var label_googleSource = new Cesium.UrlTemplateImageryProvider({
                url: 'http://mt0.google.cn/vt/imgtp=png32&lyrs=h@365000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galil',
                credit: ''
            });
            this.viewer.imageryLayers.addImageryProvider(label_googleSource);
        };
    }





    // Part 3 tools

    // 坐标定义
    // -------------------------------------------------------------------------
    // 笛卡尔(Cartesian)二维坐标系，也就是直角坐标系（屏幕坐标系）
    if (typeof this.coor_DefineCartesian2_Screen != "function") {
        CesiumHelper.prototype.coor_DefineCartesian2_Screen = function (x, y) {
            return new Cesium.Cartesian2(x, y);
        };
    }

    // 笛卡尔(Cartesian)三维坐标系，也是直角坐标系(就是真实世界的坐标系)
    if (typeof this.coor_DefineCartesian3_Word != "function") {
        CesiumHelper.prototype.coor_DefineCartesian3_Word = function (x, y, z) {
            return new Cesium.Cartesian3(x, y, z);
        };
    }

    // 单位转换
    // -------------------------------------------------------------------------
    if (typeof this.coor_Unit_Degree2Radians != "function") {
        CesiumHelper.prototype.coor_Unit_Degree2Radians = function (degrees) {
            return CesiumMath.toRadians(degrees);
        };
    }
    if (typeof this.coor_Unit_Radians2Degree != "function") {
        CesiumHelper.prototype.coor_Unit_Radians2Degree = function (radians) {
            return CesiumMath.toDegrees(radians);
        };
    }


    // 地形高度获取
    // -------------------------------------------------------------------------
    if (typeof this.coor_GetHeight_M1 != "function") {
        CesiumHelper.prototype.coor_GetHeight_M1 = function (lng, lat, terrainProvider, call_back_func) {


            // Query the terrain height of two Cartographic positions
            // var terrainProvider = Cesium.createWorldTerrain();

            var positions = [
                //Cesium.Cartographic.fromDegrees(86.925145, 27.988257),
                Cesium.Cartographic.fromDegrees(lng, lat)
            ];
            var promise = Cesium.sampleTerrainMostDetailed(terrainProvider, positions);


            //Cesium.when(promise, function (updatedPositions) {
            //    // 该回调是异步的。
            //    // positions[0].height and positions[1].height have been updated.
            //    // updatedPositions is just a reference to positions.

            //    var terrainHeight = updatedPositions[0].height
            //    // console.log(terrainHeight);
            //    return terrainHeight;
            //});
            Cesium.when(promise,call_back_func);


        };
    }

    if (typeof this.coor_GetHeight_M2 != "function") {
        CesiumHelper.prototype.coor_GetHeight_M2 = function (lng, lat, terrainProvider, call_back_func) {


            // Query the terrain height of two Cartographic positions
            // var terrainProvider = Cesium.createWorldTerrain();
            var positions = [
                //Cesium.Cartographic.fromDegrees(86.925145, 27.988257),
                Cesium.Cartographic.fromDegrees(lng, lat)
            ];
            var promise = Cesium.sampleTerrain(terrainProvider, 19, positions);
            //Cesium.when(promise, function (updatedPositions) {
            //    // positions[0].height and positions[1].height have been updated.
            //    // updatedPositions is just a reference to positions.


            //    var terrainHeight = updatedPositions[0].height
            //    // console.log(terrainHeight);
            //    return terrainHeight;
            //});

            Cesium.when(promise, call_back_func);
        };
    }

    
    





    // 坐标转换
    // ------------------------------------------------------------------------------------------
    // 二维屏幕坐标系到三维坐标系的转换
    if (typeof this.coor_Convert_Cartesian2_To_Cartesian3 != "function") {
        CesiumHelper.prototype.coor_Convert_Cartesian2_To_Cartesian3 = function (pt_car2) {
            //其中pt1为一个二维屏幕坐标。
            return this.scene.globe.pick(this.camera.getPickRay(pt_car2), this.scene);
        };
    }

    // 屏幕转世界坐标，same to coor_Convert_Cartesian2_To_Cartesian3
    if (typeof this.coor_Convert_Cartesian2_xy_To_Cartesian3 != "function") {
        CesiumHelper.prototype.coor_Convert_Cartesian2_xy_To_Cartesian3 = function (x, y) {
            var pick1 = new Cesium.Cartesian2(x, y);
            return this.coor_Convert_Cartesian2_To_Cartesian3(pick1);
        };
    }

    // 世界坐标转屏幕坐标
    if (typeof this.coor_Convert_Cartesian2_To_Cartesian3_M2 != "function") {
        CesiumHelper.prototype.coor_Convert_Cartesian2_To_Cartesian3_M2 = function (pt_car3) {
            return Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.scene, pt_car3);
        };
    }


    // 三维坐标到地理坐标的转换
    // cesium中默认的地理坐标是弧度表示的。
    // 世界坐标转换为经纬度
    if (typeof this.coor_Convert_Cartesian3_xyz_To_GeographyDegree != "function") {
        CesiumHelper.prototype.coor_Convert_Cartesian3_xyz_To_GeographyDegree = function (x, y, z) {

            var cartesian3 = Cesium.Cartesian3(x, y, z);
            var ellipsoid = this.scene.globe.ellipsoid;
            var pt_geo_rad = ellipsoid.cartesianToCartographic(cartesian3);

            return [Cesium.Math.toDegrees(pt_geo_rad.longitude), Cesium.Math.toDegrees(pt_geo_rad.latitude), pt_geo_rad.height];
        };
    }


    if (typeof this.coor_Convert_Cartesian3_To_GeographyRad != "function") {
        CesiumHelper.prototype.coor_Convert_Cartesian3_To_GeographyRad = function (pt_ca3) {
            //其中pick1是一个Cesium.Cartesian3对象
            return this.scene.globe.ellipsoid.cartesianToCartographic(pt_ca3);//pt_geo_rad
        };
    }

    // 地理弧度坐标到地理经纬度坐标的转换
    if (typeof this.coor_Convert_GeographyRad_To_GeographyDegree != "function") {
        CesiumHelper.prototype.coor_Convert_GeographyRad_To_GeographyDegree = function (pt_geo_rad) {
            // 其中pt_geo_rad是一个地理弧度坐标
            return [pt_geo_rad.longitude / Math.PI * 180, pt_geo_rad.latitude / Math.PI * 180];//pt_geo_degree
        };
    }

    // 经纬度坐标转地理坐标（弧度）
    if (typeof this.coor_Convert_GeographyDegree_To_GeographyRad_3D != "function") {
        CesiumHelper.prototype.coor_Convert_GeographyDegree_To_GeographyRad_3D = function (lng, lat, alt) {
            return Cesium.Cartographic.fromDegrees(lng, lat, alt);//geo_red_wgs84,单位：度，度，米
        };
    }

    // 经纬度坐标转地理坐标（弧度）
    if (typeof this.coor_Convert_GeographyDegree_To_GeographyRad_2D != "function") {
        CesiumHelper.prototype.coor_Convert_GeographyDegree_To_GeographyRad_2D = function (lng, lat) {
            var pt_geo_degree = [lng, lat];
            return Cesium.Cartographic.fromDegrees(pt_geo_degree); //cartographic, pt_geo_rad
        };
    }

    // 经纬度坐标转世界坐标
    if (typeof this.coor_Convert_GeographyDegree_To_Cartesian3 != "function") {
        CesiumHelper.prototype.coor_Convert_GeographyDegree_To_Cartesian3 = function (lng, lat, alt) {
            var pt_geo_degree = [lng, lat, alt];
            return Cesium.Cartesian3.fromDegrees(pt_geo_degree);
        };
    }

    // 经纬度转世界坐标
    if (typeof this.coor_Convert_GeographyDegree_lng_lat_h_To_Cartesian3 != "function") {
        CesiumHelper.prototype.coor_Convert_GeographyDegree_lng_lat_h_To_Cartesian3 = function (lng, lat, height) {

            /*var cartographic=Cesium.Cartographic.fromDegrees(lng,lat,height);
            var ellipsoid=this.viewer.scene.globe.ellipsoid;
            var cartesian3=ellipsoid.cartographicToCartesian(cartographic);*/
            return Cesium.Cartesian3.fromDegrees(lng, lat, height, this.scene.globe.ellipsoid);
        };
    }

    // 旋转变换
    // ------------------------------------------------------------------------------------------
    // 坐标饶某个轴旋转
    if (typeof this.coor_Convert_Cartesian3_RotateAngle_demo != "function") {
        CesiumHelper.prototype.coor_Convert_Cartesian3_RotateAngle_demo = function (x, y, z, angle, lng, lat, alt) {

            // 转换到笛卡尔坐标系后就能运用计算机图形学中的仿射变换知识进行空间位置变换如平移旋转缩放。cesium.js为我们提供了很有用的变换工具类，
            // Cesium.Cartesian3（相当于Point3D）Cesium.Matrix3（3x3矩阵，用于描述旋转变换）Cesium.Matrix4（4x4矩阵，用于描述旋转
            // 加平移变换），Cesium.Quaternion（四元数，用于描述围绕某个向量旋转一定角度的变换）。下面举个例子：

            // 局部坐标定义其z轴垂直于地表，局部坐标的y轴指向正北.一个局部坐标为p1(x,y,z)的点，将它的局部坐标原点放置到loc(lng,lat,alt)上，
            // 并围绕这个z轴旋转angle度，求此时p1(x,y,z)变换成全局坐标笛卡尔坐标p2(x1,y1,z1)是多少？

            // 1 get rotate matrix
            var rotate = Cesium.Math.toRadians(angle);//转成弧度
            var quat = Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Z, rotate); //quat为围绕这个z轴旋转d度的四元数
            var rot_mat3 = Cesium.Matrix3.fromQuaternion(quat);//rot_mat3为根据四元数求得的旋转矩阵

            // 2 获取旋转后的坐标
            var pt = new Cesium.Cartesian3(x, y, z);//p1的局部坐标
            // m2为旋转加平移的4x4变换矩阵，这里平移为(0,0,0)，故填个Cesium.Cartesian3.ZERO
            var m = Cesium.Matrix4.fromRotationTranslation(rot_mat3, Cesium.Cartesian3.ZERO);
            m = Cesium.Matrix4.multiplyByTranslation(m, pt);//m = m X pt

            //3 得到局部坐标原点的全局坐标
            var cart3 = ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(lng, lat, alt));
            //m1为局部坐标的z轴垂直于地表，局部坐标的y轴指向正北的4x4变换矩阵
            var m1 = Cesium.Transforms.eastNorthUpToFixedFrame(cart3);

            // 4 transform and print
            m = Cesium.Matrix4.multiplyTransformation(m, m1);//最终变换矩阵m = m X m1，从旋转前的局部坐标，到最终的全局Cartesian3坐标
            var p2 = Cesium.Matrix4.getTranslation(m);//根据m得到p2
            console.log('x=' + p2.x + ',y=' + p2.y + ',z=' + p2.z);

            return p2;
        };
    }


    // 设置相机不要在地表以下
    // ------------------------------------------------------------------------------------------
    if (typeof this.setCameraUpperGround != "function") {
        CesiumHelper.prototype.setCameraUpperGround = function () {

            // 思路
            // 监控相机的pitch值
            // pitch>0的时候就禁止地球旋转事件
            // 监控鼠标滚轮按下的鼠标移动事件
            // 当鼠标朝下移的时候就允许地球旋转


            //1.相机的pitch值大于0,则禁止球旋转操作
            this.scene.screenSpaceCameraController.minimumZoomDistance = 100;
            this.viewer.clock.onTick.addEventListener(function () {
                setMinCamera();
            });
            var that = this;
            var setMinCamera = function () {
                if (that.camera.pitch > 0) {
                    that.scene.screenSpaceCameraController.enableTilt = false;
                }
            };

            //2. 监控鼠标滚轮按下状态下移动鼠标事件，当鼠标向下移动的时候就允许地球旋转操作
            var startMousePosition;
            var mousePosition;
            var handler = new Cesium.ScreenSpaceEventHandler(canvas);
            handler.setInputAction(function (movement) {
                    mousePosition = startMousePosition = Cesium.Cartesian3.clone(movement.position); // MIDDLE_DOWN
                    handler.setInputAction(function (movement) {
                            mousePosition = movement.endPosition;
                            var y = mousePosition.y - startMousePosition.y;
                            if (y > 0) {
                                scene.screenSpaceCameraController.enableTilt = true;
                            }
                        },Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                },Cesium.ScreenSpaceEventType.MIDDLE_DOWN);
        };
    }


    // Part 4 Visual
    if (typeof this.setCameraLocAndOrient != "function") {
        CesiumHelper.prototype.setCameraLocAndOrient = function (lng, lat, height, heading, pitch, roll) {
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
    if (typeof this.flyCameraToLoc != "function") {
        CesiumHelper.prototype.flyCameraToLoc = function (lng, lat, height, heading, pitch, roll, delay_m_second, func_complete) {
            // lng,lat,height: 116.3, 12.0, 8000000
            // heading,pitch,roll: 15,-75,-10
            // delay_m_second: 1000
            var that = this;
            setTimeout(function () {
                that.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(lng, lat, height),
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

