var viewer = new Cesium.Viewer('cesiumContainer');

viewer.entities.add({
    rectangle: {
        coordinates: Cesium.Rectangle.fromDegrees(-100.0, 20.0, -90.0, 30.0),
        material: new Cesium.StripeMaterialProperty({
            evenColor: Cesium.Color.WHITE,
            oddColor: Cesium.Color.BLUE,
            repeat: 5
        })
    }
});



// area terrain
var entity = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(-103.0, 40.0),
    ellipse: {
        semiMinorAxis: 250000.0,
        semiMajorAxis: 400000.0,
        material: Cesium.Color.BLUE.withAlpha(0.5)
    }
});
viewer.zoomTo(viewer.entities);

var ellipse = entity.ellipse; // For upcoming examples





// box
var blueBox = viewer.entities.add({
    name: 'Blue box',
    position: Cesium.Cartesian3.fromDegrees(-114.0, 40.0, 300000.0),
    box: {
        dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 500000.0),
        material: Cesium.Color.BLUE
    }
});

var redBox = viewer.entities.add({
    name: 'Red box with black outline',
    position: Cesium.Cartesian3.fromDegrees(-107.0, 40.0, 300000.0),
    box: {
        dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 500000.0),
        material: Cesium.Color.RED.withAlpha(0.5),
        outline: true,
        outlineColor: Cesium.Color.BLACK
    }
});

var outlineOnly = viewer.entities.add({
    name: 'Yellow box outline',
    position: Cesium.Cartesian3.fromDegrees(-100.0, 40.0, 300000.0),
    box: {
        dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 500000.0),
        fill: false,
        outline: true,
        outlineColor: Cesium.Color.YELLOW
    }
});

viewer.zoomTo(viewer.entities);




// lines

var redLine = viewer.entities.add({
    name: 'Red line on the surface',
    polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray([-75, 35,
                                                        -125, 35]),
        width: 5,
        material: Cesium.Color.RED
    }
});

var glowingLine = viewer.entities.add({
    name: 'Glowing blue line on the surface',
    polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray([-75, 37,
                                                        -125, 37]),
        width: 10,
        material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.2,
            color: Cesium.Color.BLUE
        })
    }
});

var orangeOutlined = viewer.entities.add({
    name: 'Orange line with black outline at height and following the surface',
    polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights([-75, 39, 250000,
                                                               -125, 39, 250000]),
        width: 5,
        material: new Cesium.PolylineOutlineMaterialProperty({
            color: Cesium.Color.ORANGE,
            outlineWidth: 2,
            outlineColor: Cesium.Color.BLACK
        })
    }
});

var purpleArrow = viewer.entities.add({
    name: 'Purple straight arrow at height',
    polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights([-75, 43, 500000,
                                                               -125, 43, 500000]),
        width: 10,
        followSurface: false,
        material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.PURPLE)
    }
});

var dashedLine = viewer.entities.add({
    name: 'Blue dashed line',
    polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights([-75, 45, 500000,
                                                               -125, 45, 500000]),
        width: 4,
        material: new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.CYAN
        })
    }
});

viewer.zoomTo(viewer.entities);





// 椭球体
var blueEllipsoid = viewer.entities.add({
    name: 'Blue ellipsoid',
    position: Cesium.Cartesian3.fromDegrees(-114.0, 40.0, 300000.0),
    ellipsoid: {
        radii: new Cesium.Cartesian3(200000.0, 200000.0, 300000.0),
        material: Cesium.Color.BLUE
    }
});

var redSphere = viewer.entities.add({
    name: 'Red sphere with black outline',
    position: Cesium.Cartesian3.fromDegrees(-107.0, 40.0, 300000.0),
    ellipsoid: {
        radii: new Cesium.Cartesian3(300000.0, 300000.0, 300000.0),
        material: Cesium.Color.RED.withAlpha(0.5),
        outline: true,
        outlineColor: Cesium.Color.BLACK
    }
});

var outlineOnly = viewer.entities.add({
    name: 'Yellow ellipsoid outline',
    position: Cesium.Cartesian3.fromDegrees(-100.0, 40.0, 300000.0),
    ellipsoid: {
        radii: new Cesium.Cartesian3(200000.0, 200000.0, 300000.0),
        fill: false,
        outline: true,
        outlineColor: Cesium.Color.YELLOW,
        slicePartitions: 24,
        stackPartitions: 36
    }
});

viewer.zoomTo(viewer.entities);

