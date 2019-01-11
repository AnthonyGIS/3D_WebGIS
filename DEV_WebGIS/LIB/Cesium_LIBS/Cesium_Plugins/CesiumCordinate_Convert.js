var CesiumCorConvert = {


    // 经纬度、大地高(？)，到笛卡尔坐标
    Geo2CartesianXYZ: function (lng, lat, height, viewer) {
        var ellipsoid = viewer.scene.globe.ellipsoid;
        var cord_wgs84 = Cesium.Cartographic.fromDegrees(lng, lat, height);
        var cord_xyz = ellipsoid.cartographicToCartesian(cord_wgs84);
        console.log("x,y,z" + cord_xyz.x + ',' + cord_xyz.y + ',' + cord_xyz.z);

        return {x: cord_xyz.x, y: cord_xyz.y, z: cord_xyz.z};
    },

    // 笛卡尔坐标到经纬度
    CartesianXYZ2Geo: function (x, y, z, viewer) {
        var ellipsoid = viewer.global.ellipsoid;
        var cartesian3 = new Cesium.Cartesian3(x, y, z); //Cartesian3相当于Point3D
        var cartographic = ellipsoid.cartesianToCartographic(cartesian3);

        var lng = Cesium.Math.toDegrees(cartographic.longitude);
        var lat = Cesium.Math.toDegrees(cartographic.latitude);
        var alt = cartographic.height;

        // 经纬度转弧度
        // Cesium.CesiumMath.toRadians(degrees)

        return {lng: lng, lat: lat, z: alt};
    },

    // 屏幕坐标到经纬度
    Screen2LngLat: function (viewer) {
        var pick1 = new Cesium.Cartesian2(0, 0);
        var cord_screenXY =viewer.camera.getPickRay(pick1);
        var cord_geo =    viewer.scene.globe.pick(cord_screenXY, viewer.scene);
        return cord_geo;
    },

    // 经纬度到屏幕坐标
    LLToWndXY: function (lng,lat,viewer) {
        var position = Cesium.Cartesian3.fromDegrees(lng, lat);
        var clickPt = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, position);
        var screenX = clickPt.x;
        var screenY = clickPt.y;
        console.log("x,y=" + screenX + "," + screenY);
    },



    Demo: function (d, x, y, z, lng, lat, alt) {

        // Cesium.Matrix3（3x3矩阵，用于描述旋转变换）
        // Cesium.Matrix4（4x4矩阵，用于描述旋转加平移变换），
        // Cesium.Quaternion（四元数，用于描述围绕某个向量旋转一定角度的变换）

        var rotate = Cesium.Math.toRadians(d);//转成弧度
        var quat = Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Z, rotate); //quat为围绕这个z轴旋转d度的四元数
        var rot_mat3 = Cesium.Matrix3.fromQuaternion(quat);//rot_mat3为根据四元数求得的旋转矩阵
        var pt = new Cesium.Cartesian3(x, y, z);//p1的局部坐标
        var m = Cesium.Matrix4.fromRotationTranslation(rot_mat3, Cesium.Cartesian3.ZERO);
        // m2为旋转加平移的4x4变换矩阵，这里平移为(0, 0, 0)，故填个Cesium.Cartesian3.ZERO
        m = Cesium.Matrix4.multiplyByTranslation(m, pt);//m = m X v
        var cart3 = ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(lng, lat, alt)); //得到局部坐标原点的全局坐标
        var m1 = Cesium.Transforms.eastNorthUpToFixedFrame(cart3);//m1为局部坐标的z轴垂直于地表，局部坐标的y轴指向正北的4x4变换矩阵
        m = Cesium.Matrix4.multiplyTransformation(m, m1);//m = m X m1
        var p2 = Cesium.Matrix4.getTranslation(m);//根据最终变换矩阵m得到p2
        console.log('x=' + p2.x + ',y=' + p2.y + ',z=' + p2.z);
    },

    // 输出屏幕坐标
    Demo_PrintScreenCor: function (viewer) {

        var scene = viewer.scene;
        //var camera = scene.camera;
        var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

        // 获取屏幕坐标
        handler.setInputAction(function (event) {
            var x = event.position.x;
            var y = event.position.y;

            console.log("SCREEN x,y:" + x + "," + y); //当前屏幕坐标

            if (!Cesium.defined(event.position))
                return 0;
            var pickedObjects = scene.drillPick(event.position);
            //console.log(pickedObjects.length);
            if (!Cesium.defined(pickedObjects) || pickedObjects.length < 1) {
                //closeInfo();
                return 0;
            }


        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

};