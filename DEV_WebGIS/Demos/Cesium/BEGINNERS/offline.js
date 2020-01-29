//Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmNTdmYzUwZS0yYmJkLTQwNTQtYjk3OC01NDQ4ODhlZmFjZmEiLCJpZCI6NjY4Mywic2NvcGVzIjpbImFzbCIsImFzciIsImFzdyIsImdjIl0sImlhdCI6MTU0NzEyNjAyMX0.9C_6xLe-gC17O0_0pRxDygYdzeMmvvYqiP2gzQLA5Vo'
var viewer = new Cesium.Viewer('cesiumContainer');
viewer._cesiumWidget._creditContainer.style.display = "none";


var blueBox = viewer.entities.add({
    name : 'Blue box',
    position: Cesium.Cartesian3.fromDegrees(-114.0, 40.0, 300000.0),
    box : {
        dimensions : new Cesium.Cartesian3(400000.0, 300000.0, 500000.0),
        material : Cesium.Color.BLUE
    }
});

var redBox = viewer.entities.add({
    name : 'Red box with black outline',
    position: Cesium.Cartesian3.fromDegrees(-107.0, 40.0, 300000.0),
    box : {
        dimensions : new Cesium.Cartesian3(400000.0, 300000.0, 500000.0),
        material : Cesium.Color.RED.withAlpha(0.5),
        outline : true,
        outlineColor : Cesium.Color.BLACK
    }
});

var outlineOnly = viewer.entities.add({
    name : 'Yellow box outline',
    position: Cesium.Cartesian3.fromDegrees(-100.0, 40.0, 300000.0),
    box : {
        dimensions : new Cesium.Cartesian3(400000.0, 300000.0, 500000.0),
        fill : false,
        outline : true,
        outlineColor : Cesium.Color.YELLOW
    }
});

viewer.zoomTo(viewer.entities);
