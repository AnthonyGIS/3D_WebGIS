// ecnuzlwang-cesium-weather-master


var viewer = new Cesium.Viewer('cesiumContainer', {
    shadows: true
});


var center = Cesium.Cartesian3.fromDegrees(120.19877730,30.22265487, 1000.0);
//var center = Cesium.Cartesian3.fromRadians(2.11866508316772, 0.5438739412298422, 1000.0);
var weatherSim = new WeatherSim(viewer, center, 5000, 'weather-style.json');
viewer.scene.globe.enableLighting = true;
//weatherSim.snow(200);
weatherSim.autoUpdateWeather();
weatherSim.loadStyle();

// 倾斜摄影模型
/*viewer.extend(Cesium.viewerCesium3DTilesInspectorMixin);
var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
    url : 'zhjRoof/'
}));
tileset.style = new Cesium.Cesium3DTileStyle({
    color: {
        conditions: [
            ["(regExp('^10').test(${CLASS}))===true", "color('cyan')"],
            ["(regExp('^11').test(${CLASS}))", "color('red')"],
            ["(regExp('^12').test(${CLASS}))", "color('orange')"],
            ["(regExp('^15').test(${CLASS}))", "color('yellow')"],
            ["(regExp('^16').test(${CLASS}))", "color('lime')"],
            ["(regExp('^17').test(${CLASS}))", "color('purple')"],
            ["(regExp('^30').test(${CLASS}))", "color('blue')"],
            ["true", "rgb(127, 59, 8)"]
        ]
    }
});
tileset.readyPromise.then(function() {
    var boundingSphere = tileset.boundingSphere;
    viewer.camera.viewBoundingSphere(boundingSphere, new Cesium.HeadingPitchRange(0.0, -0.5, boundingSphere.radius * 2));
    viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
}).otherwise(function(error) {
    throw(error);
});*/


viewer.camera.flyTo({
    destination: center,
    orientation: {
        pitch: Cesium.Math.toRadians(-10)
    }
});

var codiantepaenl = new CesiumCordinateDisplay(viewer);
codiantepaenl.AddStatusPanelHTML();
codiantepaenl.InitialStatusPanel();
codiantepaenl.SetMouseMoveEvent();







// Information about the currently selected feature
var selected = {
    feature: undefined,
    originalColor: new Cesium.Color()
};
// An entity object which will hold info about the currently selected feature for infobox display
var selectedEntity = new Cesium.Entity();
// Color a feature on selection and show metadata in the InfoBox.
var clickHandler = viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {

    // If a feature was previously selected, undo the highlight
    if (Cesium.defined(selected.feature)) {
        selected.feature.color = selected.originalColor;
        selected.feature = undefined;
    }

    // Pick a new feature
    var pickedFeature = viewer.scene.pick(movement.position);
    if (!Cesium.defined(pickedFeature)) {
        clickHandler(movement);
        return;
    }

    // Select the feature if it's not already selected
    if (selected.feature === pickedFeature) {
        return;
    }
    selected.feature = pickedFeature;

    // Save the selected feature's original color
    /*if (pickedFeature === highlighted.feature) {
        Cesium.Color.clone(highlighted.originalColor, selected.originalColor);
        highlighted.feature = undefined;
    } else {
        Cesium.Color.clone(pickedFeature.color, selected.originalColor);
    }*/
    Cesium.Color.clone(pickedFeature.color, selected.originalColor);
    // Highlight newly selected feature
    pickedFeature.color = Cesium.Color.LIME;

    // Set feature infobox description
    var featureName = pickedFeature.getProperty('ID');
    selectedEntity.name = featureName;
    selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>';
    viewer.selectedEntity = selectedEntity;

    var classname = '';
    switch (pickedFeature.getProperty('CLASS')) {
        case '1001':
            classname = '厂矿企业';
            break;
        case '1002':
            classname = '商业建筑';
            break;
        case '1101':
            classname = '公寓 别墅';
            break;
        case '1102':
            classname = '小区';
            break;
        case '1103':
            classname = '其他居民建筑';
            break;
        case '1201':
            classname = '批发市场 建材';
            break;
        case '1202':
            classname = '餐饮';
            break;
        case '1203':
            classname = '百货商场商城';
            break;
        case '1204':
            classname = '其他商业';
            break;
        case '1505':
            classname = '其他运输相关建筑';
            break;
        case '1601':
            classname = '其他';
            break;
        case '1740':
            classname = '汽车代理店';
            break;
        case '1741':
            classname = '汽车服务';
            break;
        case '3002':
            classname = '公众活动性建筑';
            break;
        case '4001':
            classname = '大学';
            break;
        case '4002':
            classname = '中小学';
            break;
        case '6002':
            classname = '政府机关';
            break;
        case '7001':
            classname = '名胜古迹';
            break;
        case '8001':
            classname = '医院';
            break;
        case '9004':
            classname = '其他休闲设施';
            break;
        default:
            break;
    }
    selectedEntity.description = '<table class="cesium-infoBox-defaultTable"><tbody>' +
        '<tr><th>建筑编号</th><td>' + pickedFeature.getProperty('ID') + '</td></tr>' +
        '<tr><th>类别</th><td>' + classname + '</td></tr>' +
        '<tr><th>经度</th><td>' + pickedFeature.getProperty('centroidx') + '</td></tr>' +
        '<tr><th>纬度</th><td>' + pickedFeature.getProperty('centroidy') + '</td></tr>' +
        '<tr><th>高度</th><td>' + pickedFeature.getProperty('elevation') + '</td></tr>' +
        '<tr><th>面积</th><td>' + pickedFeature.getProperty('area') + '</td></tr>' +
        '</tbody></table>';
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
