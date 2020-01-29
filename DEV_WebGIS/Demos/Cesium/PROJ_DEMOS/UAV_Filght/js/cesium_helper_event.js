var Cesium_Helper_Event = {};
Cesium_Helper_Event.viewer = null;

Cesium_Helper_Event.toRadians = function(viewer, cesium_event_type, func_callback) {
    // viewer, eg,var viewer = new Cesium.Viewer('container');
    // cesium_event_type: eg, Cesium.ScreenSpaceEventType.LEFT_CLICK, WHEEL
    // func_callback,eg,Cesium_Helper_Event.leftClickEventDemo，leftClickEventDemo_terrainHeight
    this.viewer = viewer;
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(func_callback, cesium_event_type);
};


//获取椭球体表面的经纬度坐标，大地高
Cesium_Helper_Event.leftClickEventDemo = function (event) {



    // DIFFERENCE
    var ellipsoid = this.viewer.scene.globe.ellipsoid; // 屏幕坐标转世界坐标——关键点
    var cartesian = this.viewer.camera.pickEllipsoid(event.position, ellipsoid);


    //将笛卡尔坐标转换为地理坐标
    var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    //将弧度转为度的十进制度表示
    var lng = Cesium.Math.toDegrees(cartographic.longitude);
    var lat = Cesium.Math.toDegrees(cartographic.latitude);
    var mapPosition={x:lng,y:lat,z:cartographic.height};//cartographic.height的值始终为零。
};




//获取椭球体表面的经纬度坐标，大地高
Cesium_Helper_Event.leftClickEventDemo_2 = function (movement) {

    var scene = this.viewer.scene;
    var cartesian = scene.camera.pickEllipsoid(movement.position, ellipsoid);
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



    ////相机移动结束事件
    //viewer.scene.camera.moveEnd.addEventListener(function(){
    //    //获取当前相机高度
    //    height = Math.ceil(earth.camera.positionCartographic.height); // Error 19.1.13 afternoon waste 2~3 valuable time.
    //});

};




// 获取地形表面经纬高
Cesium_Helper_Event.leftClickEventDemo_terrainHeight = function (event) {

    // DIFFERENCE
    var ray=this.viewer.camera.getPickRay(event.position); // 屏幕坐标转世界坐标——关键点
    var cartesian=this.viewer.scene.globe.pick(ray,this.viewer.scene);


    var cartographic = Cesium.Cartographic.fromCartesian(cartesian); //将笛卡尔坐标转换为地理坐标
    //将弧度转为度的十进制度表示
    var lon = Cesium.Math.toDegrees(cartographic.longitude);
    var lat = Cesium.Math.toDegrees(cartographic.latitude);
    // 获取海拔高度
    var height1 = this.viewer.scene.globe.getHeight(cartographic);
    var height2 = cartographic.height; // cartographic.height的值为地形高度。
};

// 模型表面的经纬度高程
Cesium_Helper_Event.leftClickEventDemo_modelHeight = function (evt) {

    var scene = this.viewer.scene;
    if (scene.mode !== Cesium.SceneMode.MORPHING) {
        var pickedObject = scene.pick(evt.position);
        if (scene.pickPositionSupported && Cesium.defined(pickedObject) && pickedObject.node) {
            var cartesian = scene.pickPosition(evt.position);
            if (Cesium.defined(cartesian)) {
                var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                var lng = Cesium.Math.toDegrees(cartographic.longitude);
                var lat = Cesium.Math.toDegrees(cartographic.latitude);
                var height = cartographic.height;//模型高度
                mapPosition={x:lng,y:lat,z:height};
            }
        }
    }
};


// 18年春季、夏初，当初进行倾斜摄影技术探索时封装的模型高度查看模块
Cesium_Helper_Event.mouseMoveEventDemo_getHeight = function (event) {

    var ray = this.viewer.scene.camera.getPickRay(event.endPosition);
    var pt_cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
    var pt_cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(pt_cartesian);
    var lng,lat,height,terrain_height;


    var feature = this.viewer.scene.pick(event.endPosition);
    if (feature === undefined) {
        lng = Cesium.Math.toDegrees(pt_cartographic.longitude);
        lat = Cesium.Math.toDegrees(pt_cartographic.latitude);
    }

    // 地形高度
    terrain_height = pt_cartographic.height;

    // 3D Tile 高度
    if (feature instanceof Cesium.Cesium3DTileFeature) {
        pt_cartesian = this.viewer.scene.pickPosition(event.endPosition);
        if (Cesium.defined(pt_cartesian)) {
            pt_cartographic = Cesium.Cartographic.fromCartesian(pt_cartesian);
            lng = Cesium.Math.toDegrees(pt_cartographic.longitude);
            lat = Cesium.Math.toDegrees(pt_cartographic.latitude);
            height = pt_cartographic.height;//模型高度,osgb Z
        }
    }


    // GLTF高度
    if (this.viewer.scene.mode === Cesium.SceneMode.MORPHING) {
        var pickedObject = scene.pick(event.endPosition);
        if (this.viewer.scene.pickPositionSupported && Cesium.defined(pickedObject) && pickedObject.node) {
            pt_cartesian = this.viewer.scene.pickPosition(event.endPosition);
            if (Cesium.defined(pt_cartesian)) {
                pt_cartographic = Cesium.Cartographic.fromCartesian(pt_cartesian);
                lng = Cesium.Math.toDegrees(pt_cartographic.longitude);
                lat = Cesium.Math.toDegrees(pt_cartographic.latitude);

                height = pt_cartographic.height;//模型高度
                // mapPosition = {x: lng, y: lat, z: height};
                console.log('（lng:' + lng.toFixed(8) + ',lat:' + lat.toFixed(8) + ')');
                console.log('gltf模型表面的的高度，gltf_Z: ' + height.toFixed(2));
            }
        }
    }
};