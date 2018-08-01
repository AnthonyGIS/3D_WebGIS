var viewer = new Cesium.Viewer('cesiumContainer');

// Add a WMS imagery layer
/*var imageryLayers = viewer.imageryLayers;
imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
    url: 'https://nationalmap.gov.au/proxy/http://geoserver.nationalmap.nicta.com.au/geotopo_250k/ows',
    layers: 'Hydrography:bores',
    parameters: {
        transparent: true,
        format: 'image/png'
    }
}));*/

// Cesium加载Geoserver发布的WMS服务
// https://cesiumjs.org/tutorials/3D-Models-Tutorial/
var url = "http://10.33.168.159:8080/geoserver/weng_test/wms?transparent=true";  //请求路径为透明的方式，注意外网访问时，此处一定要将Localhost 改为服务器IP地址。
var parameters = { service: "WMS", version: "1.1.1", request: "GetMap", styles: "", format: "image/png" };  //请求方式：format为png格式
var privider = new Cesium.WebMapServiceImageryProvider({
    url: url,
    layers: 'weng_test:st_layer',  //图层的名称
    parameters: parameters
});
var layer = viewer.imageryLayers.addImageryProvider(privider);

// Start off looking at Australia.
viewer.camera.setView({
    destination: Cesium.Rectangle.fromDegrees(119.829617, 29.547073, 120.259616, 29.073752)
});