
var viewer = new Cesium.Viewer('cesiumContainer',
    {
        animation: false, //动画控制，默认true
        timeline: false,
        fullscreenButton: true,//全屏按钮,默认显示true
        geocoder: true,
        infoBox: false,//是否显示信息框
        selectionIndicator: false,
        homeButton: true,//主页按钮，默认true
        // infoBox:true,//点击要素之后显示的信息,默认true
        imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
            url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
            layer: "tdtVecBasicLayer",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "GoogleMapsCompatible",
            show: true
        }),
        baseLayerPicker: false, //打开后会和imageProvider冲突
        vrButton: true,  //打开VR 模式

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
viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
//天地图影像与标注
viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({

    url: 'http://t0.tianditu.com/img_w/wmts?',
    layer: 'img',
    style: 'default',
    format: 'tile',
    tileMatrixSetID: 'w',
    credit: new Cesium.Credit('天地图全球影像'),
    maximumLevel: 18
}));
viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
    url: "http://t0.tianditu.com/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
    layer: "tdtAnnoLayer",
    style: "default",
    format: "image/jpeg",
    tileMatrixSetID: "GoogleMapsCompatible",
    show: false
}));

var handler = new Cesium.ScreenSpaceEventHandler(canvas);

Cesium.GeoJsonDataSource.clampToGround = false;// clamp things on terrain

<!--坝塘-->
var batang = '<table class="table table-condensed table-striped table-bordered table-hover">' +
    '<thead><tr><th colspan="4" bgcolor="blue" style="text-align:center;">东风塘</th></tr></thead>' +
    '<tr><td>水库名称</td><td>东风塘</td><td>水库代码</td><td></td></tr>' +
    '<tr><td>行政区划代码</td><td>532901109000000</td><td>水库位置</td><td></td></tr>' +
    '<tr><td>所属水系</td><td></td><td>所在河流</td><td></td></tr>' +
    '<tr><td>工程规模</td><td>小坝塘</td><td>现状水质</td><td></td></tr>' +
    '<tr><td>目标水质</td><td></td><td>最大坝高（m）</td><td></td></tr>' +
    '<tr><td>径流面积（km2）</td><td>0.0000</td><td>多年平均径流量（万m3）</td><td></td></tr>' +
    '<tr><td>死水位（m）</td><td>0.0000</td><td>死库容（万m3）</td><td>0.0000</td></tr>' +
    '<tr><td>防洪限制水位（m）</td><td>0</td><td>正常蓄水位（m）</td><td></td></tr>' +
    '<tr><td>兴利库容（万m3）</td><td>0.0000</td><td>防洪高水位（m）</td><td></td></tr>' +
    '<tr><td>防洪库容（万m3）</td><td>0.0000</td><td>设计洪水位（m）</td><td></td></tr>' +
    '<tr><td>设计库容（万m3）</td><td>0.0000</td><td>校核洪水位（m）</td><td></td></tr>' +
    '<tr><td>总库容（万m3）</td><td>0.0000</td><td>调洪库容（万m3）</td><td></td></tr>' +
    '</table>';
// var dali = viewer.dataSources.add(Cesium.GeoJsonDataSource.load('../geojson/citybound.geojson'));
var DaliRiver = new Cesium.GeoJsonDataSource();
var labelEntity = viewer.entities.add({
    label: {
        show: false,
        showBackground: true,
        font: '20px 微软雅黑',
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        verticalOrigin: Cesium.VerticalOrigin.TOP,
        pixelOffset: new Cesium.Cartesian2(15, 0)
    }
});
var deselectColor = Cesium.Color.YELLOW.withAlpha(1);
var selectedColor = Cesium.Color.LIME.withAlpha(0.5);
var previousEntity;
var deselectMaterial = new Cesium.ColorMaterialProperty(
    new Cesium.ConstantProperty(deselectColor));
var selectedMaterial = new Cesium.ColorMaterialProperty(
    new Cesium.ConstantProperty(selectedColor));
DaliRiver.load('../../LIBS/Data/test.geojson', { //'../geojson/cityriver.geojson',
    // stroke: Cesium.Color.WHITE,
    fill: deselectColor,
    // strokeWidth: 2
}).then(
    function () {
        var RiverEntities = DaliRiver.entities.values;
        for (var j = 0; j < RiverEntities.length; j++) {
            var riverentity = RiverEntities[j]
            riverentity.description = riverentity.name;
            // riverentity.description = batang;
            console.log(riverentity.name);

            handler.setInputAction(function (movement) {
                var pickedObject = scene.pick(movement.endPosition);
                if (Cesium.defined(pickedObject))
                    newEntity = pickedObject.id;
                else {
                    if (Cesium.defined(previousEntity) && Cesium.defined(previousEntity.polyline)) {
                        previousEntity.polyline.material = deselectMaterial;
                    }
                    return;
                }
                //河流高亮
                // Cesium.knockout.getObservable(viewer, '_selectedEntity').subscribe(function(newEntity) {
                if (Cesium.defined(previousEntity) && Cesium.defined(previousEntity.polyline)) {
                    previousEntity.polyline.material = deselectMaterial;
                    previousEntity.polyline.width = 1;
                }
                if (Cesium.defined(newEntity) && Cesium.defined(newEntity.polyline)) {
                    newEntity.polyline.material = selectedMaterial;
                    newEntity.polyline.width = 2;
                }

                //显示标牌
                // if(newEntity == labelEntity)
                //     return;
                var foundPosition = false;
                if (scene.mode !== Cesium.SceneMode.MORPHING) {
                    if (scene.pickPositionSupported && Cesium.defined(pickedObject)) {
                        var cartesian = viewer.scene.pickPosition(movement.endPosition);

                        if (Cesium.defined(cartesian)) {
                            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                            // var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
                            // var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);
                            // var heightString = cartographic.height.toFixed(2);

                            labelEntity.position = cartesian;
                            labelEntity.label.show = true;
                            labelEntity.label.text = newEntity.name;
                            // 'Lon: ' + ('   ' + longitudeString).slice(-7) + '\u00B0' +
                            // '\nLat: ' + ('   ' + latitudeString).slice(-7) + '\u00B0' +
                            // '\nAlt: ' + ('   ' + heightString).slice(-7) + 'm';

                            labelEntity.label.eyeOffset = new Cesium.Cartesian3(0.0, 0.0, -cartographic.height * (scene.mode === Cesium.SceneMode.SCENE2D ? 1.5 : 1.0));

                            foundPosition = true;
                        }
                    }
                }

                if (!foundPosition) {
                    labelEntity.label.show = false;
                }
                previousEntity = newEntity;
                // });
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

            var actEntity;
            var c;
            handler.setInputAction(function (click) {
                var pickedObject = scene.pick(click.position);


                if (Cesium.defined(pickedObject) && (pickedObject.id != undefined)) {
                    actEntity = pickedObject.id;
                    var changedC = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, actEntity._polyline._positions._value[0]);

                    positionPopUp(changedC);
                    c = changedC;
                    $('#trackPopUp').show();
                    console.log(changedC);
                } else {
                    $('#trackPopUp').hide();
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);


            var removeHandler = viewer.scene.postRender.addEventListener(function () {
                if (actEntity != null) {
                    var changedC = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, actEntity._position._value);
                    // If things moved, move the popUp too
                    if ((c.x !== changedC.x) || (c.y !== changedC.y)) {
                        c = changedC;
                    }
                    positionPopUp(c);
                }
            });
        }
    }
);

viewer.dataSources.add(DaliRiver);
viewer.zoomTo(DaliRiver);

function positionPopUp(c) {
    var x = c.x - ($('#trackPopUpContent').width()) / 2;
    var y = c.y - ($('#trackPopUpContent').height());
    $('#trackPopUpContent').css('transform', 'translate3d(' + x + 'px, ' + y + 'px, 0)');
}

//   var infoDiv ='<div class="twipsy right" style="display: none; left: 962px; top: 425px;"><div class="twipsy-arrow"></div><div class="twipsy-inner"><p>Click on the globe to add your marker.</p></div></div>';
var infoDiv = '<div id="trackPopUp" style="display:none;">' +
    '<div id="trackPopUpContent" class="leaflet-popup" style="top:-40px;left:0;">' +
    '<a class="leaflet-popup-close-button" onclick="yincang()" > ×</a>' +
    '<div class="leaflet-popup-content-wrapper" style="overflow-y: hidden;width: 300px;">' +
    '<h4 id="trackPopUpLink" class="leaflet-popup-content" style="max-width: 300px;">Okhttp3中DiskLrcCache的使用</h4>' +
    '<div style="height: 110px;"><img style="width: 100%;height:100%;" src=""></div>' +
    '<div style="width:100%;overflow: hidden;"><div style="width:110%;overflow-y: auto;line-height: 1.80;font-weight: 700;font-size: 12px;">主要是okhttp3中缓存DiskLruCache类的使用完整例子，主要实现了写入、读取功能。</div></div>' +
    '</div>' +
    '<div class="leaflet-popup-tip-container">' +
    '<div class="leaflet-popup-tip"></div>' +
    '</div>' +
    '</div>' +
    '</div>';

$("#cesiumContainer").append(infoDiv);

$('.leaflet-popup-close-button').click(function () {
    $('#trackPopUp').hide();
});

function yincang() {
    $('#trackPopUp').hide();
}

/*viewer.dataSources.add(Cesium.GeoJsonDataSource.load('../geojson/countrybound_line.geojson'));
viewer.dataSources.add(Cesium.GeoJsonDataSource.load('../geojson/provincewaterfeatures_poly.geojson'));
viewer.dataSources.add(Cesium.GeoJsonDataSource.load('../geojson/townbasinbound.geojson'));
var chenggong = new Cesium.GeoJsonDataSource();
chenggong.load('../geojson/countrybound_cc.geojson',{
    fill: new Cesium.Color(1, 0, 0, 0.2),
    // stroke: Cesium.Color.HOTPINK,
    // strokeWidth: 3
}).then(function()  {

    var entities = chenggong.entities.values;
    var oldEntity;
    for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        // if (entity.properties.hasOwnProperty("description")) {
        //     entity.description = '<div style="height: 360px;">' + entity.properties.description + '</div>';
        // }
        // console.log(entity.valueOf("text"));
        console.log(entity.description);
        entity.description = entity.name+"的详情在这里显示。</br>"+ entity.name+"的entity唯一编码："+entity.id;
        entity.polygon.outline = true;
        // entity.polygon.outlineColor = Cesium.Color.fromRandom({
        //     alpha : 1.0
        // });
        console.log(entity.name);
        console.log(entity.properties.sszs);
        console.log(entity.properties.writetm);
        console.log(entity.properties.centerlat);
        console.log(entity.properties.centerlon);
        handler.setInputAction(function(movement) {
            var pickedObject = scene.pick(movement.endPosition);
            if (Cesium.defined(pickedObject)&& entity == pickedObject.id &&Cesium.defined(entity.polygon)) {

                if(Cesium.defined(oldEntity)&&(oldEntity!=entity))
                {
                    // oldEntity.polygon.outline.scale = 1.0;
                    oldEntity.polygon.outlineColor = Cesium.Color.YELLOW;
                }
                // entity.polygon.outline.scale = 10;
                entity.polygon.outlineColor = Cesium.Color.RED;
                oldEntity = entity;
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }
});
viewer.dataSources.add(chenggong);
viewer.zoomTo(chenggong);*/

var scene = viewer.scene;
var canvas = viewer.canvas;
canvas.setAttribute('tabindex', '0'); // needed to put focus on the canvas
canvas.onclick = function () {
    canvas.focus();
};
var ellipsoid = scene.globe.ellipsoid;

// // disable the default event handlers
// scene.screenSpaceCameraController.enableRotate = false;
// scene.screenSpaceCameraController.enableTranslate = false;
// scene.screenSpaceCameraController.enableZoom = false;
// scene.screenSpaceCameraController.enableTilt = false;
// scene.screenSpaceCameraController.enableLook = false;

var startMousePosition;
var mousePosition;
var flags = {
    looking: false,
    moveForward: false,
    moveBackward: false,
    moveUp: false,
    moveDown: false,
    moveLeft: false,
    moveRight: false
};


handler.setInputAction(function (movement) {
    flags.looking = true;
    mousePosition = startMousePosition = Cesium.Cartesian3.clone(movement.position);
}, Cesium.ScreenSpaceEventType.LEFT_DOWN);

handler.setInputAction(function (movement) {
    mousePosition = movement.endPosition;
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

handler.setInputAction(function (position) {
    flags.looking = false;
}, Cesium.ScreenSpaceEventType.LEFT_UP);

function getFlagForKeyCode(keyCode) {
    switch (keyCode) {
        case 'W'.charCodeAt(0):
            return 'moveForward';
        case 'S'.charCodeAt(0):
            return 'moveBackward';
        case 'Q'.charCodeAt(0):
            return 'moveUp';
        case 'E'.charCodeAt(0):
            return 'moveDown';
        case 'D'.charCodeAt(0):
            return 'moveRight';
        case 'A'.charCodeAt(0):
            return 'moveLeft';
        default:
            return undefined;
    }
}

document.addEventListener('keydown', function (e) {
    var flagName = getFlagForKeyCode(e.keyCode);
    if (typeof flagName !== 'undefined') {
        flags[flagName] = true;
    }
}, false);

document.addEventListener('keyup', function (e) {
    var flagName = getFlagForKeyCode(e.keyCode);
    if (typeof flagName !== 'undefined') {
        flags[flagName] = false;
    }
}, false);

viewer.clock.onTick.addEventListener(function (clock) {
    var camera = viewer.camera;

    // if (_flags.looking) {
    //     var width = canvas.clientWidth;
    //     var height = canvas.clientHeight;
    //
    //     // Coordinate (0.0, 0.0) will be where the mouse was clicked.
    //     var x = (_mousePosition.x - _startMousePosition.x) / width;
    //     var y = -(_mousePosition.y - _startMousePosition.y) / height;
    //
    //     var lookFactor = 0.05;
    //     camera.lookRight(x * lookFactor);
    //     camera.lookUp(y * lookFactor);
    // }

    // Change movement speed based on the distance of the camera to the surface of the ellipsoid.
    var cameraHeight = ellipsoid.cartesianToCartographic(camera.position).height;
    var moveRate = cameraHeight / 100.0;

    if (flags.moveForward) {
        camera.moveForward(moveRate);
    }
    if (flags.moveBackward) {
        camera.moveBackward(moveRate);
    }
    if (flags.moveUp) {
        camera.moveUp(moveRate);
    }
    if (flags.moveDown) {
        camera.moveDown(moveRate);
    }
    if (flags.moveLeft) {
        camera.moveLeft(moveRate);
    }
    if (flags.moveRight) {
        camera.moveRight(moveRate);
    }
});

var terrainProvider = new Cesium.CesiumTerrainProvider({
    url: '//assets.agi.com/stk-terrain/world'
});
viewer.terrainProvider = terrainProvider;

//隐藏比地形低的部分
viewer.scene.globe.depthTestAgainstTerrain = false;

var heading = Cesium.Math.toRadians(0);
var pitch = Cesium.Math.toRadians(30);
// viewer.flyTo(chenggong, new Cesium.HeadingPitchRange(heading, pitch));

// 去除版权信息
viewer._cesiumWidget._creditContainer.style.display = "none";

// viewer.extend(Cesium.viewerCesiumInspectorMixin);

//修改Home按钮指向（通过制定相机的默认范围实现）
Cesium.Camera.DEFAULT_VIEW_RECTANGLE =
    Cesium.Rectangle.fromDegrees(36.0, 36.0, 80.0, 80.0);

handler.setInputAction(function (click) {
    var pickedObject = scene.pick(click.position);
    if (Cesium.defined(pickedObject)) {
        highlightedEntity = pickedObject.id;
        // console.log (pickedObject.id);

    } else {
        highlightedEntity = undefined;
    }

}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
