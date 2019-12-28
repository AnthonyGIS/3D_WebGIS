var viewer = new Cesium.Viewer('cesiumContainer', {timeline : false, animation : false});

var pinBuilder = new Cesium.PinBuilder();



// some pins
// -------------------------------------------------------------------------------
var bluePin = viewer.entities.add({
    name : 'Blank blue pin',
    position : Cesium.Cartesian3.fromDegrees(-75.170726, 39.9208667),
    billboard : {
        image : pinBuilder.fromColor(Cesium.Color.ROYALBLUE, 48).toDataURL(),
        verticalOrigin : Cesium.VerticalOrigin.BOTTOM
    }
});

var questionPin = viewer.entities.add({
    name : 'Question mark',
    position : Cesium.Cartesian3.fromDegrees(-75.1698529, 39.9220071),
    billboard : {
        image : pinBuilder.fromText('?', Cesium.Color.BLACK, 48).toDataURL(),
        verticalOrigin : Cesium.VerticalOrigin.BOTTOM
    }
});

var url = Cesium.buildModuleUrl('Assets/Textures/maki/grocery.png');
var groceryPin = Cesium.when(pinBuilder.fromUrl(url, Cesium.Color.GREEN, 48), function(canvas) {
    return viewer.entities.add({
        name : 'Grocery store',
        position : Cesium.Cartesian3.fromDegrees(-75.1705217, 39.921786),
        billboard : {
            image : canvas.toDataURL(),
            verticalOrigin : Cesium.VerticalOrigin.BOTTOM
        }
    });
});

//Create a red pin representing a hospital from the maki icon set.
var hospitalPin = Cesium.when(pinBuilder.fromMakiIconId('hospital', Cesium.Color.RED, 48), function(canvas) {
    return viewer.entities.add({
        name : 'Hospital',
        position : Cesium.Cartesian3.fromDegrees(-75.1698606, 39.9211275),
        billboard : {
            image : canvas.toDataURL(),
            verticalOrigin : Cesium.VerticalOrigin.BOTTOM
        }
    });
});
// -------------------------------------------------------------------------------


//Since some of the pins are created asynchronously, wait for them all to load before zooming/
Cesium.when.all([bluePin, questionPin, groceryPin, hospitalPin], function(pins){
    viewer.zoomTo(pins);
});

