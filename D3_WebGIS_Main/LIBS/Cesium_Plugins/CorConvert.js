

var CesiumCorConvert = {

    // ellipsoid 椭球体
    // 单位：度，度，米
    LngLat2Cartesian:function (lng,lat,height,viewer,result) {
        var ellipsoid=viewer.scene.globe.ellipsoid;
        return Cesium.Cartesian3.fromDegrees(lng,lat,height,ellipsoid,result);

        /*M2
        var cartographic=Cesium.Cartographic.fromDegrees(lng,lat,alt);
        var cartesian3=ellipsoid.cartographicToCartesian(cartographic);*/
    },

    // 米，米，米
    XYZ2LnglatEle:function (x,y,z,viewer) {
        var ellipsoid = viewer.global.ellipsoid;
        var cartesian3 = new Cesium.Cartesian3(x,y,z); //Cartesian3相当于Point3D
        var cartographic = ellipsoid.cartesianToCartographic(cartesian3);

        var lng = Cesium.Math.toDegrees(cartographic.longitude);
        var lat = Cesium.Math.toDegrees(cartographic.latitude);
        var alt = cartographic.height;

        // 经纬度转弧度
        // Cesium.CesiumMath.toRadians(degrees)

        return {lng:lng,lat:lat,z:alt};
    },
    
    Screen2LngLat:function (viewer) {
        var pick1= new Cesium.Cartesian2(0,0);
        var cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(pick1),viewer.scene);
        return cartesian;
    },


    // Cesium.Matrix3（3x3矩阵，用于描述旋转变换）
    // Cesium.Matrix4（4x4矩阵，用于描述旋转加平移变换），
    // Cesium.Quaternion（四元数，用于描述围绕某个向量旋转一定角度的变换）
    Demo:function (d,x,y,z, lng,lat,alt) {
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
    }


};