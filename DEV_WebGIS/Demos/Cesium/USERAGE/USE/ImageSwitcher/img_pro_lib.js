
/**
 * 地图切换控件
 */
function loadSwitcherMap(data) {
    var T = this;
    //设置底图不同类型
    var baseLayerSwitcherToolbar = new BaseLayerSwitcherToolBar({
        data: data
    });
    //$("#"+this.mapDivId).append(baseLayerSwitcherToolbar.target);
    $("#cesiumContainer").append(baseLayerSwitcherToolbar.target);
    var curlayer = null;
    var labellayer = null;
    baseLayerSwitcherToolbar.onItemClick = function (itemData, index, element) {
        var data = itemData;
        //清空指定ID的底图imageryLayers
        T.removeLayerByID("baseMap");
        switch (data.type) {
            case 2://天地图，矢量和注记分开
                var layers = T.cesiumViewer.scene.imageryLayers;
                curlayer = layers.addImageryProvider(returnProviderViewModel(MapConfig.mapInitParams.imageryViewModels[data.id]));
                //天地图注记配置信息
                var tdtLabel = {
                    type: 2,
                    proxyUrl: '',
                    Url: 'http://t{l}.tianditu.cn/cia_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles',
                    layer: 'tdtCiaBasicLayer',
                    style: 'default',
                    format: 'image/jpeg',
                    tileMatrixSetID: 'tdtMap'
                };
                labellayer = layers.addImageryProvider(returnProviderViewModel(tdtLabel));
                layers.lowerToBottom(labellayer);
                layers.lowerToBottom(curlayer);
                T.cesiumLayerList.push({layer: curlayer, id: "baseMap"});
                T.cesiumLayerList.push({layer: labellayer, id: "baseMap"});
                break;
            default:
                var layers = T.cesiumViewer.scene.imageryLayers;
                curlayer = layers.addImageryProvider(returnProviderViewModel(MapConfig.mapInitParams.imageryViewModels[data.id]));
                layers.lowerToBottom(curlayer);
                T.cesiumLayerList.push({layer: curlayer, id: "baseMap"});
                break;
        }
    };
}


/**
 * 返回地图服务imageryProvider
 * @method returnProviderViewModel
 * @param  model 配置文件中的底图服务列表其中一个选项
 * @return imageryProvider
 */
function returnProviderViewModel(model) {
    var provider = {};
    if (model.proxyUrl && model.proxyUrl.length > 0)
        provider = {proxy: new Cesium.DefaultProxy(model.proxyUrl), url: model.Url};
    else
        provider = {url: model.Url};
    switch (model.type) {
        case 0://ArcGisMapServerImageryProvider
            return new Cesium.ArcGisMapServerImageryProvider(provider);
            break;
        case 1://OpenStreetMapImageryProvider
            return Cesium.createOpenStreetMapImageryProvider(provider);
            break;
        case 2://WebMapTileServiceImageryProvider
            /*var obj= { layer:model.layer,style:model.style,format:model.format,tileMatrixSetID:model.tileMatrixSetID};
            provider = Object.assign(provider, obj);
            return new Cesium.WebMapTileServiceImageryProvider(provider);*/
            var obj = {
                layer: model.layer,
                style: model.style,
                format: model.format,
                tileMatrixSetID: model.tileMatrixSetID
            };
            provider = Object.assign(provider, obj);
            var tdtProvider = new TDTWMTSImageProvider(provider.url, false, 1, 18);
            return tdtProvider;
            break;
        case 3://TileMapServiceImageryProvider
            var obj = {credit: model.credit, fileExtension: model.fileExtension};
            provider = Object.assign(provider, obj);
            return Cesium.createTileMapServiceImageryProvider(provider);
            break;
        case 4://Cesium.UrlTemplateImageryProvider
            var obj = {credit: model.credit};
            provider = Object.assign(provider, obj);
            return new Cesium.UrlTemplateImageryProvider(provider);
            break;
        case 5://Cesium.WebMapServiceImageryProvider
            var obj = {credit: model.credit, layers: model.layers, tilingScheme: model.tilingScheme};
            provider = Object.assign(provider, obj);
            return new Cesium.WebMapServiceImageryProvider(provider);
            break;
        default:
            return new Cesium.ArcGisMapServerImageryProvider(provider);
            break;
    }
}
