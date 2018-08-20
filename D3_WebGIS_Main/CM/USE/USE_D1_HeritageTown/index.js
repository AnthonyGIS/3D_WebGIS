//获取终端屏幕大小
var mobile = 0;
var getDevice = (function () {
    var ua = navigator.userAgent;
    if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
        mobile = 1;
    } else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
        mobile = 2;
    } else {
        mobile = 0;
    }
})();

var smallScreen = 0;
var screenWidth = window.parent.screen.width;
if (screenWidth <= 640) {
    smallScreen = 1;
} else {
    smallScreen = 0;
}

//屏幕尺寸调整
if (mobile != 1) {
    setTimeout('resizeWindow()', 0);
} else {
    setTimeout('resizeWindow()', 1000);
}

function resizeWindow() {
    if (mobile != 0) {
        var screenWidth = window.innerWidth;
        var screenHeight = window.innerHeight;
        $(function () {
            document.body.style.height = screenHeight;
            $('#cesiumContainer').height(screenHeight);
            $('#blackOut').height(screenHeight);
        });
    }
    setTimeout('loadCesium()', 100);
}

//CC工具按钮的芯片化
$(function () {
    $('.license').tooltip();
});

//禁止滚动刷新
var cesiumDiv = document.getElementById("cesiumContainer");

function preventScroll(event) {
    event.preventDefault();
}

cesiumDiv.addEventListener("gesturestart", preventScroll, false);
cesiumDiv.addEventListener("gesturechange", preventScroll, false);
cesiumDiv.addEventListener("gestureend", preventScroll, false);

//各種DIV
var streetViewWrapper = document.getElementById("streetView_wrapper");
var streetViewDiv = document.getElementById("streetView");
var cesiumContainer = document.getElementById("cesiumContainer");
blackOutDiv = document.getElementById("blackOut");
svNotAvailable = document.getElementById("svNotAvailable");
svp = '';

//SV通话
var sv = new BMap.PanoramaService();

//隐藏SV错误信息层
$(function () {
    $(svNotAvailable).hide();
    $('#button4').hide();
});

//SV的通断状态参数，作为一个开关
var svWindow = 0;

//在视图返回的时间点相机参数的存储阵列
var cameraPosWC = [];
var cameraOrientation = [];

//停止時間
var stopISO = '2015-12-24T23:59:59+09:00';

//視点作成配列
function viewPoints(_label, _lat, _lng, _heading, _pitch, _range) {
    this.label = _label;
    this.lat = _lat;
    this.lng = _lng;
    this.heading = _heading;
    this.pitch = _pitch;
    this.range = _range;
}

var viewPointsArray = [];
viewPointsArray[0] = new viewPoints("中国高空", 30.479318, 113.539219, -20, -90, 7421711);
viewPointsArray[1] = new viewPoints("初期视点", 32.028182, 110.366811, -20, -25, 3421711);
viewPointsArray[2] = new viewPoints("中国全国", 30.479318, 113.539219, -20, -90, 3421711);

//创建Perspective(透视)菜单
var viewPointChangeMenu = document.getElementById('slide_menu');
var dropDownList = "";

for (var i = 0; i < viewPointsArray.length; i++) {
    dropDownList = dropDownList + '<li><a href="#" onclick = "changeViewPoint(' + i + ',' + '3.0);return false;">' + viewPointsArray[i].label + '</a></li>';
}

var viewPointChangeMenuHtml = '<ul class="viewpoint">' + dropDownList + '</ul>';
viewPointChangeMenu.innerHTML = viewPointChangeMenuHtml;

//czml配列作成
function czmlData(_label, _url) {
    this.label = _label;
    this.url = _url;
}

var czmlDataArray = [];
czmlDataArray[0] = new czmlData("ロードキル", 'data/czml/GuCunZhen-test.czml');

//覆盖数据数组
var overlayDataArray = [];
var openStreetMap = [];

//浏览器初始化
var viewer;
var layers;

function loadCesium() {
    viewer = new Cesium.Viewer('cesiumContainer', {
        imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
            url: '//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
            enablePickFeatures: false
        }),
        navigationHelpButton: false,
        navigationInstructionsInitiallyVisible: false,
        geocoder: false,
        homeButton: false,
        animation: false,
        sceneModePicker: false,
        baseLayerPicker: false,
        scene3DOnly: true
    });

    //地形にエンティティが潜るように設定
    viewer.scene.globe.depthTestAgainstTerrain = true;

    //设置地形网格
    var cesiumTerrainProviderMeshes = new Cesium.CesiumTerrainProvider({
        url: '//assets.agi.com/stk-terrain/world',
        requestWaterMask: false,
        requestVertexNormals: false
    });
    viewer.terrainProvider = cesiumTerrainProviderMeshes;

    //强调地形时更改的值
    viewer.terrainExaggeration = 1.0;

    //雾
    var fog = new Cesium.Fog();
    fog.density = 0.0005;
    fog.screenSpaceErrorFactor = 100.0;

    //devicePixelRatioの設定
    /*
    if(Cesium.FeatureDetection.supportsImageRenderingPixelated()){
        viewer.resolutionScale = window.devicePixelRatio;
    }
    */
    //禁止双击事件

    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    //引导顺序
    $(function () {
        $('.cesium-widget-credits').css('display', 'none');
    });

    fadeInOut(blackOutDiv, 0);

    layers = viewer.scene.imageryLayers;
    setTimeout('groundZero()', 1000);
}

function groundZero() {
    changeViewPoint(0, 2);
    openStreetMapLayer();
    setTimeout('landing()', 2000);
}

function landing() {
    changeViewPoint(1, 2);
    setTimeout('fadeInOut(blackOutDiv,1)', 3000);
    setTimeout('loadCzml()', 1000);
}

//加载CZML数据
function loadCzml() {
    var i = 0;
    var load = setInterval(function () {
        var czmlDataSource = new Cesium.CzmlDataSource();
        var promise = czmlDataSource.load(czmlDataArray[i].url);
        promise.then(function (dataSource) {
            viewer.dataSources.add(dataSource);
            var billboardsIdsLength = czmlDataSource.entities.values.length;

            console.log('billboardsIdsLength====================', billboardsIdsLength);

            var i = 1;
            while (i <= 0.5 * billboardsIdsLength) {
                var id = i;
                var entity = czmlDataSource.entities.getById(id);

                if (entity) {
                    if (smallScreen == 0) {
                        var scaleByDistance = new Cesium.NearFarScalar(2.0e4, 1.2, 1.0e5, 1.0);
                    } else {
                        var scaleByDistance = new Cesium.NearFarScalar(2.0e4, 1.0, 1.0e5, 1.0);
                    }
                    var translucencyByDistance = new Cesium.NearFarScalar(2.0e4, 1.0, 2.0e5, 0.6);
                    var translucencyByDistanceLabel = new Cesium.NearFarScalar(2.0e4, 0.9, 6.0e4, 0.0);
                    console.log('translucencyByDistanceLabel------------', translucencyByDistanceLabel);
                    entity.billboard.scaleByDistance = scaleByDistance;
                    entity.billboard.translucencyByDistance = translucencyByDistance;
                    entity.label.translucencyByDistance = translucencyByDistanceLabel;
                }

                i++;
            }
        }).otherwise(function (error) {
            alert('无法读取CZML数据');
        });
        i++;
        if (i == czmlDataArray.length) {
            clearInterval(load);
            setClickEvent();
            viewer.clock.onTick.addEventListener(function (clock) {
                var nowTime = viewer.clock.currentTime;
                setTimeout('checkTime()', 1000);
            });
            setTimeout('fadeInOut(blackOutDiv,0)', 3000);
        }
    }, 200);
}

//透明地图叠加功能
function openStreetMapLayer() {
    openStreetMap = layers.addImageryProvider(new Cesium.createOpenStreetMapImageryProvider());

    //OSM降低亮度
    openStreetMap.brightness = 0.7;

    //OSM默认透明度为零
    openStreetMap.alpha = 0;

    //叠加阵列创建功能
    function overlayData(_label, _value, _overlayObj, _id) {
        this.label = _label;
        this.value = _value;
        this.overlayObj = _overlayObj;
        this.id = _id;
    }

    overlayDataArray[0] = new overlayData("地图", 0, openStreetMap, "range01");

    var overlayList = "";
    for (var i = 0; i < overlayDataArray.length; i++) {
        overlayList = overlayList + '<p class="slide_label">' + overlayDataArray[i].label + '</p><input id="' + overlayDataArray[i].id + '" type="range" 	min="0" max="33" value="' + overlayDataArray[i].value * 0.33 + '" step="1" oninput="transParent(' + i + ');"/>';
    }
    var overlayListMenu = document.getElementById('slide_menu_area');
    overlayListMenu.innerHTML = overlayList;
}

//改变osm透明度的函数
function transParent(layer) {
    var id = overlayDataArray[layer].id;
    var overlay = overlayDataArray[layer].overlayObj;
    var slider = document.getElementById(id);
    if (slider.value == 0) {
        overlay.show = false;
    } else {
        overlay.show = true;
        overlay.alpha = slider.value * 0.03;
    }
}

//视点移动函数
function changeViewPoint(num, delay) {
    var newLat = viewPointsArray[num].lat;
    var newLng = viewPointsArray[num].lng;
    var newHeading = Cesium.Math.toRadians(viewPointsArray[num].heading);
    var newPitch = Cesium.Math.toRadians(viewPointsArray[num].pitch);
    var newRange = viewPointsArray[num].range;

    var center = Cesium.Cartesian3.fromDegrees(newLng, newLat);
    var boundingSphere = new Cesium.BoundingSphere(center, newRange);
    var headingPitchRange = new Cesium.HeadingPitchRange(newHeading, newPitch, newRange);

    viewer.camera.constrainedAxis = Cesium.Cartesian3.UNIT_Z;
    viewer.camera.flyToBoundingSphere(boundingSphere, {
        duration: delay,
        offset: headingPitchRange,
        easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT
    });
}

//地理编码函数
function geocode(input) {
    var geocoder = new BMap.Geocoder();
    //var input = document.getElementById('inputtext').value;
    geocoder.getPoint(input, function (point) {
        if (point) {
            var newHeadingGeo = Cesium.Math.toRadians(0);
            var newPitchGeo = Cesium.Math.toRadians(-45);
            var newRangeGeo = 4000;

            var GeoCenterCartesian = new Cesium.Cartesian3.fromDegrees(point.lng, point.lat, 750);
            var GeoBoundingSphere = new Cesium.BoundingSphere(GeoCenterCartesian, 1000);
            var GeoHeadingPitchRange = new Cesium.HeadingPitchRange(newHeadingGeo, newPitchGeo, newRangeGeo);

            viewer.camera.flyToBoundingSphere(GeoBoundingSphere, {
                duration: 1.5,
                offset: GeoHeadingPitchRange,
                easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT
            });
        } else {
            alert('找不到该地');
        }
    });
}

//搜索智能提示
// 百度地图API功能
function G(id) {
    return document.getElementById(id);
}

var map = new BMap.Map();

//建立一个自动完成的对象
var ac = new BMap.Autocomplete({
    "input": "inputtext",
    "location": map
});

//鼠标放在下拉列表上的事件
ac.addEventListener("onhighlight", function (e) {
    var str = "";
    var _value = e.fromitem.value;
    var value = "";
    if (e.fromitem.index > -1) {
        value = _value.province + _value.city + _value.district + _value.street + _value.business;
    }
    str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

    value = "";
    if (e.toitem.index > -1) {
        _value = e.toitem.value;
        value = _value.province + _value.city + _value.district + _value.street + _value.business;
    }
    str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
    G("searchResultPanel").innerHTML = str;
});

//鼠标点击下拉列表后的事件
var myValue;
ac.addEventListener("onconfirm", function (e) {
    var _value = e.item.value;
    myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
    G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

    geocode(myValue);
});

//ダブルクリックでストビューを表示する関数
// 与双击显示Sutobyu功能
function setClickEvent() {
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function (click) {
        var pickedObject = viewer.scene.pick(click.position); //挑选点击窗口的对象
        if (Cesium.defined(pickedObject) && (pickedObject.collection)) {
            if (svWindow == 0) {
                cameraPosWC = [viewer.camera.positionWC.x, viewer.camera.positionWC.y, viewer.camera.positionWC.z];
                cameraOrientation = [viewer.camera.heading, viewer.camera.pitch, viewer.camera.roll];
            }
            svOnOff(1);
            streetViewDiv.innerHTML = null;
            delete svp;
            var position = pickedObject.primitive._position;
            var cart = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
            var cartLon = Cesium.Math.toDegrees(cart.longitude);
            var cartLat = Cesium.Math.toDegrees(cart.latitude);
            var lnglat = new BMap.Point(cartLon, cartLat);
            sv.getPanoramaByLocation(lnglat, function (data) {
                //判断是否有全景图，并作出相应的行为
                if (data == null) {
                    svNotAvailable.innerHTML = '<p class="errorMessage">该地没有街景图</p>';
                    fadeInOut(svNotAvailable, 1);
                    setTimeout('fadeInOut(svNotAvailable,0)', 2000);
                    setTimeout('fadeInOut(streetView_wrapper,0)', 2000);
                    streetViewDiv.innerHTML = null;
                    delete svp;
                } else {
                    //设置全景图的控件
                    svp = new BMap.Panorama('streetView', {
                        albumsControl: true//显示相册控件
                    });
                    svp.setPosition(lnglat);
                    svp.setPov({pitch: 5.04, heading: 343.92});
                }
            });
            var newHeading = Cesium.Math.toRadians(0);
            var newPitch = Cesium.Math.toRadians(-45);
            var newRange = 4000;

            var centerCartesian = new Cesium.Cartesian3.fromDegrees(cartLon, cartLat, 750);
            var boundingSphere = new Cesium.BoundingSphere(centerCartesian, 1000);
            var headingPitchRange = new Cesium.HeadingPitchRange(newHeading, newPitch, newRange);

            viewer.camera.flyToBoundingSphere(boundingSphere, {
                duration: 1.5,
                offset: headingPitchRange,
                easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT
            });
        } else {
            //billboard以外的点是不能进行选择的
            if (pickedObject) {
                viewer.selectedEntity = void 0;
            }
            if (svWindow == 1) {
                svOnOff(0);
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

//检查时间
function checkTime() {
    viewer.clock.multiplier = 3000 * 60 * 60;
    var now = viewer.clock.currentTime;
    var stop = Cesium.JulianDate.fromIso8601(stopISO);
    var nowAndCurrent = Cesium.JulianDate.compare(now, stop);
    if (nowAndCurrent > 0) {
        viewer.clock.shouldAnimate = false;
    }
    var nowJST = new Cesium.JulianDate;
    Cesium.JulianDate.addHours(now, 9, nowJST);
    var nowIso = Cesium.JulianDate.toIso8601(nowJST);
    thisTime = '3.' + nowIso.substr(8, 2) + '.' + nowIso.substr(11, 2);

    var nowDate = Cesium.JulianDate.toDate(now);
    var y = nowDate.getFullYear();
    var m = nowDate.getMonth() + 1;
    var d = nowDate.getDate();
    if (m < 10) {
        m = '0' + m;
    }
    if (d < 10) {
        d = '0' + d;
    }
    var displayTime = y + '年' + m + '月' + d + '日';
    timeCounter(displayTime);
}

//显示计数器
function timeCounter(displayTime) {
    var timeCounter = document.getElementById("timeCounter");
    timeCounter.innerHTML = '<p class="timeCounter">' + displayTime + '</p>';
}

//移动到你当前所处的位置
function flyToMyLocation() {
    function fly(position) {
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(position.coords.longitude, position.coords.latitude, 1500.0),
            easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT
        });
    }

    navigator.geolocation.getCurrentPosition(fly);
}

//scneMode変更,切换到2D
/*function sceneModeChange(mode){
    if (mode == '2d'){
        location.href = "2d.html";
    } else {
        location.href = "index.html";
    }
}*/

//帮助
function help() {
    window.open('http://cesiumjs.org/');
}

//淡出DIV函数
function fadeInOut(layer, param) {
    if (param == 0) {
        $(function () {
            $(layer).fadeOut("slow");
        });
        delete layer;
        viewer.trackedEntity = undefined;
    } else {
        $(function () {
            $(layer).fadeIn("slow");
        });
    }
}

//消除streetViewWrapper的函数
//DIV淡出功能
//当param参数为0时隐藏全景图
function svOnOff(param) {
    if (param == 0) {
        streetViewWrapper.style.display = "none";
        streetViewDiv.innerHTML = null;
        delete svp;
        viewer.camera.flyTo({
            destination: new Cesium.Cartesian3(cameraPosWC[0], cameraPosWC[1], cameraPosWC[2]),
            orientation: {
                heading: cameraOrientation[0],
                pitch: cameraOrientation[1],
                roll: 0.0,
                duration: 1.5,
                easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT
            }
        });
        svWindow = 0;
    } else {
        streetViewWrapper.style.display = "block";
        svWindow = 1;
    }
}