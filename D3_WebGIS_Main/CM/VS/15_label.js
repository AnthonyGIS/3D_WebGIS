var viewer = new Cesium.Viewer('cesiumContainer', {
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    navigationHelpButton: false,
    timeline: false,
    animation: false
});

viewer.imageryLayers.removeAll();

viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(112.52133465950095, 23.071194052564465, 1063.5910571697082),
    orientation: {
        heading: 0.9183320934226114,
        pitch: -0.2851308873567558,
        roll: 0.00200137740773787
    }
});

//天地图在线影像
var TDTimageryLayer = new Cesium.WebMapTileServiceImageryProvider({
    url: "http://{s}.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
    layer: "tdtImgBasicLayer",
    style: "default",
    subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
    format: "image/jpeg",
    tileMatrixSetID: "GoogleMapsCompatible",
    maximumLevel: 17,
    credit: "天地图",
    show: true
});
//天地图在线影像注记
var TDTimageryLabel = new Cesium.WebMapTileServiceImageryProvider({
    url: "http://{s}.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
    layer: "tdtImgBasicLayer",
    style: "default",
    subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
    format: "image/jpeg",
    tileMatrixSetID: "GoogleMapsCompatible",
    maximumLevel: 17,
    credit: "天地图影像注记",
    show: true
});

viewer.imageryLayers.addImageryProvider(TDTimageryLayer);
viewer.imageryLayers.addImageryProvider(TDTimageryLabel);


var CreatePolyline = (function () {
    function _(positons) {
        if (!Cesium.defined(positons)) {
            throw new Cesium.DeveloperError('positions is required!');
        }
        if (positons.length < 2) {
            throw new Cesium.DeveloperError('positions 的长度必须大于等于2');
        }
        this.options = {
            Rectangle: {
                show: true,
                width: 2,
                material: Cesium.Color.YELLOW,
                outlineColor: true,
                height: 3000,
                followSurface: false
            }
        };
        this.path = positons;

        this._init();
    }

    _.prototype._init = function () {
        var that = this;
        var positionCBP = function () {
            coordinates = Cesium.Rectangle.fromCartesainArray(that.path, Cesium.Elliposid.WGS84)
            return coordinates;
        };
        this.options.Rectangle.coordinates = new Cesium.CallbackProperty(positionCBP, false);
        viewer.entities.add(this.options);
    };

    return _;
})();


var isDraw = false;
var polylinePath = [];
var Rectangle = undefined;

var handler = viewer.cesiumWidget.screenSpaceEventHandler;
handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

handler.setInputAction(function (movement) {
    var ray = viewer.scene.camera.getPickRay(movement.endPosition);

    var cartesian = viewer.scene.globe.pick(ray, viewer.scene);

    if (cartesian) {
        if (isDraw) {
            if (polylinePath.length < 1) {
                return;
            }
            if (!Cesium.defined(Rectangle)) {
                polylinePath.push(cartesian);

                Rectangle = new CreatePolyline(polylinePath);

            } else {
                Rectangle.path.pop();
                Rectangle.path.push(cartesian);
            }
        }
    }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

handler.setInputAction(function (movement) {
    var ray = viewer.scene.camera.getPickRay(movement.position);
    var cartesian = viewer.scene.globe.pick(ray, viewer.scene);
    if (cartesian) {
        if (isDraw) {
            polylinePath.push(cartesian);
        }
    }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

handler.setInputAction(function (movement) {
    isDraw = false;
    polylinePath = [];
    Rectangle = undefined;
}, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);


document.getElementById('startDraw').onclick = function () {
    isDraw = true;
};