var viewer = new Cesium.Viewer('cesiumContainer', {
    //2.本地图片
    // imageryProvider: new Cesium.SingleTileImageryProvider({
    //     url: 'worldimage.jpg'
    // }),
    //geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    baseLayerPicker: false,
    navigationHelpButton: false,
    animation: false,
    timeline: false,
    fullscreenButton: false,
    vrButton: false
});
//地形
//var viewer = new Cesium.Viewer('cesiumContainer');
// var cesiumTerrainProviderMeshes = new Cesium.CesiumTerrainProvider({
//     url: 'https://assets.agi.com/stk-terrain/v1/tilesets/world/tiles',
//     requestVertexNormals: true
// });
viewer.terrainProvider = Cesium.createWorldTerrain(); // cesiumTerrainProviderMeshes;

//普通线
function AddPolyline_TypeO(viewer) {
    var yellowLine = viewer.entities.add({
        name: 'Red line on the surface',
        corridor: {
            positions: Cesium.Cartesian3.fromDegreesArray([
                112.82436,
                23.071506,
                112.82742,
                23.067512,
                112.828878,
                23.064659,
                112.830799,
                23.060947,
                112.832166,
                24.058329
            ]),
            width: 10,
            material: Cesium.Color.RED
        }
    });
}

//第一种
function AddPolyline_TypeA(viewer) {
    var redCorridor = viewer.entities.add({
        name: 'BLUE corridor on surface with rounded corners',
        corridor: {
            positions: Cesium.Cartesian3.fromDegreesArray([
                112.82436,
                23.071506,
                112.82742,
                23.067512,
                112.828878,
                23.064659,
                112.830799,
                23.060947,
                112.832166,
                23.058329
            ]),
            width: 20.0,
            material: Cesium.Color.BLUE
        }
    });
}

//第二种 线
function AddPolyline_TypeB(viewer) {
    viewer.dataSources.add(Cesium.GeoJsonDataSource.load('Data/SnapTerrainLine/line.json', {
        clampToGround: true
    }));

    var cartographics = [new Cesium.Cartographic(112.82536, 23.071506),
        new Cesium.Cartographic(112.832166, 23.058329),
        new Cesium.Cartographic(112.833166, 23.059329),
        new Cesium.Cartographic(112.82636, 23.072506)
    ];
    var rectangle = Cesium.Rectangle.fromCartographicArray(cartographics);
}

// 第三种线
function AddPolyline_TypeC(viewer) {

    var rectanglePrimitive = viewer.scene.primitives.add(new Cesium.GroundPrimitive({
        geometryInstances: new Cesium.GeometryInstance({
            geometry: new Cesium.CorridorGeometry({
                vertexFormat: Cesium.VertexFormat.POSITION_ONLY,
                positions: Cesium.Cartesian3.fromDegreesArray([112.82536, 23.071506, 112.82742, 23.067512, 112.828878, 23.064659, 112.830799, 23.060947, 112.832166, 23.058329]),
                width: 40
            }),
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(0.0, 1.0, 0.0, 0.5))
            }
        }),
        classificationType: Cesium.ClassificationType.TERRAIN
    }));


    var rectanglePrimitive2 = viewer.scene.primitives.add(new Cesium.GroundPrimitive({
        geometryInstances: new Cesium.GeometryInstance({
            geometry: new Cesium.CorridorGeometry({
                vertexFormat: Cesium.VertexFormat.POSITION_ONLY,
                positions: Cesium.Cartesian3.fromDegreesArray(
                    [112.75311121, 23.03825472, 112.73895979, 23.03419165]),
                width: 40
            }),
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(1.0, 0.2, 0.0, 0.8))
            }
        }),
        classificationType: Cesium.ClassificationType.TERRAIN
    }));
}

//点云
function AddPointCloud(viewer) {
    var url2 = 'Data/SnapTerrainLine/tileset.json';
    var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
        url: url2
        //url : 'https://beta.cesium.com/api/assets/1460?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyMzk2YzJiOS1jZGFmLTRlZmYtYmQ4MS00NTA3NjEwMzViZTkiLCJpZCI6NDQsImFzc2V0cyI6WzE0NjBdLCJpYXQiOjE0OTkyNjQ3NTV9.oWjvN52CRQ-dk3xtvD4e8ZnOHZhoWSpJLlw115mbQJM'
    }));
    var style = {
        color: "color('#ff0000')"
    };
    style.pointSize = Cesium.defaultValue(style.pointSize, 5.0);
    tileset.style = new Cesium.Cesium3DTileStyle(style);
}

// continue
AddPolyline_TypeO(viewer); //Type 0 simple
AddPolyline_TypeA(viewer); // corridor
AddPolyline_TypeB(viewer);// clampToGround
AddPolyline_TypeC(viewer);
AddPointCloud(viewer);


var displayPanel = new CesiumCordinateDisplay(viewer);
displayPanel.AddStatusPanelHTML();
displayPanel.InitialStatusPanel();
displayPanel.SetMouseMoveEvent();





viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(112.82536, 23.071506, 500.0),
    orientation: {
        heading: Cesium.Math.toRadians(145.0),
        pitch: Cesium.Math.toRadians(-35.0),
        roll: 0.0
    }
});


/*var entity = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(112.82536, 23.071506, 100),
    ellipse: {
        semiMinorAxis: 300.0,
        semiMajorAxis: 300.0,
        material: Cesium.Color.BLUE.withAlpha(1.0) //可设置不同的MaterialProperty
    }
});

viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(112.82742, 23.067512, 200),
    ellipse: {
        semiMinorAxis: 300.0,
        semiMajorAxis: 300.0,
        material: Cesium.Color.AQUA.withAlpha(1.0) //可设置不同的MaterialProperty
    }
});*/
