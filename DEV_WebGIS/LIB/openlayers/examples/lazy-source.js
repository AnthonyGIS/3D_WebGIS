var source = new ol.source.OSM();

var layer = new ol.layer.Tile();

var map = new ol.Map({
  layers: [layer],
  target: 'map',
  view: new ol.View({
    center: [0, 0],
    zoom: 2
  })
});

document.getElementById('set-source').onclick = function() {
  layer.setSource(source);
};

document.getElementById('unset-source').onclick = function() {
  layer.setSource(null);
};
