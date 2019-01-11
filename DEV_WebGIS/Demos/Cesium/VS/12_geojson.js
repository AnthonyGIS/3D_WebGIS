var viewer = new Cesium.Viewer('cesiumContainer');
var promise = viewer.dataSources.add(Cesium.GeoJsonDataSource.load('../../LIBS/Data/bou1_4l.json', {
    stroke: Cesium.Color.BLUE.withAlpha(0.3),//Cesium.Color.BLACK,
    fill: Cesium.Color.RED,
    strokeWidth: 2//,
    //markerSymbol: '?'
}));


// province
// ---------------------------------------------------------------------------
// Seed the random number generator for repeatable results.
Cesium.Math.setRandomNumberSeed(0);
var promise2 = Cesium.GeoJsonDataSource.load('../../LIBS/Data/bou2_4p.json');

promise2.then(function (dataSource) {
    viewer.dataSources.add(dataSource);
    var entities = dataSource.entities.values;
    var colorHash = {};
    var name_pro, entity, color;

    for (var i = 0; i < entities.length; i++) {
        entity = entities[i];
        name_pro = entity.name;
        color = colorHash[name_pro];
        if (!color) {
            color = Cesium.Color.fromRandom({
                alpha: 1.0
            });
            colorHash[name_pro] = color;
        }
        entity.polygon.material = color;
        entity.polygon.outline = false;
        entity.polygon.extrudedHeight = 5000.0;
    }
});
viewer.flyTo(promise2);