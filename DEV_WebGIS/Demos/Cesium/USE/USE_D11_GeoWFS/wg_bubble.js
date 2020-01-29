// 气泡窗口div面板看实际情况的，也可以设置在页面html里面，我这里由于需要，是在js动态添加进来的。
// 动态添加气泡窗口DIV
// 核心的实现思路部分：如何动态刷新气泡窗口的位置
//（1）cesium的点击事件Cesium.ScreenSpaceEventType.LEFT_CLICK监听鼠标的当前位置坐标，然后根据当前坐标去动态更新气泡窗口div的显示位置；
//（2）监听cesium的postRender变化事件，这里特别关键，因为你拖拽球体移动，气泡窗口div也要对应移动的，气泡窗口的位置变化跟cesium球体是要动态刷新的；


var infoDiv = '<div id="trackPopUp" style="display:none;">' +
                             '<div id="trackPopUpContent" class="leaflet-popup" style="top:5px;left:0;">' +
                               '<a class="leaflet-popup-close-button" href="#">×</a>' +
                               '<div class="leaflet-popup-content-wrapper">' +
                               '<div id="trackPopUpLink" class="leaflet-popup-content" style="max-width: 300px;"></div>' +
                               '</div>' +
                               '<div class="leaflet-popup-tip-container">' +
                               '<div class="leaflet-popup-tip"></div>' +
                               '</div>' +
                               '</div>' +
 '</div>';
$("#" + Cesium.mapDivId).append(infoDiv);



//Cesium点击事件，获取当前位置
var canvas = scene.canvas;
var handler = new Cesium.ScreenSpaceEventHandler(canvas);
handler.setInputAction(function (movement) {
    //点击弹出气泡窗口
    var pick = viewer.scene.pick(movement.position);
    if (pick && pick.id) {//选中某模型       
    }
    else {
        $('#trackPopUp').hide();
    }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
//加载3D模型

//新气泡窗口的位置更新
function positionPopUp(c) {
    var x = c.x - ($('#trackPopUpContent').width()) / 2;
    var y = c.y - ($('#trackPopUpContent').height());
    $('#trackPopUpContent').css('transform', 'translate3d(' + x + 'px, ' + y + 'px, 0)');
}

//postRender变化事件
var removeHandler = viewer.scene.postRender.addEventListener(function () {
    var changedC = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, id._position._value);
    // If things moved, move the popUp too
    if ((c.x !== changedC.x) || (c.y !== changedC.y)) {
        c = changedC;
    }
});



// usage
var c = {x:120.183284,y:30.217559};

positionPopUp(c);


//handler.setInputAction(function (movement) {
//    // 通过指定的椭球或者地图对应的坐标系，将鼠标的二维坐标转换为对应椭球体三维坐标
//    pickway(movement.position);
//    pickImageryLayerFeature(viewer, movement.position, function (features) {
//        // features[0].imageryLayer.brightness = 5.0;
//    });
//    //气泡
//    var pickRay = scene.camera.getPickRay(movement.position);
//    Cesium.ImageryLayerCollection.prototype.pickImageryLayerFeatures(pickRay, scene).then(function (features) {
//        if (Cesium.defined(features)) {
//            var feature = features[0];//图层信息
//            var privader = feature.imageryLayer._imageryProvider._url;//url
//            var layerNam = feature.imageryLayer.layerName;//图层名字
//            var pickName = feature.name;//区域名字
//        }
//    });
//}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
