// 屏幕坐标到经纬度
var scene = viewer.scene;
var camera = scene.camera;
var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

// 获取屏幕坐标
handler.setInputAction(function(event) {
    var x=event.position.x;
    var y= event.position.y;
    //当前屏幕坐标
    console.log("x,y:"+x+","+y);
    if (!Cesium.defined(event.position))
        return 0;
    var pickedObjects = scene.drillPick(event.position);
    //console.log(pickedObjects.length);
    if (!Cesium.defined(pickedObjects) || pickedObjects.length < 1)
    { 
        //closeInfo();
        return 0;
    } }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

// 经纬度到屏幕坐标
function LLToWndXY() {
    var position = Cesium.Cartesian3.fromDegrees(lng, lat);
    var clickPt = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, position);
    var screenX = clickPt.x;
    var screenY = clickPt.y;
    console.log("x,y="+screenX + "," + screenY);
}

// 经纬度到笛卡尔坐标
function LLToCartesianXY(lng, lat, alt) {
    var ellipsoid = viewer.scene.globe.ellipsoid;
    var coord_wgs84 = Cesium.Cartographic.fromDegrees(lng, lat, alt);
    var coord_xyz = ellipsoid.cartographicToCartesian(coord_wgs84);
    console.log("x,y,z"+coord_xyz.x + ',' + coord_xyz.y + ',' + coord_xyz.z);
}
