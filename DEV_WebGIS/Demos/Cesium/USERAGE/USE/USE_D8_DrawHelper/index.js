var viewer = null;
var scene = null;
var canvas = null;
var clock = null;
var camera = null;
var center = [119.21856526,29.48013237];



$(function () {

    var timer = null;

    $(document).ready(function () {
        initialGlobeView();
        Drawer_Helper_DemoUse.initialDrawHelper(viewer,"toolbar","logging");
        initialScreenDisplay();
    });

    function initialGlobeView() {

        var ion_defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmNTdmYzUwZS0yYmJkLTQwNTQtYjk3OC01ND" +
            "Q4ODhlZmFjZmEiLCJpZCI6NjY4Mywic2NvcGVzIjpbImFzbCIsImFzciIsImFzdyIsImdjIl0sImlhdCI6MTU0NzEyNjAyMX0.9C_6xLe-gC17O0_" +
            "0pRxDygYdzeMmvvYqiP2gzQLA5Vo";

        Cesium.Ion.defaultAccessToken = ion_defaultAccessToken;
        var terrainProvider = new Cesium.CesiumTerrainProvider({
            url: Cesium.IonResource.fromAssetId(1),
            // 请求照明
            requestVertexNormals: true,
            // 请求水波纹效果
            requestWaterMask: true
        });


        var image_googleSource = new Cesium.UrlTemplateImageryProvider({
            url: 'http://mt0.google.cn/vt/lyrs=s@702&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Ga',
            credit: ''
        });
        var label_googleSource = new Cesium.UrlTemplateImageryProvider({
            url: 'http://mt0.google.cn/vt/imgtp=png32&lyrs=h@365000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galil',
            credit: ''
        });

        viewer = new Cesium.Viewer('cesiumContainer', {
            geocoder: false,
            homeButton: true,
            sceneModePicker: true,
            fullscreenButton: false,
            vrButton: false,
            baseLayerPicker: false,
            animation: false,
            infoBox: false,
            selectionIndicator: false,
            timeline: false,
            navigationHelpButton: false,
            navigationInstructionsInitiallyVisible: false,
            mapProjection: new Cesium.WebMercatorProjection(),
            terrainProvider: terrainProvider,  //有时候访问不了高程数据，可暂时注释掉或者访问离线数据
            imageryProvider: image_googleSource

        });
        var layers = viewer.scene.imageryLayers;
        layers.addImageryProvider(label_googleSource);
        viewer.scene.globe.enableLighting = false; //太阳光

        scene = viewer.scene;
        canvas = viewer.canvas;
        clock = viewer.clock;
        camera = viewer.scene.camera;

        setTimeout(function () {
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(center[0], center[1], 100000),
                duration: 5,
                orientation: {
                    heading: Cesium.Math.toRadians(0.0),
                    pitch: Cesium.Math.toRadians(-90.0),
                    roll: 0.0
                }
            });
        }, 3000);
    }

    function  initialScreenDisplay() {
        var displayPanel = new CesiumCoordinateDisplay(viewer);
        displayPanel.AddStatusPanelHTML();
        displayPanel.InitialStatusPanel();
        displayPanel.SetMouseMoveEvent();
    }

});