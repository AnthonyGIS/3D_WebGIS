var isToolbarShow = false;


$('#showTaifeng').click(function () {
    dataSources.removeAll();
    var promise = dataSources.add(Cesium.CzmlDataSource.load("data/path/taifengPath.json"));
    promise.then(function (dataSource) {
        viewer.scene.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(110.792533, 19.823585, 2530000),
            orientation: { heading: 6 }
        });
    }).otherwise(function (error) { window.alert(error); });
});


$('#DrowTX').click(function () {
    if (isToolbarShow == false) {
        $("#toolbar").css("display", "inline");
        isToolbarShow = true;
    }
    else {
        $("#toolbar").css("display", "none");
        isToolbarShow = false;
    }
});