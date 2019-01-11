var info = {
    "examples": [
{ "link": "accessible.html", "example": "accessible.html", "title": "Accessible Map", "shortdesc": "Example of an accessible map.", "tags": "accessibility, tabindex", "requires": ["ol.Map", "ol.View", "ol.control", "ol.layer.Tile", "ol.source.OSM"] },
{ "link": "animation.html", "example": "animation.html", "title": "View Animation", "shortdesc": "Demonstrates animated pan, zoom, and rotation.", "tags": "animation", "requires": ["ol.Map", "ol.View", "ol.easing", "ol.layer.Tile", "ol.proj", "ol.source.OSM"] }, { "link": "arcgis-image.html", "example": "arcgis-image.html", "title": "Image ArcGIS MapServer", "shortdesc": "Example of an image ArcGIS layer.", "tags": "arcgis, image, dynamiclayer\"", "requires": ["ol.Map", "ol.View", "ol.layer.Tile", "ol.layer.Image", "ol.source.OSM", "ol.source.ImageArcGISRest"] },
{ "link": "arcgis-tiled.html", "example": "arcgis-tiled.html", "title": "Tiled ArcGIS MapServer", "shortdesc": "Example of a tiled ArcGIS layer.", "tags": "arcgis, tile, tilelayer\"", "requires": ["ol.Map", "ol.View", "ol.layer.Tile", "ol.source.OSM", "ol.source.TileArcGISRest"] }, { "link": "attributions.html", "example": "attributions.html", "title": "Attributions", "shortdesc": "Example of a attributions visibily change on map resize, to collapse them on small maps.", "tags": "attributions, openstreetmap", "requires": ["ol.Map", "ol.View", "ol.control", "ol.control.Attribution", "ol.layer.Tile", "ol.source.OSM"] },
{ "link": "bing-maps.html", "example": "bing-maps.html", "title": "Bing Maps", "shortdesc": "Example of a Bing Maps layer.", "tags": "bing, bing-maps", "requires": ["ol.Map", "ol.View", "ol.layer.Tile", "ol.source.BingMaps"] },
{ "link": "blend-modes.html", "example": "blend-modes.html", "title": "Blend Modes", "shortdesc": "Shows how to change the canvas compositing / blending mode in post- and precompose eventhandlers.", "tags": "blendmode, blend-mode, blend mode, blendingmode, blending-mode, blending mode, composition, compositing, canvas, vector", "requires": ["ol.Feature", "ol.Map", "ol.View", "ol.geom.Point", "ol.layer.Vector", "ol.source.Vector", "ol.style.Circle", "ol.style.Fill", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "box-selection.html", "example": "box-selection.html", "title": "Box Selection", "shortdesc": "Using a DragBox interaction to select features.", "tags": "DragBox, feature, selection, box", "requires": ["ol.Map", "ol.View", "ol.events.condition", "ol.format.GeoJSON", "ol.interaction.DragBox", "ol.interaction.Select", "ol.layer.Tile", "ol.layer.Vector", "ol.source.OSM", "ol.source.Vector"] },
{ "link": "button-title.html", "example": "button-title.html", "title": "Custom Tooltips", "shortdesc": "This example shows how to customize the buttons tooltips with Bootstrap.", "tags": "custom, tooltip", "requires": ["ol.Map", "ol.View", "ol.layer.Tile", "ol.source.OSM"] },
{ "link": "canvas-gradient-pattern.html", "example": "canvas-gradient-pattern.html", "title": "Styling feature with CanvasGradient or CanvasPattern", "shortdesc": "Example showing the countries vector layer styled with patterns and gradients.", "tags": "canvas, gradient, pattern, style", "requires": ["ol.Map", "ol.View", "ol.extent", "ol.format.GeoJSON", "ol.has", "ol.layer.Vector", "ol.proj", "ol.source.Vector", "ol.style.Fill", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "canvas-tiles.html", "example": "canvas-tiles.html", "title": "Canvas Tiles", "shortdesc": "Renders tiles with coordinates for debugging.", "tags": "layers, openstreetmap, canvas", "requires": ["ol.Map", "ol.View", "ol.control", "ol.layer.Tile", "ol.proj", "ol.source.OSM", "ol.source.TileDebug"] },
{ "link": "cartodb.html", "example": "cartodb.html", "title": "CartoDB source example", "shortdesc": "Example of a cartodb map.", "tags": "simple, openstreetmap, attribution", "requires": ["ol.Map", "ol.View", "ol.layer.Tile", "ol.source.CartoDB", "ol.source.OSM"] },
{ "link": "center.html", "example": "center.html", "title": "Advanced View Positioning", "shortdesc": "This example demonstrates how a map's view can be adjusted so a geometry or coordinate is positioned at a specific pixel location.", "tags": "center, rotation, openstreetmap", "requires": ["ol.Map", "ol.View", "ol.control", "ol.format.GeoJSON", "ol.layer.Tile", "ol.layer.Vector", "ol.source.OSM", "ol.source.Vector", "ol.style.Circle", "ol.style.Fill", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "cluster.html", "example": "cluster.html", "title": "Clustered Features", "shortdesc": "Example of using ol.source.Cluster.", "tags": "cluster, vector", "requires": ["ol.Feature", "ol.Map", "ol.View", "ol.geom.Point", "ol.layer.Tile", "ol.layer.Vector", "ol.source.Cluster", "ol.source.OSM", "ol.source.Vector", "ol.style.Circle", "ol.style.Fill", "ol.style.Stroke", "ol.style.Style", "ol.style.Text"] },
{ "link": "color-manipulation.html", "example": "color-manipulation.html", "title": "Color Manipulation", "shortdesc": "Demonstrates color manipulation with a raster source.", "tags": "color, hue, lightness, chroma", "requires": ["ol.Map", "ol.View", "ol.layer.Image", "ol.source.Raster", "ol.source.Stamen"] },
{ "link": "custom-controls.html", "example": "custom-controls.html", "title": "Custom Controls", "shortdesc": "Shows how to create custom controls.", "tags": "custom, control", "requires": ["ol.Map", "ol.View", "ol.control", "ol.control.Control", "ol.layer.Tile", "ol.source.OSM"] },
{ "link": "custom-icon.html", "example": "custom-icon.html", "title": "Custom Icon", "shortdesc": "Example using a custom attribution icon object", "tags": "icon, element", "requires": ["ol.Map", "ol.View", "ol.layer.Tile", "ol.source.OSM"] },
{ "link": "custom-interactions.html", "example": "custom-interactions.html", "title": "Custom Interactions", "shortdesc": "Example of a custom interaction.", "tags": "drag, feature, vector, editing, custom, interaction", "requires": ["ol.Feature", "ol.Map", "ol.View", "ol.geom.LineString", "ol.geom.Point", "ol.geom.Polygon", "ol.interaction", "ol.interaction.Pointer", "ol.layer.Tile", "ol.layer.Vector", "ol.source.TileJSON", "ol.source.Vector", "ol.style.Fill", "ol.style.Icon", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "d3.html", "example": "d3.html", "title": "d3 Integration", "shortdesc": "Example of using OpenLayers and d3 together.", "tags": "d3", "requires": ["ol.Map", "ol.View", "ol.extent", "ol.layer.Image", "ol.layer.Tile", "ol.proj", "ol.source.ImageCanvas", "ol.source.Stamen"] },
{ "link": "device-orientation.html", "example": "device-orientation.html", "title": "Device Orientation", "shortdesc": "Listen to DeviceOrientation events.", "tags": "device, orientation, gyronorm", "requires": ["ol.Map", "ol.View", "ol.control", "ol.layer.Tile", "ol.math", "ol.proj", "ol.source.OSM"] },
{ "link": "drag-and-drop-image-vector.html", "example": "drag-and-drop-image-vector.html", "title": "Drag-and-Drop Image Vector", "shortdesc": "Example of using the drag-and-drop interaction with image vector rendering.", "tags": "drag-and-drop-image-vector, gpx, geojson, igc, kml, topojson, vector, image", "requires": ["ol.Map", "ol.View", "ol.format.GPX", "ol.format.GeoJSON", "ol.format.IGC", "ol.format.KML", "ol.format.TopoJSON", "ol.interaction", "ol.interaction.DragAndDrop", "ol.layer.Vector", "ol.layer.Tile", "ol.source.BingMaps", "ol.source.Vector", "ol.style.Circle", "ol.style.Fill", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "drag-and-drop.html", "example": "drag-and-drop.html", "title": "Drag-and-Drop", "shortdesc": "Example of using the drag-and-drop interaction.", "tags": "drag-and-drop, gpx, geojson, igc, kml, topojson", "requires": ["ol.Map", "ol.View", "ol.format.GPX", "ol.format.GeoJSON", "ol.format.IGC", "ol.format.KML", "ol.format.TopoJSON", "ol.interaction", "ol.interaction.DragAndDrop", "ol.layer.Tile", "ol.layer.Vector", "ol.source.BingMaps", "ol.source.Vector", "ol.style.Circle", "ol.style.Fill", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "drag-rotate-and-zoom.html", "example": "drag-rotate-and-zoom.html", "title": "Drag, Rotate, and Zoom", "shortdesc": "A single interaction to drag, rotate, and zoom.", "tags": "drag, rotate, zoom, interaction", "requires": ["ol.Map", "ol.View", "ol.interaction", "ol.interaction.DragRotateAndZoom", "ol.layer.Tile", "ol.source.OSM"] },
{ "link": "draw-and-modify-features.html", "example": "draw-and-modify-features.html", "title": "Draw and Modify Features", "shortdesc": "Example of using the ol.interaction.Draw interaction together with the ol.interaction.Modify interaction.", "tags": "draw, edit, modify, vector, featureoverlay", "requires": ["ol.Map", "ol.View", "ol.interaction.Draw", "ol.interaction.Modify", "ol.interaction.Snap", "ol.layer.Tile", "ol.layer.Vector", "ol.source.OSM", "ol.source.Vector", "ol.style.Circle", "ol.style.Fill", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "draw-features.html", "example": "draw-features.html", "title": "Draw Features", "shortdesc": "Example of using the ol.interaction.Draw interaction.", "tags": "draw, edit, freehand, vector", "requires": ["ol.Map", "ol.View", "ol.interaction.Draw", "ol.layer.Tile", "ol.layer.Vector", "ol.source.OSM", "ol.source.Vector"] },
{ "link": "draw-freehand.html", "example": "draw-freehand.html", "title": "Freehand Drawing", "shortdesc": "Example using the ol.interaction.Draw interaction in freehand mode.", "tags": "draw, edit, freehand, vector", "requires": ["ol.Map", "ol.View", "ol.interaction.Draw", "ol.layer.Tile", "ol.layer.Vector", "ol.source.OSM", "ol.source.Vector"] },
{ "link": "draw-shapes.html", "example": "draw-shapes.html", "title": "Draw Shapes", "shortdesc": "Using the ol.interaction.Draw to create regular shapes", "tags": "draw, edit, freehand, vector", "requires": ["ol.Map", "ol.View", "ol.geom.Polygon", "ol.interaction.Draw", "ol.layer.Tile", "ol.layer.Vector", "ol.source.OSM", "ol.source.Vector"] },
{ "link": "dynamic-data.html", "example": "dynamic-data.html", "title": "Dynamic Data", "shortdesc": "Example of dynamic data.", "tags": "dynamic-data", "requires": ["ol.Map", "ol.View", "ol.geom.MultiPoint", "ol.geom.Point", "ol.layer.Tile", "ol.source.OSM", "ol.style.Circle", "ol.style.Fill", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "earthquake-clusters.html", "example": "earthquake-clusters.html", "title": "Earthquake Clusters", "shortdesc": "Demonstrates the use of style geometries to render source features of a cluster.", "tags": "KML, vector, style, geometry, cluster", "requires": ["ol.Map", "ol.View", "ol.extent", "ol.format.KML", "ol.interaction", "ol.interaction.Select", "ol.layer.Tile", "ol.layer.Vector", "ol.source.Cluster", "ol.source.Stamen", "ol.source.Vector", "ol.style.Circle", "ol.style.Fill", "ol.style.RegularShape", "ol.style.Stroke", "ol.style.Style", "ol.style.Text"] },
{ "link": "earthquake-custom-symbol.html", "example": "earthquake-custom-symbol.html", "title": "Earthquakes with custom symbols", "shortdesc": "Demonstrates the use of `ol.render.toCanvas` to create custom icon symbols.", "tags": "KML, vector, style, canvas, symbol", "requires": ["ol.Map", "ol.View", "ol.format.KML", "ol.geom.Polygon", "ol.layer.Tile", "ol.layer.Vector", "ol.render", "ol.source.Stamen", "ol.source.Vector", "ol.style.Fill", "ol.style.Icon", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "epsg-4326.html", "example": "epsg-4326.html", "title": "EPSG:4326", "shortdesc": "Example of a map in EPSG:4326.", "tags": "epsg4326", "requires": ["ol.Map", "ol.View", "ol.control", "ol.control.ScaleLine", "ol.layer.Tile", "ol.source.TileWMS"] },
{ "link": "export-map.html", "example": "export-map.html", "title": "Map Export", "shortdesc": "Example of exporting a map as a PNG image.", "tags": "export, png, openstreetmap", "requires": ["ol.Map", "ol.View", "ol.control", "ol.format.GeoJSON", "ol.layer.Tile", "ol.layer.Vector", "ol.source.OSM", "ol.source.Vector"] },
{ "link": "export-pdf.html", "example": "export-pdf.html", "title": "Export PDF example", "shortdesc": "Example of exporting a map as a PDF.", "tags": "export, pdf, openstreetmap", "requires": ["ol.Map", "ol.View", "ol.control", "ol.format.WKT", "ol.layer.Tile", "ol.layer.Vector", "ol.source.OSM", "ol.source.Vector"] },
{ "link": "extent-interaction.html", "example": "extent-interaction.html", "title": "Extent Interaction", "shortdesc": "Using an Extent interaction to draw an extent.", "tags": "Extent, interaction, box", "requires": ["ol.Map", "ol.View", "ol.events.condition", "ol.format.GeoJSON", "ol.interaction.Extent", "ol.layer.Tile", "ol.layer.Vector", "ol.source.OSM", "ol.source.Vector"] },
{ "link": "feature-animation.html", "example": "feature-animation.html", "title": "Custom Animation", "shortdesc": "Demonstrates how to animate features.", "tags": "animation, vector, feature, flash", "requires": ["ol.Feature", "ol.Map", "ol.Observable", "ol.View", "ol.control", "ol.easing", "ol.geom.Point", "ol.layer.Tile", "ol.layer.Vector", "ol.proj", "ol.source.OSM", "ol.source.Vector", "ol.style.Circle", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "feature-move-animation.html", "example": "feature-move-animation.html", "title": "Marker Animation", "shortdesc": "Demonstrates how to move a feature along a line.", "tags": "animation, feature, postcompose, polyline", "requires": ["ol.Feature", "ol.Map", "ol.View", "ol.format.Polyline", "ol.geom.Point", "ol.layer.Tile", "ol.layer.Vector", "ol.source.BingMaps", "ol.source.Vector", "ol.style.Circle", "ol.style.Fill", "ol.style.Icon", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "flight-animation.html", "example": "flight-animation.html", "title": "Flight Animation", "shortdesc": "Demonstrates how to animate flights with ´postcompose´.", "tags": "animation, vector, feature, flights, arc", "requires": ["ol.Feature", "ol.Map", "ol.View", "ol.geom.LineString", "ol.layer.Tile", "ol.layer.Vector", "ol.proj", "ol.source.Stamen", "ol.source.Vector", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "fractal.html", "example": "fractal.html", "title": "Fractal Rendering", "shortdesc": "Example of a fractal.", "tags": "fractal, vector", "requires": ["ol.Feature", "ol.Map", "ol.View", "ol.geom.LineString", "ol.layer.Vector", "ol.source.Vector"] },
{ "link": "full-screen-drag-rotate-and-zoom.html", "example": "full-screen-drag-rotate-and-zoom.html", "title": "Full Screen Drag, Rotate, and Zoom", "shortdesc": "Example of drag rotate and zoom control with full screen effect.", "tags": "full-screen, drag, rotate, zoom, bing, bing-maps", "requires": ["ol.Map", "ol.View", "ol.control", "ol.control.FullScreen", "ol.interaction", "ol.interaction.DragRotateAndZoom", "ol.layer.Tile", "ol.source.BingMaps"] },
{ "link": "full-screen-source.html", "example": "full-screen-source.html", "title": "Full Screen Control with extended source element", "shortdesc": "Example of a full screen control with a source option definition.", "tags": "full-screen, source, fullScreenSource, osm, osm-maps", "requires": ["ol.Map", "ol.View", "ol.control", "ol.control.FullScreen", "ol.layer.Tile", "ol.source.OSM"] },
{ "link": "full-screen.html", "example": "full-screen.html", "title": "Full Screen Control", "shortdesc": "Example of a full screen control.", "tags": "full-screen, bing, bing-maps", "requires": ["ol.Map", "ol.View", "ol.control", "ol.control.FullScreen", "ol.layer.Tile", "ol.source.BingMaps"] },
{ "link": "geojson-vt.html", "example": "geojson-vt.html", "title": "geojson-vt integration", "shortdesc": "Slice GeoJSON into vector tiles on the fly in the browser.", "tags": "mapbox, vector, tiles, geojson", "requires": ["ol.Map", "ol.View", "ol.format.GeoJSON", "ol.source.OSM", "ol.source.VectorTile", "ol.layer.Tile", "ol.layer.VectorTile", "ol.proj.Projection"] },
{ "link": "geojson.html", "example": "geojson.html", "title": "GeoJSON", "shortdesc": "Example of GeoJSON features.", "tags": "geojson, vector, openstreetmap", "requires": ["ol.Feature", "ol.Map", "ol.View", "ol.control", "ol.format.GeoJSON", "ol.geom.Circle", "ol.layer.Tile", "ol.layer.Vector", "ol.source.OSM", "ol.source.Vector", "ol.style.Circle", "ol.style.Fill", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "geolocation-orientation.html", "example": "geolocation-orientation.html", "title": "Geolocation Tracking with Orientation", "shortdesc": "Example of a geolocated and oriented map.", "tags": "fullscreen, geolocation, orientation, mobile", "requires": ["ol.Geolocation", "ol.Map", "ol.Overlay", "ol.View", "ol.control", "ol.geom.LineString", "ol.layer.Tile", "ol.proj", "ol.source.OSM"] },
{ "link": "geolocation.html", "example": "geolocation.html", "title": "Geolocation", "shortdesc": "Using geolocation to control a map view.", "tags": "geolocation, openstreetmap", "requires": ["ol.Feature", "ol.Geolocation", "ol.Map", "ol.View", "ol.control", "ol.geom.Point", "ol.layer.Tile", "ol.layer.Vector", "ol.source.OSM", "ol.source.Vector", "ol.style.Circle", "ol.style.Fill", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "getfeatureinfo-image.html", "example": "getfeatureinfo-image.html", "title": "WMS GetFeatureInfo (Image Layer)", "shortdesc": "Using an image WMS source with GetFeatureInfo requests", "tags": "getfeatureinfo, forEachLayerAtPixel", "requires": ["ol.Map", "ol.View", "ol.layer.Image", "ol.source.ImageWMS"] },
{ "link": "getfeatureinfo-layers.html", "example": "getfeatureinfo-layers.html", "title": "WMS GetFeatureInfo (Layers)", "shortdesc": "Shows how to fetch features per layer name in a single WMS GetFeatureInfo request\n", "requires": ["ol.format.WMSGetFeatureInfo"] },
{ "link": "getfeatureinfo-tile.html", "example": "getfeatureinfo-tile.html", "title": "WMS GetFeatureInfo (Tile Layer)", "shortdesc": "Issuing GetFeatureInfo requests with a WMS tiled source", "tags": "getfeatureinfo, forEachLayerAtPixel", "requires": ["ol.Map", "ol.View", "ol.layer.Tile", "ol.source.TileWMS"] },
{ "link": "gpx.html", "example": "gpx.html", "title": "GPX Data", "shortdesc": "Example of using the GPX source.", "tags": "GPX", "requires": ["ol.Map", "ol.View", "ol.format.GPX", "ol.layer.Tile", "ol.layer.Vector", "ol.source.BingMaps", "ol.source.Vector", "ol.style.Circle", "ol.style.Fill", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "graticule.html", "example": "graticule.html", "title": "Map Graticule", "shortdesc": "This example shows how to add a graticule overlay to a map.", "tags": "graticule", "requires": ["ol.Graticule", "ol.Map", "ol.View", "ol.layer.Tile", "ol.proj", "ol.source.OSM", "ol.style.Stroke"] },
{ "link": "heatmap-earthquakes.html", "example": "heatmap-earthquakes.html", "title": "Earthquakes Heatmap", "shortdesc": "Demonstrates the use of a heatmap layer.", "tags": "heatmap, kml, vector, style", "requires": ["ol.Map", "ol.View", "ol.format.KML", "ol.layer.Heatmap", "ol.layer.Tile", "ol.source.Stamen", "ol.source.Vector"] },
{ "link": "here-maps.html", "example": "here-maps.html", "title": "HERE Map Tile API", "shortdesc": "Example of a map with map tiles from HERE.", "tags": "here, here-maps, here-tile-api", "requires": ["ol.Map", "ol.View", "ol.layer.Tile", "ol.source.XYZ"] },
{ "link": "hit-tolerance.html", "example": "hit-tolerance.html", "title": "Hit Tolerance", "shortdesc": "Example using the hitTolerance parameter.", "tags": "hitTolerance", "requires": ["ol.Map", "ol.View", "ol.layer.Tile", "ol.layer.Vector", "ol.source.OSM", "ol.source.Vector", "ol.Feature", "ol.geom.LineString", "ol.style.Style", "ol.style.Stroke"] },
{ "link": "icon-color.html", "example": "icon-color.html", "title": "Icon Colors", "shortdesc": "Example assigning a custom color to an icon", "tags": "vector, style, icon, marker", "requires": ["ol.Feature", "ol.Map", "ol.View", "ol.geom.Point", "ol.layer.Tile", "ol.layer.Vector", "ol.proj", "ol.source.TileJSON", "ol.source.Vector", "ol.style.Icon", "ol.style.Style"] },
{ "link": "icon-negative.html", "example": "icon-negative.html", "title": "Icon Pixel Operations", "shortdesc": "Canvas pixel operations on a point icon.", "tags": "vector, style, icon, marker, canvas, select", "requires": ["ol.Feature", "ol.Map", "ol.View", "ol.geom.Point", "ol.interaction.Select", "ol.layer.Tile", "ol.layer.Vector", "ol.source.Stamen", "ol.source.Vector", "ol.style.Icon", "ol.style.Style"] },
{ "link": "icon-sprite-webgl.html", "example": "icon-sprite-webgl.html", "title": "Icon Sprites with WebGL", "shortdesc": "Icon sprite with WebGL", "tags": "webgl, icon, sprite, vector, point", "requires": ["ol.Feature", "ol.Map", "ol.View", "ol.geom.Point", "ol.layer.Vector", "ol.source.Vector", "ol.style.Icon", "ol.style.Style"] },
{ "link": "icon.html", "example": "icon.html", "title": "Icon Symbolizer", "shortdesc": "Example using an icon to symbolize a point.", "tags": "vector, style, icon, marker, popup", "requires": ["ol.Feature", "ol.Map", "ol.Overlay", "ol.View", "ol.geom.Point", "ol.layer.Tile", "ol.layer.Vector", "ol.source.TileJSON", "ol.source.Vector", "ol.style.Icon", "ol.style.Style"] },
{ "link": "igc.html", "example": "igc.html", "title": "IGC Data", "shortdesc": "Example of tracks recorded from multiple paraglider flights on the same day, read from an IGC file.", "tags": "complex-geometry, closest-feature, igc, opencyclemap", "requires": ["ol.Feature", "ol.Map", "ol.View", "ol.control", "ol.format.IGC", "ol.geom.LineString", "ol.geom.Point", "ol.layer.Tile", "ol.layer.Vector", "ol.source.OSM", "ol.source.Vector", "ol.style.Circle", "ol.style.Fill", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "image-filter.html", "example": "image-filter.html", "title": "Image Filters", "shortdesc": "Apply a filter to imagery", "tags": "filter, image manipulation", "requires": ["ol.Map", "ol.View", "ol.layer.Tile", "ol.proj", "ol.source.BingMaps"] },
{ "link": "image-load-events.html", "example": "image-load-events.html", "title": "Image Load Events", "shortdesc": "Example using image load events.", "tags": "image, events, loading", "requires": ["ol.Map", "ol.View", "ol.layer.Image", "ol.source.ImageWMS"] },
{ "link": "image-vector-layer.html", "example": "image-vector-layer.html", "title": "Image Vector Layer", "shortdesc": "Example of an image vector layer.", "tags": "vector, image", "requires": ["ol.Map", "ol.View", "ol.format.GeoJSON", "ol.layer.Vector", "ol.source.Vector", "ol.style.Fill", "ol.style.Stroke", "ol.style.Style", "ol.style.Text"] },
{ "link": "jsts.html", "example": "jsts.html", "title": "JSTS Integration", "shortdesc": "Example on how to use JSTS with OpenLayers.", "tags": "vector, jsts, buffer", "requires": ["ol.Map", "ol.View", "ol.format.GeoJSON", "ol.layer.Tile", "ol.layer.Vector", "ol.proj", "ol.source.OSM", "ol.source.Vector"] },
{ "link": "kml-earthquakes.html", "example": "kml-earthquakes.html", "title": "Earthquakes in KML", "shortdesc": "Demonstrates the use of a Shape symbolizer to render earthquake locations.", "tags": "KML, vector, style, tooltip", "requires": ["ol.Map", "ol.View", "ol.format.KML", "ol.layer.Tile", "ol.layer.Vector", "ol.source.Stamen", "ol.source.Vector", "ol.style.Circle", "ol.style.Fill", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "kml-timezones.html", "example": "kml-timezones.html", "title": "Timezones in KML", "shortdesc": "Demonstrates rendering timezones from KML.", "tags": "KML, vector, style", "requires": ["ol.Map", "ol.View", "ol.format.KML", "ol.layer.Tile", "ol.layer.Vector", "ol.source.Stamen", "ol.source.Vector", "ol.style.Fill", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "kml.html", "example": "kml.html", "title": "KML", "shortdesc": "Rendering KML with a vector source.", "tags": "KML", "requires": ["ol.Map", "ol.View", "ol.format.KML", "ol.layer.Tile", "ol.layer.Vector", "ol.proj", "ol.source.BingMaps", "ol.source.Vector"] },
{ "link": "layer-clipping-webgl.html", "example": "layer-clipping-webgl.html", "title": "Layer Clipping with WebGL", "shortdesc": "Layer WebGL clipping example.", "tags": "clipping, webgl, openstreetmap", "requires": ["ol.Map", "ol.View", "ol.control", "ol.has", "ol.layer.Tile", "ol.source.OSM"] },
{ "link": "layer-clipping.html", "example": "layer-clipping.html", "title": "Layer Clipping", "shortdesc": "Layer clipping example", "tags": "clipping, openstreetmap", "requires": ["ol.Map", "ol.View", "ol.control", "ol.layer.Tile", "ol.source.OSM"] },
{ "link": "layer-extent.html", "example": "layer-extent.html", "title": "Limited Layer Extent", "shortdesc": "Restricting layer rendering to a limited extent.", "tags": "extent, tilejson", "requires": ["ol.Map", "ol.View", "ol.layer.Tile", "ol.proj", "ol.source.TileJSON"] },
{ "link": "layer-group.html", "example": "layer-group.html", "title": "Layer Groups", "shortdesc": "Example of a map with layer group.", "tags": "tilejson, input, bind, group, layergroup", "requires": ["ol.Map", "ol.View", "ol.layer.Group", "ol.layer.Tile", "ol.proj", "ol.source.OSM", "ol.source.TileJSON"] },
{ "link": "layer-spy.html", "example": "layer-spy.html", "title": "Layer Spy", "shortdesc": "View a portion of one layer over another", "tags": "spy, image manipulation", "requires": ["ol.Map", "ol.View", "ol.layer.Tile", "ol.proj", "ol.source.BingMaps"] },
{ "link": "layer-swipe.html", "example": "layer-swipe.html", "title": "Layer Swipe", "shortdesc": "Example of a Layer swipe map.", "tags": "swipe, openstreetmap", "requires": ["ol.Map", "ol.View", "ol.control", "ol.layer.Tile", "ol.source.BingMaps", "ol.source.OSM"] },
{ "link": "layer-z-index.html", "example": "layer-z-index.html", "title": "Layer Z-Index", "shortdesc": "Example of ordering layers using Z-index.", "tags": "layer, ordering, z-index", "requires": ["ol.Feature", "ol.Map", "ol.View", "ol.geom.Point", "ol.layer.Vector", "ol.source.Vector", "ol.style.Fill", "ol.style.RegularShape", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "lazy-source.html", "example": "lazy-source.html", "title": "Lazy Source", "shortdesc": "Example of setting a layer source after construction.", "tags": "source", "requires": ["ol.Map", "ol.View", "ol.layer.Tile", "ol.source.OSM"] },
{ "link": "line-arrows.html", "example": "line-arrows.html", "title": "LineString Arrows", "shortdesc": "Example of drawing arrows for each line string segment.", "tags": "draw, vector, arrow", "requires": ["ol.Map", "ol.View", "ol.geom.Point", "ol.interaction.Draw", "ol.layer.Tile", "ol.layer.Vector", "ol.source.OSM", "ol.source.Vector", "ol.style.Icon", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "localized-openstreetmap.html", "example": "localized-openstreetmap.html", "title": "Localized OpenStreetMap", "shortdesc": "Example of a localized OpenStreetMap map with a custom tile server and a custom attribution.", "tags": "localized-openstreetmap, openseamap, openstreetmap", "requires": ["ol.Map", "ol.View", "ol.control", "ol.layer.Tile", "ol.source.OSM"] },
{ "link": "magnify.html", "example": "magnify.html", "title": "Magnify", "shortdesc": "Show a magnified version of imager under the pointer", "tags": "magnify, image manipulation", "requires": ["ol.Map", "ol.View", "ol.layer.Tile", "ol.proj", "ol.source.BingMaps"] },
{ "link": "mapbox-vector-tiles-advanced.html", "example": "mapbox-vector-tiles-advanced.html", "title": "Advanced Mapbox Vector Tiles", "shortdesc": "Example of a Mapbox vector tiles map with custom tile grid.", "tags": "mapbox, vector, tiles, mobile", "requires": ["ol.Map", "ol.View", "ol.format.MVT", "ol.layer.VectorTile", "ol.proj", "ol.source.VectorTile", "ol.style.Fill", "ol.style.Icon", "ol.style.Stroke", "ol.style.Style", "ol.style.Text", "ol.tilegrid.TileGrid"] },
{ "link": "mapbox-vector-tiles.html", "example": "mapbox-vector-tiles.html", "title": "Mapbox Vector Tiles", "shortdesc": "Example of a Mapbox vector tiles map.", "tags": "simple, mapbox, vector, tiles", "requires": ["ol.Map", "ol.View", "ol.format.MVT", "ol.layer.VectorTile", "ol.source.VectorTile", "ol.style.Fill", "ol.style.Icon", "ol.style.Stroke", "ol.style.Style", "ol.style.Text"] },
{ "link": "mapguide-untiled.html", "example": "mapguide-untiled.html", "title": "MapGuide Untiled", "shortdesc": "Example of a untiled MapGuide map.", "tags": "mapguide", "requires": ["ol.Map", "ol.View", "ol.layer.Image", "ol.source.ImageMapGuide"] },
{ "link": "measure.html", "example": "measure.html", "title": "Measure", "shortdesc": "Using a draw interaction to measure lengths and areas.", "tags": "draw, edit, measure, vector", "requires": ["ol.Map", "ol.Observable", "ol.Overlay", "ol.Sphere", "ol.View", "ol.geom.LineString", "ol.geom.Polygon", "ol.interaction.Draw", "ol.layer.Tile", "ol.layer.Vector", "ol.source.OSM", "ol.source.Vector", "ol.style.Circle", "ol.style.Fill", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "min-max-resolution.html", "example": "min-max-resolution.html", "title": "Layer Min/Max Resolution", "shortdesc": "Show/hide layers depending on current view resolution.", "tags": "minResolution, maxResolution, resolution", "requires": ["ol.Map", "ol.View", "ol.control", "ol.layer.Tile", "ol.source.OSM", "ol.source.TileJSON"] },
{ "link": "min-zoom.html", "example": "min-zoom.html", "title": "View Min-Zoom", "shortdesc": "Demonstrates how the view's minimum zoom level can be changed.", "tags": "min, zoom", "requires": ["ol.Map", "ol.View", "ol.layer.Tile", "ol.source.OSM"] },
{ "link": "mobile-full-screen.html", "example": "mobile-full-screen.html", "title": "Full-Screen Mobile", "shortdesc": "Example of a full screen map.", "tags": "fullscreen, geolocation, mobile", "requires": ["ol.Geolocation", "ol.Map", "ol.View", "ol.layer.Tile", "ol.source.BingMaps"] },
{ "link": "modify-features.html", "example": "modify-features.html", "title": "Modify Features", "shortdesc": "Editing features with the modify interaction.", "tags": "modify, edit, vector", "requires": ["ol.Map", "ol.View", "ol.format.GeoJSON", "ol.interaction", "ol.interaction.Modify", "ol.interaction.Select", "ol.layer.Tile", "ol.layer.Vector", "ol.source.OSM", "ol.source.Vector"] },
{ "link": "modify-test.html", "example": "modify-test.html", "title": "Modify Features Test", "shortdesc": "Example for testing feature modification.", "tags": "modify, edit, vector", "requires": ["ol.Map", "ol.View", "ol.format.GeoJSON", "ol.interaction", "ol.interaction.Modify", "ol.interaction.Select", "ol.layer.Vector", "ol.source.Vector", "ol.style.Circle", "ol.style.Fill", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "mouse-position.html", "example": "mouse-position.html", "title": "Mouse Position", "shortdesc": "Example of a mouse position control, outside the map.", "tags": "mouse-position, openstreetmap", "requires": ["ol.Map", "ol.View", "ol.control", "ol.control.MousePosition", "ol.coordinate", "ol.layer.Tile", "ol.source.OSM"] },
{ "link": "mousewheel-zoom.html", "example": "mousewheel-zoom.html", "title": "Mousewheel/Trackpad Zoom", "shortdesc": "Restrict wheel/trackpad zooming to integer zoom levels.", "tags": "trackpad, mousewheel, zoom, interaction", "requires": ["ol.Map", "ol.View", "ol.interaction", "ol.interaction.MouseWheelZoom", "ol.layer.Tile", "ol.source.OSM"] },
{ "link": "moveend.html", "example": "moveend.html", "title": "Moveend Event", "shortdesc": "Use of the moveend event.", "tags": "moveend, map, event", "requires": ["ol.Map", "ol.View", "ol.control", "ol.extent", "ol.layer.Tile", "ol.proj", "ol.source.OSM"] },
{ "link": "navigation-controls.html", "example": "navigation-controls.html", "title": "Navigation Controls", "shortdesc": "Shows how to add navigation controls.", "tags": "control, navigation, extent", "requires": ["ol.Map", "ol.View", "ol.control", "ol.control.ZoomToExtent", "ol.layer.Tile", "ol.source.OSM"] },
{ "link": "osm-vector-tiles.html", "example": "osm-vector-tiles.html", "title": "OSM Vector Tiles", "shortdesc": "Using OpenStreetMap vector tiles.", "tags": "vector, tiles, osm, mapzen", "requires": ["ol.Map", "ol.View", "ol.format.TopoJSON", "ol.layer.VectorTile", "ol.proj", "ol.source.VectorTile", "ol.style.Fill", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "overlay.html", "example": "overlay.html", "title": "Overlay", "shortdesc": "Demonstrates overlays.", "tags": "overlay, popup, bootstrap, popover", "requires": ["ol.Map", "ol.Overlay", "ol.View", "ol.coordinate", "ol.layer.Tile", "ol.proj", "ol.source.OSM"] },
{ "link": "overviewmap-custom.html", "example": "overviewmap-custom.html", "title": "Custom Overview Map", "shortdesc": "Example of OverviewMap control with advanced customization.", "tags": "overview, overviewmap", "requires": ["ol.Map", "ol.View", "ol.control", "ol.control.OverviewMap", "ol.interaction", "ol.interaction.DragRotateAndZoom", "ol.layer.Tile", "ol.source.OSM"] },
{ "link": "overviewmap.html", "example": "overviewmap.html", "title": "Overview Map Control", "shortdesc": "Example of OverviewMap control.", "tags": "overview, overviewmap", "requires": ["ol.Map", "ol.View", "ol.control", "ol.control.OverviewMap", "ol.layer.Tile", "ol.source.OSM"] },
{ "link": "permalink.html", "example": "permalink.html", "title": "Permalink", "shortdesc": "Example on how to create permalinks.", "tags": "permalink, openstreetmap, history", "requires": ["ol.Map", "ol.View", "ol.control", "ol.layer.Tile", "ol.source.OSM"] },
{ "link": "pinch-zoom.html", "example": "pinch-zoom.html", "title": "Pinch Zoom", "shortdesc": "Restrict pinch zooming to integer zoom levels.", "tags": "pinch, zoom, interaction", "requires": ["ol.Map", "ol.View", "ol.interaction", "ol.interaction.PinchZoom", "ol.layer.Tile", "ol.source.OSM"] },
{ "link": "polygon-styles.html", "example": "polygon-styles.html", "title": "Custom Polygon Styles", "shortdesc": "Showing the vertices of a polygon with a custom style geometry.", "tags": "polygon, vector, style, GeometryFunction", "requires": ["ol.Map", "ol.View", "ol.format.GeoJSON", "ol.geom.MultiPoint", "ol.layer.Vector", "ol.source.Vector", "ol.style.Circle", "ol.style.Fill", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "popup.html", "example": "popup.html", "title": "Popup", "shortdesc": "Uses an overlay to create a popup.", "tags": "overlay, popup", "requires": ["ol.Map", "ol.Overlay", "ol.View", "ol.coordinate", "ol.layer.Tile", "ol.proj", "ol.source.TileJSON"] },
{ "link": "preload.html", "example": "preload.html", "title": "Preload Tiles", "shortdesc": "Example of tile preloading.", "tags": "preload, bing", "requires": ["ol.Map", "ol.View", "ol.layer.Tile", "ol.source.BingMaps"] },
{ "link": "raster.html", "example": "raster.html", "title": "Raster Source", "shortdesc": "Demonstrates pixelwise operations with a raster source.", "tags": "raster, pixel", "requires": ["ol.Map", "ol.View", "ol.layer.Image", "ol.layer.Tile", "ol.source.BingMaps", "ol.source.Raster"] },
{ "link": "region-growing.html", "example": "region-growing.html", "title": "Region Growing", "shortdesc": "Grow a region from a seed pixel", "tags": "raster, region growing", "requires": ["ol.Map", "ol.View", "ol.layer.Image", "ol.layer.Tile", "ol.proj", "ol.source.BingMaps", "ol.source.Raster"] },
{ "link": "regularshape.html", "example": "regularshape.html", "title": "Regular Shapes", "shortdesc": "Example of some Regular Shape styles.", "tags": "vector, symbol, regularshape, style, square, cross, star, triangle, x", "requires": ["ol.Feature", "ol.Map", "ol.View", "ol.geom.Point", "ol.layer.Vector", "ol.source.Vector", "ol.style.Fill", "ol.style.RegularShape", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "render-geometry.html", "example": "render-geometry.html", "title": "Render geometries to a canvas", "shortdesc": "Example of rendering geometries to an arbitrary canvas.", "tags": "render, geometry, canvas", "requires": ["ol.geom.LineString", "ol.geom.Point", "ol.geom.Polygon", "ol.render", "ol.style.Circle", "ol.style.Fill", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "reprojection-by-code.html", "example": "reprojection-by-code.html", "title": "Reprojection with EPSG.io Search", "shortdesc": "Demonstrates client-side raster reprojection of OSM to arbitrary projection", "tags": "reprojection, projection, proj4js, epsg.io", "requires": ["ol.Map", "ol.View", "ol.extent", "ol.layer.Tile", "ol.proj", "ol.source.OSM", "ol.source.TileImage"] },
{ "link": "reprojection-image.html", "example": "reprojection-image.html", "title": "Image Reprojection", "shortdesc": "Demonstrates client-side reprojection of single image source.", "tags": "reprojection, projection, proj4js, image, imagestatic", "requires": ["ol.Map", "ol.View", "ol.extent", "ol.layer.Image", "ol.layer.Tile", "ol.proj", "ol.source.ImageStatic", "ol.source.OSM"] },
{ "link": "reprojection-wgs84.html", "example": "reprojection-wgs84.html", "title": "OpenStreetMap Reprojection", "shortdesc": "Demonstrates client-side reprojection of OpenStreetMap in WGS84.", "tags": "reprojection, projection, openstreetmap, wgs84, tile", "requires": ["ol.Map", "ol.View", "ol.layer.Tile", "ol.source.OSM"] },
{ "link": "reprojection.html", "example": "reprojection.html", "title": "Raster Reprojection", "shortdesc": "Demonstrates client-side raster reprojection between various projections.", "tags": "reprojection, projection, proj4js, osm, wms, wmts, hidpi", "requires": ["ol.Map", "ol.View", "ol.extent", "ol.format.WMTSCapabilities", "ol.layer.Tile", "ol.proj", "ol.source.OSM", "ol.source.TileImage", "ol.source.TileWMS", "ol.source.WMTS", "ol.source.XYZ", "ol.tilegrid.TileGrid"] },
{ "link": "reusable-source.html", "example": "reusable-source.html", "title": "Reusable Source", "shortdesc": "Updating a tile source by changing the URL.", "requires": ["ol.Map", "ol.View", "ol.layer.Tile", "ol.source.XYZ"] },
{ "link": "rotation.html", "example": "rotation.html", "title": "View Rotation", "shortdesc": "Example of a rotated map.", "tags": "rotation, openstreetmap", "requires": ["ol.Map", "ol.View", "ol.control", "ol.layer.Tile", "ol.source.OSM"] },
{ "link": "scale-line.html", "example": "scale-line.html", "title": "Scale Line", "shortdesc": "Example of a scale line.", "tags": "scale-line, openstreetmap", "requires": ["ol.Map", "ol.View", "ol.control", "ol.control.ScaleLine", "ol.layer.Tile", "ol.source.OSM"] },
{ "link": "scaleline-indiana-east.html", "example": "scaleline-indiana-east.html", "title": "OpenStreetMap Reprojection with ScaleLine Control", "shortdesc": "Demonstrates client-side reprojection of OpenStreetMap to NAD83 Indiana East.", "tags": "reprojection, projection, openstreetmap, nad83, tile, scaleline", "requires": ["ol.Map", "ol.View", "ol.control.ScaleLine", "ol.layer.Tile", "ol.proj", "ol.source.OSM"] },
{ "link": "sea-level.html", "example": "sea-level.html", "title": "Sea Level", "shortdesc": "Render sea level at different elevations", "tags": "raster, pixel operation, flood", "requires": ["ol.Map", "ol.View", "ol.layer.Image", "ol.layer.Tile", "ol.proj", "ol.source.Raster", "ol.source.XYZ"] },
{ "link": "select-features.html", "example": "select-features.html", "title": "Select Features", "shortdesc": "Example of using the Select interaction.", "tags": "select, vector", "requires": ["ol.Map", "ol.View", "ol.events.condition", "ol.format.GeoJSON", "ol.interaction.Select", "ol.layer.Tile", "ol.layer.Vector", "ol.source.OSM", "ol.source.Vector"] },
{ "link": "semi-transparent-layer.html", "example": "semi-transparent-layer.html", "title": "Semi-Transparent Layer", "shortdesc": "Example of a map with a semi-transparent layer.", "tags": "transparent, osm, tilejson", "requires": ["ol.Map", "ol.View", "ol.layer.Tile", "ol.proj", "ol.source.OSM", "ol.source.TileJSON"] },
{ "link": "shaded-relief.html", "example": "shaded-relief.html", "title": "Shaded Relief", "shortdesc": "Calculate shaded relief from elevation data", "tags": "raster, shaded relief", "requires": ["ol.Map", "ol.View", "ol.layer.Image", "ol.layer.Tile", "ol.source.OSM", "ol.source.Raster", "ol.source.XYZ"] },
{ "link": "side-by-side.html", "example": "side-by-side.html", "title": "Shared Views", "shortdesc": "Two maps with different renderers share view properties", "tags": "side-by-side, canvas, webgl", "requires": ["ol.Map", "ol.View", "ol.has", "ol.layer.Tile", "ol.source.OSM"] },
{ "link": "simple.html", "example": "simple.html", "title": "Simple Map", "shortdesc": "Example of a simple map.", "tags": "simple, openstreetmap", "requires": ["ol.Map", "ol.View", "ol.layer.Tile", "ol.source.OSM"] },
{ "link": "snap.html", "example": "snap.html", "title": "Snap Interaction", "shortdesc": "Example of using the snap interaction together with draw and modify interactions.", "tags": "draw, edit, modify, vector, snap", "requires": ["ol.Map", "ol.View", "ol.interaction.Draw", "ol.interaction.Modify", "ol.interaction.Select", "ol.interaction.Snap", "ol.layer.Tile", "ol.layer.Vector", "ol.source.OSM", "ol.source.Vector", "ol.style.Circle", "ol.style.Fill", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "sphere-mollweide.html", "example": "sphere-mollweide.html", "title": "Sphere Mollweide", "shortdesc": "Example of a Sphere Mollweide map with a Graticule component.", "tags": "graticule, Mollweide, projection, proj4js", "requires": ["ol.Graticule", "ol.Map", "ol.View", "ol.format.GeoJSON", "ol.layer.Vector", "ol.proj.Projection", "ol.source.Vector"] },
{ "link": "stamen.html", "example": "stamen.html", "title": "Stamen Tiles", "shortdesc": "Example of a Stamen tile source.", "tags": "stamen, watercolor, terrain-labels, two-layers", "requires": ["ol.Map", "ol.View", "ol.layer.Tile", "ol.proj", "ol.source.Stamen"] },
{ "link": "static-image.html", "example": "static-image.html", "title": "Static Image", "shortdesc": "Example of a static image layer.", "tags": "static image, xkcd", "requires": ["ol.Map", "ol.View", "ol.extent", "ol.layer.Image", "ol.proj.Projection", "ol.source.ImageStatic"] },
{ "link": "street-labels.html", "example": "street-labels.html", "title": "Street Labels", "shortdesc": "Render street names with a custom render.", "tags": "vector, label, streets", "requires": ["ol.Map", "ol.View", "ol.extent", "ol.format.GeoJSON", "ol.layer.Tile", "ol.layer.Vector", "ol.source.BingMaps", "ol.source.Vector", "ol.style.Fill", "ol.style.Style", "ol.style.Text"] },
{ "link": "symbol-atlas-webgl.html", "example": "symbol-atlas-webgl.html", "title": "Symbols with WebGL", "shortdesc": "Using symbols in an atlas with WebGL.", "tags": "webgl, symbol, atlas, vector, point", "requires": ["ol.Feature", "ol.Map", "ol.View", "ol.geom.Point", "ol.layer.Vector", "ol.source.Vector", "ol.style.AtlasManager", "ol.style.Circle", "ol.style.Fill", "ol.style.RegularShape", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "synthetic-lines.html", "example": "synthetic-lines.html", "title": "Synthetic Lines", "shortdesc": "Synthetic lines example.", "tags": "vector", "requires": ["ol.Feature", "ol.Map", "ol.View", "ol.geom.LineString", "ol.layer.Vector", "ol.source.Vector", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "synthetic-points.html", "example": "synthetic-points.html", "title": "Synthetic Points", "shortdesc": "Synthetic points example.", "tags": "vector", "requires": ["ol.Feature", "ol.Map", "ol.View", "ol.geom.LineString", "ol.geom.Point", "ol.layer.Vector", "ol.source.Vector", "ol.style.Circle", "ol.style.Fill", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "teleport.html", "example": "teleport.html", "title": "Teleporting Maps", "shortdesc": "Example of moving a map from one target to another.", "tags": "teleport, openstreetmap", "requires": ["ol.Map", "ol.View", "ol.control", "ol.layer.Tile", "ol.source.OSM"] },
{ "link": "tile-load-events.html", "example": "tile-load-events.html", "title": "Tile Load Events", "shortdesc": "Example using tile load events.", "tags": "tile, events, loading", "requires": ["ol.Map", "ol.View", "ol.layer.Tile", "ol.source.TileJSON"] },
{ "link": "tile-transitions.html", "example": "tile-transitions.html", "title": "Tile Transitions", "shortdesc": "Custom configuration for opacity transitions on tiles.", "tags": "fade, transition", "requires": ["ol.Map", "ol.View", "ol.layer.Tile", "ol.source.XYZ"] },
{ "link": "tilejson.html", "example": "tilejson.html", "title": "TileJSON", "shortdesc": "Example of a TileJSON layer.", "tags": "tilejson", "requires": ["ol.Map", "ol.View", "ol.layer.Tile", "ol.source.TileJSON"] },
{ "link": "tileutfgrid.html", "example": "tileutfgrid.html", "title": "Tiled UTFGrid", "shortdesc": "This example shows how to read data from a TileUTFGrid layer.", "tags": "utfgrid, tileutfgrid, tilejson", "requires": ["ol.Map", "ol.Overlay", "ol.View", "ol.layer.Tile", "ol.source.TileJSON", "ol.source.TileUTFGrid"] },
{ "link": "tissot.html", "example": "tissot.html", "title": "Tissot Indicatrix", "shortdesc": "Draw Tissot's indicatrices on maps.", "tags": "tissot, circle", "requires": ["ol.Feature", "ol.Map", "ol.Sphere", "ol.View", "ol.geom.Polygon", "ol.layer.Tile", "ol.layer.Vector", "ol.source.TileWMS", "ol.source.Vector"] },
{ "link": "topojson.html", "example": "topojson.html", "title": "TopoJSON", "shortdesc": "Demonstrates rendering of features from a TopoJSON topology.", "tags": "topojson, vector, style", "requires": ["ol.Map", "ol.View", "ol.format.TopoJSON", "ol.layer.Tile", "ol.layer.Vector", "ol.source.TileJSON", "ol.source.Vector", "ol.style.Fill", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "topolis.html", "example": "topolis.html", "title": "topolis integration", "shortdesc": "Example on how to use topolis with OpenLayers.", "tags": "draw, edit, vector, topology, topolis", "requires": ["ol.Feature", "ol.Map", "ol.View", "ol.geom.Point", "ol.geom.LineString", "ol.geom.Polygon", "ol.interaction.Draw", "ol.interaction.Snap", "ol.layer.Tile", "ol.layer.Vector", "ol.source.OSM", "ol.source.Vector", "ol.style.Style", "ol.style.Stroke", "ol.style.Fill", "ol.style.Circle", "ol.style.Text", "ol.control.MousePosition"] },
{ "link": "translate-features.html", "example": "translate-features.html", "title": "Translate Features", "shortdesc": "Example of a translate features interaction.", "tags": "drag, translate, feature, vector, editing", "requires": ["ol.Map", "ol.View", "ol.format.GeoJSON", "ol.interaction", "ol.interaction.Select", "ol.interaction.Translate", "ol.layer.Tile", "ol.layer.Vector", "ol.source.OSM", "ol.source.Vector"] },
{ "link": "turf.html", "example": "turf.html", "title": "turf.js", "shortdesc": "Example on how to use turf.js with OpenLayers.", "tags": "vector, turfjs, along, distance", "requires": ["ol.Map", "ol.View", "ol.format.GeoJSON", "ol.layer.Tile", "ol.layer.Vector", "ol.proj", "ol.source.OSM", "ol.source.Vector"] },
{ "link": "vector-esri-edit.html", "example": "vector-esri-edit.html", "title": "Editable ArcGIS REST Feature Service", "shortdesc": "Example of using an ArcGIS REST Feature Service in an editing application.ArcGIS WFS接口的要素编辑示例！", "tags": "vector, esri, ArcGIS, REST, Feature, Service, loading, server, edit, updateFeature, addFeature", "requires": ["ol.Map", "ol.View", "ol.format.EsriJSON", "ol.interaction", "ol.interaction.Draw", "ol.interaction.Modify", "ol.interaction.Select", "ol.layer.Tile", "ol.layer.Vector", "ol.loadingstrategy", "ol.proj", "ol.source.Vector", "ol.source.XYZ", "ol.tilegrid"] },
{ "link": "vector-esri.html", "example": "vector-esri.html", "title": "ArcGIS REST Feature Service", "shortdesc": "Example of using an ArcGIS REST Feature Service with a Tile strategy.", "tags": "vector, esri, ArcGIS, REST, Feature, Service, loading, server", "requires": ["ol.Map", "ol.View", "ol.format.EsriJSON", "ol.layer.Tile", "ol.layer.Vector", "ol.loadingstrategy", "ol.proj", "ol.source.Vector", "ol.source.XYZ", "ol.style.Fill", "ol.style.Stroke", "ol.style.Style", "ol.tilegrid"] },
{ "link": "vector-label-decluttering.html", "example": "vector-label-decluttering.html", "title": "Vector Label Decluttering", "shortdesc": "Label decluttering with a custom renderer.", "tags": "vector, decluttering, labels", "requires": ["ol.Map", "ol.View", "ol.extent", "ol.format.GeoJSON", "ol.layer.Vector", "ol.source.Vector", "ol.style.Fill", "ol.style.Stroke", "ol.style.Style", "ol.style.Text"] },
{ "link": "vector-labels.html", "example": "vector-labels.html", "title": "Vector Labels", "shortdesc": "Example of GeoJSON features with labels.", "tags": "geojson, vector, openstreetmap, label", "requires": ["ol.Map", "ol.View", "ol.format.GeoJSON", "ol.layer.Tile", "ol.layer.Vector", "ol.source.OSM", "ol.source.Vector", "ol.style.Circle", "ol.style.Fill", "ol.style.Stroke", "ol.style.Style", "ol.style.Text"] },
{ "link": "vector-layer.html", "example": "vector-layer.html", "title": "Vector Layer", "shortdesc": "Example of a countries vector layer with country information.", "tags": "vector, geojson", "requires": ["ol.Map", "ol.View", "ol.format.GeoJSON", "ol.layer.Vector", "ol.source.Vector", "ol.style.Fill", "ol.style.Stroke", "ol.style.Style", "ol.style.Text"] },
{ "link": "vector-osm.html", "example": "vector-osm.html", "title": "OSM XML", "shortdesc": "Example of using the OSM XML source.", "tags": "vector, osmxml, loading, server, strategy, bbox", "requires": ["ol.Map", "ol.View", "ol.control", "ol.format.OSMXML", "ol.layer.Tile", "ol.layer.Vector", "ol.loadingstrategy", "ol.proj", "ol.source.BingMaps", "ol.source.Vector", "ol.style.Circle", "ol.style.Fill", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "vector-tile-info.html", "example": "vector-tile-info.html", "title": "Vector Tile Info", "shortdesc": "Getting feature information from vector tiles.", "tags": "vector tiles", "requires": ["ol.Map", "ol.View", "ol.format.MVT", "ol.layer.VectorTile", "ol.source.VectorTile"] },
{ "link": "vector-wfs-getfeature.html", "example": "vector-wfs-getfeature.html", "title": "WFS - GetFeature", "shortdesc": "Example of making a WFS GetFeature request with a filter.", "tags": "vector, WFS, GetFeature, filter", "requires": ["ol.Map", "ol.View", "ol.format.filter", "ol.format.WFS", "ol.format.GeoJSON", "ol.layer.Tile", "ol.layer.Vector", "ol.source.BingMaps", "ol.source.Vector", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "vector-wfs.html", "example": "vector-wfs.html", "title": "WFS", "shortdesc": "Example of using WFS with a BBOX strategy.", "tags": "vector, WFS, bbox, loading, server", "requires": ["ol.Map", "ol.View", "ol.format.GeoJSON", "ol.layer.Tile", "ol.layer.Vector", "ol.loadingstrategy", "ol.source.BingMaps", "ol.source.Vector", "ol.style.Stroke", "ol.style.Style"] },
{ "link": "wkt.html", "example": "wkt.html", "title": "WKT", "shortdesc": "Example of using the WKT parser.", "tags": "wkt, well known text", "requires": ["ol.Map", "ol.View", "ol.format.WKT", "ol.layer.Tile", "ol.layer.Vector", "ol.source.OSM", "ol.source.Vector"] },
{ "link": "wms-capabilities.html", "example": "wms-capabilities.html", "title": "WMS Capabilities Parsing", "shortdesc": "Example of parsing a WMS GetCapabilities response.", "tags": "wms, capabilities, getcapabilities", "requires": ["ol.format.WMSCapabilities"] },
{ "link": "wms-custom-proj.html", "example": "wms-custom-proj.html", "title": "Custom Tiled WMS", "shortdesc": "Example of using custom coordinate transform functions.", "tags": "wms, tile, tilelayer, projection", "requires": ["ol.Map", "ol.View", "ol.control", "ol.control.ScaleLine", "ol.layer.Tile", "ol.proj", "ol.proj.Projection", "ol.source.TileWMS"] },
{ "link": "wms-custom-tilegrid-512x256.html", "example": "wms-custom-tilegrid-512x256.html", "title": "WMS 512x256 Tiles", "shortdesc": "Example of a WMS layer with 512x256px tiles.", "tags": "wms, tile, non-square", "requires": ["ol.Map", "ol.View", "ol.extent", "ol.layer.Tile", "ol.proj", "ol.source.OSM", "ol.source.TileWMS", "ol.tilegrid.TileGrid"] },
{ "link": "wms-image-custom-proj.html", "example": "wms-image-custom-proj.html", "title": "Single Image WMS with Proj4js", "shortdesc": "Example of integrating Proj4js for coordinate transforms.", "tags": "wms, single image, proj4js, projection", "requires": ["ol.Map", "ol.View", "ol.control", "ol.control.ScaleLine", "ol.layer.Image", "ol.proj", "ol.proj.Projection", "ol.source.ImageWMS"] },
{ "link": "wms-image.html", "example": "wms-image.html", "title": "Single Image WMS", "shortdesc": "Example of a single image WMS layer.", "tags": "wms, image", "requires": ["ol.Map", "ol.View", "ol.layer.Image", "ol.layer.Tile", "ol.source.ImageWMS", "ol.source.OSM"] },
{ "link": "wms-no-proj.html", "example": "wms-no-proj.html", "title": "WMS without Projection", "shortdesc": "Example of two WMS layers using the projection EPSG:21781, which is unknown to the client.", "tags": "wms, projection", "requires": ["ol.Map", "ol.View", "ol.layer.Image", "ol.layer.Tile", "ol.proj.Projection", "ol.source.ImageWMS", "ol.source.TileWMS"] },
{ "link": "wms-tiled-wrap-180.html", "example": "wms-tiled-wrap-180.html", "title": "Tiled WMS Wrapping", "shortdesc": "Example of a tiled WMS layer that wraps across the 180° meridian.", "tags": "wms, tile, dateline, wrap, 180", "requires": ["ol.Map", "ol.View", "ol.layer.Tile", "ol.source.OSM", "ol.source.TileWMS"] },
{ "link": "wms-tiled.html", "example": "wms-tiled.html", "title": "Tiled WMS", "shortdesc": "Example of a tiled WMS layer.", "tags": "wms, tile, tilelayer", "requires": ["ol.Map", "ol.View", "ol.layer.Tile", "ol.source.OSM", "ol.source.TileWMS"] },
{ "link": "wms-time.html", "example": "wms-time.html", "title": "WMS Time", "shortdesc": "Example of smooth tile transitions when changing the time dimension of a tiled WMS layer.", "tags": "wms, time, dimensions, transition, nexrad", "requires": ["ol.Map", "ol.View", "ol.extent", "ol.layer.Tile", "ol.proj", "ol.source.Stamen", "ol.source.TileWMS"] },
{ "link": "wmts-capabilities.html", "example": "wmts-capabilities.html", "title": "WMTS Capabilities Parsing", "shortdesc": "Example of parsing a WMTS GetCapabilities response.", "tags": "wmts, capabilities, getcapabilities", "requires": ["ol.format.WMTSCapabilities"] },
{ "link": "wmts-dimensions.html", "example": "wmts-dimensions.html", "title": "WMTS Tile Transitions", "shortdesc": "Example of smooth tile transitions when changing the dimension of a WMTS layer.", "tags": "wmts, parameter, transition", "requires": ["ol.Map", "ol.View", "ol.extent", "ol.layer.Tile", "ol.proj", "ol.source.OSM", "ol.source.WMTS", "ol.tilegrid.WMTS"] },
{ "link": "wmts-hidpi.html", "example": "wmts-hidpi.html", "title": "High DPI WMTS", "shortdesc": "Example of a WMTS based HiDPI layer.", "tags": "hidpi, retina, wmts", "requires": ["ol.Map", "ol.View", "ol.format.WMTSCapabilities", "ol.has", "ol.layer.Tile", "ol.source.WMTS"] },
{ "link": "wmts-ign.html", "example": "wmts-ign.html", "title": "IGN WMTS", "shortdesc": "Demonstrates displaying IGN (France) WMTS layers.", "tags": "french, ign, geoportail, wmts", "requires": ["ol.Map", "ol.View", "ol.control", "ol.extent", "ol.layer.Tile", "ol.proj", "ol.source.WMTS", "ol.tilegrid.WMTS"] },
{ "link": "wmts-layer-from-capabilities.html", "example": "wmts-layer-from-capabilities.html", "title": "WMTS Layer from Capabilities", "shortdesc": "Example of a WMTS source created from a WMTS capabilities document.", "tags": "wmts, capabilities, getcapabilities", "requires": ["ol.Map", "ol.View", "ol.format.WMTSCapabilities", "ol.layer.Tile", "ol.source.OSM", "ol.source.WMTS"] },
{ "link": "wmts.html", "example": "wmts.html", "title": "WMTS", "shortdesc": "Example of a WMTS source.", "tags": "wmts", "requires": ["ol.Map", "ol.View", "ol.control", "ol.extent", "ol.layer.Tile", "ol.proj", "ol.source.OSM", "ol.source.WMTS", "ol.tilegrid.WMTS"] },
{ "link": "xyz-esri-4326-512.html", "example": "xyz-esri-4326-512.html", "title": "ArcGIS REST with 512x512 Tiles", "shortdesc": "Example of a XYZ source in EPSG:4326 using Esri 512x512 tiles.", "tags": "xyz, esri, tilesize, custom projection", "requires": ["ol.Map", "ol.View", "ol.layer.Tile", "ol.proj", "ol.source.XYZ"] },
{ "link": "xyz-esri.html", "example": "xyz-esri.html", "title": "XYZ Esri", "shortdesc": "Example of a XYZ source using Esri tiles.", "tags": "xyz, esri, arcgis rest", "requires": ["ol.Map", "ol.View", "ol.layer.Tile", "ol.proj", "ol.source.XYZ"] },
{ "link": "xyz-retina.html", "example": "xyz-retina.html", "title": "XYZ Retina Tiles", "shortdesc": "Example of Retina / HiDPI mercator tiles (512x512px) available as XYZ.", "tags": "retina, hidpi, xyz, maptiler, @2x, devicePixelRatio", "requires": ["ol.Map", "ol.View", "ol.layer.Tile", "ol.proj", "ol.source.OSM", "ol.source.XYZ"] },
{ "link": "xyz.html", "example": "xyz.html", "title": "XYZ", "shortdesc": "Example of a XYZ source.", "tags": "xyz", "requires": ["ol.Map", "ol.View", "ol.layer.Tile", "ol.source.XYZ"] },
{ "link": "zoom-constrained.html", "example": "zoom-constrained.html", "title": "Constrained Zoom", "shortdesc": "Example of a zoom constrained view.", "tags": "bing, zoom, minZoom, maxZoom", "requires": ["ol.Map", "ol.View", "ol.layer.Tile", "ol.source.BingMaps"] },
{ "link": "zoomify.html", "example": "zoomify.html", "title": "Zoomify", "shortdesc": "Example of a Zoomify source.", "tags": "zoomify, deep zoom, IIP, pixel, projection", "requires": ["ol.Map", "ol.View", "ol.layer.Tile", "ol.source.Zoomify"] },
{ "link": "zoomslider.html", "example": "zoomslider.html", "title": "Zoom Sliders", "shortdesc": "Example of various ZoomSlider controls.", "tags": "zoom, zoomslider, slider, style, styling, css, control", "requires": ["ol.Map", "ol.View", "ol.control.ZoomSlider", "ol.layer.Tile", "ol.source.OSM"] }], "index":
{
    "180":
    { "150": 1 }, "4326":
    { "30": 1, "159": 1 }, "21781":
    { "149": 1 }, "example":
    { "0": 1, "2": 1, "3": 1, "4": 1, "5": 1, "8": 1, "9": 1, "11": 1, "12": 1, "13": 1, "16": 1, "17": 1, "18": 1, "20": 1, "21": 1, "23": 1, "24": 1, "25": 1, "27": 1, "30": 1, "31": 1, "32": 1, "37": 1, "38": 1, "39": 1, "40": 1, "42": 1, "43": 1, "48": 1, "49": 1, "51": 1, "52": 1, "53": 1, "56": 1, "57": 1, "59": 1, "60": 1, "61": 1, "65": 1, "66": 1, "68": 1, "70": 1, "71": 1, "72": 1, "73": 1, "74": 1, "76": 1, "77": 1, "78": 1, "82": 1, "84": 1, "85": 1, "91": 1, "92": 1, "93": 1, "97": 1, "100": 1, "101": 1, "107": 1, "108": 1, "111": 1, "112": 1, "115": 1, "116": 1, "117": 1, "118": 1, "119": 1, "122": 1, "123": 1, "124": 1, "125": 1, "127": 1, "128": 1, "131": 1, "132": 1, "133": 1, "134": 1, "135": 1, "137": 1, "138": 1, "139": 1, "141": 1, "142": 1, "143": 1, "144": 1, "145": 1, "146": 1, "147": 1, "148": 1, "149": 1, "150": 1, "151": 1, "152": 1, "153": 1, "154": 1, "155": 1, "157": 1, "158": 1, "159": 1, "160": 1, "161": 1, "162": 1, "163": 1, "164": 1, "165": 1 }, "of":
    { "0": 1, "2": 1, "3": 1, "4": 1, "5": 1, "11": 1, "13": 1, "17": 1, "18": 1, "20": 1, "21": 1, "23": 1, "24": 1, "27": 1, "28": 1, "29": 1, "30": 1, "31": 1, "32": 1, "37": 1, "38": 1, "39": 1, "40": 1, "42": 1, "43": 1, "48": 1, "50": 1, "51": 1, "57": 1, "60": 1, "62": 1, "68": 1, "69": 1, "70": 1, "71": 1, "72": 1, "73": 1, "74": 1, "75": 1, "76": 1, "77": 1, "78": 1, "82": 1, "85": 1, "87": 1, "91": 1, "92": 1, "95": 1, "97": 1, "100": 1, "101": 1, "102": 1, "103": 1, "104": 1, "107": 1, "108": 1, "109": 1, "111": 1, "112": 1, "115": 1, "116": 1, "117": 1, "118": 1, "119": 1, "124": 1, "127": 1, "130": 1, "132": 1, "134": 1, "135": 1, "137": 1, "138": 1, "139": 1, "141": 1, "142": 1, "143": 1, "144": 1, "145": 1, "146": 1, "147": 1, "148": 1, "149": 1, "150": 1, "151": 1, "152": 1, "153": 1, "154": 1, "155": 1, "157": 1, "158": 1, "159": 1, "160": 1, "161": 1, "162": 1, "163": 1, "164": 1, "165": 1 }, "an":
    { "0": 1, "2": 1, "33": 1, "45": 1, "53": 1, "56": 1, "57": 1, "60": 1, "96": 1, "101": 1, "121": 1, "134": 1, "135": 1 }, "accessible":
    { "0": 1 }, "map":
    { "0": 1, "1": 1, "2": 1, "3": 1, "4": 1, "5": 1, "6": 1, "7": 1, "8": 1, "9": 1, "10": 1, "11": 1, "12": 1, "13": 1, "14": 1, "15": 1, "16": 1, "17": 1, "18": 1, "19": 1, "20": 1, "21": 1, "22": 1, "23": 1, "24": 1, "25": 1, "26": 1, "27": 1, "28": 1, "29": 1, "30": 1, "31": 1, "32": 1, "33": 1, "34": 1, "35": 1, "36": 1, "37": 1, "38": 1, "39": 1, "40": 1, "41": 1, "42": 1, "43": 1, "44": 1, "45": 1, "47": 1, "48": 1, "49": 1, "50": 1, "51": 1, "52": 1, "53": 1, "54": 1, "55": 1, "56": 1, "57": 1, "58": 1, "59": 1, "60": 1, "61": 1, "62": 1, "63": 1, "64": 1, "65": 1, "66": 1, "67": 1, "68": 1, "69": 1, "70": 1, "71": 1, "72": 1, "73": 1, "74": 1, "75": 1, "76": 1, "77": 1, "78": 1, "79": 1, "80": 1, "81": 1, "82": 1, "83": 1, "84": 1, "85": 1, "86": 1, "87": 1, "88": 1, "89": 1, "90": 1, "91": 1, "92": 1, "93": 1, "94": 1, "95": 1, "96": 1, "97": 1, "98": 1, "99": 1, "100": 1, "102": 1, "103": 1, "104": 1, "105": 1, "106": 1, "107": 1, "108": 1, "109": 1, "110": 1, "111": 1, "112": 1, "113": 1, "114": 1, "115": 1, "116": 1, "117": 1, "118": 1, "119": 1, "120": 1, "121": 1, "122": 1, "123": 1, "124": 1, "125": 1, "126": 1, "127": 1, "128": 1, "129": 1, "130": 1, "131": 1, "132": 1, "133": 1, "134": 1, "135": 1, "136": 1, "137": 1, "138": 1, "139": 1, "140": 1, "141": 1, "142": 1, "143": 1, "145": 1, "146": 1, "147": 1, "148": 1, "149": 1, "150": 1, "151": 1, "152": 1, "154": 1, "155": 1, "156": 1, "157": 1, "158": 1, "159": 1, "160": 1, "161": 1, "162": 1, "163": 1, "164": 1, "165": 1 }, "accessibility":
    { "0": 1 }, "tabindex":
    { "0": 1 }, "ol":
    { "0": 1, "1": 1, "2": 1, "3": 1, "4": 1, "5": 1, "6": 1, "7": 1, "8": 1, "9": 1, "10": 1, "11": 1, "12": 1, "13": 1, "14": 1, "15": 1, "16": 1, "17": 1, "18": 1, "19": 1, "20": 1, "21": 1, "22": 1, "23": 1, "24": 1, "25": 1, "26": 1, "27": 1, "28": 1, "29": 1, "30": 1, "31": 1, "32": 1, "33": 1, "34": 1, "35": 1, "36": 1, "37": 1, "38": 1, "39": 1, "40": 1, "41": 1, "42": 1, "43": 1, "44": 1, "45": 1, "46": 1, "47": 1, "48": 1, "49": 1, "50": 1, "51": 1, "52": 1, "53": 1, "54": 1, "55": 1, "56": 1, "57": 1, "58": 1, "59": 1, "60": 1, "61": 1, "62": 1, "63": 1, "64": 1, "65": 1, "66": 1, "67": 1, "68": 1, "69": 1, "70": 1, "71": 1, "72": 1, "73": 1, "74": 1, "75": 1, "76": 1, "77": 1, "78": 1, "79": 1, "80": 1, "81": 1, "82": 1, "83": 1, "84": 1, "85": 1, "86": 1, "87": 1, "88": 1, "89": 1, "90": 1, "91": 1, "92": 1, "93": 1, "94": 1, "95": 1, "96": 1, "97": 1, "98": 1, "99": 1, "100": 1, "101": 1, "102": 1, "103": 1, "104": 1, "105": 1, "106": 1, "107": 1, "108": 1, "109": 1, "110": 1, "111": 1, "112": 1, "113": 1, "114": 1, "115": 1, "116": 1, "117": 1, "118": 1, "119": 1, "120": 1, "121": 1, "122": 1, "123": 1, "124": 1, "125": 1, "126": 1, "127": 1, "128": 1, "129": 1, "130": 1, "131": 1, "132": 1, "133": 1, "134": 1, "135": 1, "136": 1, "137": 1, "138": 1, "139": 1, "140": 1, "141": 1, "142": 1, "143": 1, "144": 1, "145": 1, "146": 1, "147": 1, "148": 1, "149": 1, "150": 1, "151": 1, "152": 1, "153": 1, "154": 1, "155": 1, "156": 1, "157": 1, "158": 1, "159": 1, "160": 1, "161": 1, "162": 1, "163": 1, "164": 1, "165": 1 }, "view":
    { "0": 1, "1": 1, "2": 1, "3": 1, "4": 1, "5": 1, "6": 1, "7": 1, "8": 1, "9": 1, "10": 1, "11": 1, "12": 1, "13": 1, "14": 1, "15": 1, "16": 1, "17": 1, "18": 1, "19": 1, "20": 1, "21": 1, "22": 1, "23": 1, "24": 1, "25": 1, "26": 1, "27": 1, "28": 1, "29": 1, "30": 1, "31": 1, "32": 1, "33": 1, "34": 1, "35": 1, "36": 1, "37": 1, "38": 1, "39": 1, "40": 1, "41": 1, "42": 1, "43": 1, "44": 1, "45": 1, "47": 1, "48": 1, "49": 1, "50": 1, "51": 1, "52": 1, "53": 1, "54": 1, "55": 1, "56": 1, "57": 1, "58": 1, "59": 1, "60": 1, "61": 1, "62": 1, "63": 1, "64": 1, "65": 1, "66": 1, "67": 1, "68": 1, "69": 1, "70": 1, "71": 1, "72": 1, "73": 1, "74": 1, "75": 1, "76": 1, "77": 1, "78": 1, "79": 1, "80": 1, "81": 1, "82": 1, "83": 1, "84": 1, "85": 1, "86": 1, "87": 1, "88": 1, "89": 1, "90": 1, "91": 1, "92": 1, "93": 1, "94": 1, "95": 1, "96": 1, "97": 1, "98": 1, "99": 1, "100": 1, "102": 1, "103": 1, "104": 1, "105": 1, "106": 1, "107": 1, "108": 1, "109": 1, "110": 1, "111": 1, "112": 1, "113": 1, "114": 1, "115": 1, "116": 1, "117": 1, "118": 1, "119": 1, "120": 1, "121": 1, "122": 1, "123": 1, "124": 1, "125": 1, "126": 1, "127": 1, "128": 1, "129": 1, "130": 1, "131": 1, "132": 1, "133": 1, "134": 1, "135": 1, "136": 1, "137": 1, "138": 1, "139": 1, "140": 1, "141": 1, "142": 1, "143": 1, "145": 1, "146": 1, "147": 1, "148": 1, "149": 1, "150": 1, "151": 1, "152": 1, "154": 1, "155": 1, "156": 1, "157": 1, "158": 1, "159": 1, "160": 1, "161": 1, "162": 1, "163": 1, "164": 1, "165": 1 }, "control":
    { "0": 1, "4": 1, "10": 1, "12": 1, "15": 1, "19": 1, "30": 1, "31": 1, "32": 1, "34": 1, "38": 1, "39": 1, "40": 1, "42": 1, "43": 1, "44": 1, "57": 1, "65": 1, "66": 1, "70": 1, "74": 1, "80": 1, "85": 1, "87": 1, "88": 1, "91": 1, "92": 1, "93": 1, "107": 1, "108": 1, "109": 1, "124": 1, "131": 1, "139": 1, "145": 1, "147": 1, "156": 1, "158": 1, "165": 1 }, "layer":
    { "0": 1, "1": 1, "2": 1, "3": 1, "4": 1, "5": 1, "6": 1, "7": 1, "8": 1, "9": 1, "10": 1, "11": 1, "12": 1, "13": 1, "14": 1, "15": 1, "16": 1, "17": 1, "18": 1, "19": 1, "20": 1, "21": 1, "22": 1, "23": 1, "24": 1, "25": 1, "26": 1, "27": 1, "28": 1, "29": 1, "30": 1, "31": 1, "32": 1, "33": 1, "34": 1, "35": 1, "36": 1, "37": 1, "38": 1, "39": 1, "40": 1, "41": 1, "42": 1, "43": 1, "44": 1, "45": 1, "46": 1, "47": 1, "48": 1, "49": 1, "50": 1, "51": 1, "52": 1, "53": 1, "54": 1, "55": 1, "56": 1, "57": 1, "58": 1, "59": 1, "60": 1, "61": 1, "62": 1, "63": 1, "64": 1, "65": 1, "66": 1, "67": 1, "68": 1, "69": 1, "70": 1, "71": 1, "72": 1, "73": 1, "74": 1, "75": 1, "76": 1, "77": 1, "78": 1, "79": 1, "80": 1, "81": 1, "82": 1, "83": 1, "84": 1, "85": 1, "86": 1, "87": 1, "88": 1, "89": 1, "90": 1, "91": 1, "92": 1, "93": 1, "94": 1, "95": 1, "96": 1, "97": 1, "98": 1, "99": 1, "100": 1, "102": 1, "103": 1, "104": 1, "105": 1, "106": 1, "107": 1, "108": 1, "109": 1, "110": 1, "111": 1, "112": 1, "113": 1, "114": 1, "115": 1, "116": 1, "117": 1, "118": 1, "119": 1, "120": 1, "121": 1, "122": 1, "123": 1, "124": 1, "125": 1, "126": 1, "127": 1, "128": 1, "129": 1, "130": 1, "131": 1, "132": 1, "133": 1, "134": 1, "135": 1, "136": 1, "137": 1, "138": 1, "139": 1, "140": 1, "141": 1, "142": 1, "143": 1, "145": 1, "146": 1, "147": 1, "148": 1, "149": 1, "150": 1, "151": 1, "152": 1, "154": 1, "155": 1, "156": 1, "157": 1, "158": 1, "159": 1, "160": 1, "161": 1, "162": 1, "163": 1, "164": 1, "165": 1 }, "tile":
    { "0": 1, "1": 1, "2": 1, "3": 1, "4": 1, "5": 1, "7": 1, "8": 1, "10": 1, "11": 1, "12": 1, "13": 1, "15": 1, "16": 1, "17": 1, "18": 1, "19": 1, "20": 1, "21": 1, "22": 1, "23": 1, "24": 1, "25": 1, "26": 1, "27": 1, "28": 1, "29": 1, "30": 1, "31": 1, "32": 1, "33": 1, "34": 1, "35": 1, "36": 1, "38": 1, "39": 1, "40": 1, "41": 1, "42": 1, "43": 1, "44": 1, "47": 1, "48": 1, "49": 1, "50": 1, "51": 1, "52": 1, "53": 1, "54": 1, "56": 1, "57": 1, "58": 1, "61": 1, "62": 1, "63": 1, "64": 1, "65": 1, "66": 1, "67": 1, "68": 1, "69": 1, "70": 1, "72": 1, "73": 1, "74": 1, "75": 1, "76": 1, "79": 1, "80": 1, "81": 1, "82": 1, "83": 1, "85": 1, "86": 1, "87": 1, "88": 1, "90": 1, "91": 1, "92": 1, "93": 1, "94": 1, "96": 1, "97": 1, "98": 1, "99": 1, "102": 1, "103": 1, "104": 1, "105": 1, "106": 1, "107": 1, "108": 1, "109": 1, "110": 1, "111": 1, "112": 1, "113": 1, "114": 1, "115": 1, "116": 1, "118": 1, "120": 1, "124": 1, "125": 1, "126": 1, "127": 1, "128": 1, "129": 1, "130": 1, "131": 1, "132": 1, "133": 1, "134": 1, "135": 1, "137": 1, "139": 1, "140": 1, "141": 1, "142": 1, "143": 1, "145": 1, "146": 1, "148": 1, "149": 1, "150": 1, "151": 1, "152": 1, "154": 1, "155": 1, "156": 1, "157": 1, "158": 1, "159": 1, "160": 1, "161": 1, "162": 1, "163": 1, "164": 1, "165": 1 }, "source":
    { "0": 1, "1": 1, "2": 1, "3": 1, "4": 1, "5": 1, "6": 1, "7": 1, "8": 1, "9": 1, "10": 1, "11": 1, "12": 1, "13": 1, "14": 1, "15": 1, "16": 1, "17": 1, "18": 1, "19": 1, "20": 1, "21": 1, "22": 1, "23": 1, "24": 1, "25": 1, "26": 1, "27": 1, "28": 1, "29": 1, "30": 1, "31": 1, "32": 1, "33": 1, "34": 1, "35": 1, "36": 1, "37": 1, "38": 1, "39": 1, "40": 1, "41": 1, "42": 1, "43": 1, "44": 1, "45": 1, "47": 1, "48": 1, "49": 1, "50": 1, "51": 1, "52": 1, "53": 1, "54": 1, "55": 1, "56": 1, "57": 1, "58": 1, "59": 1, "60": 1, "61": 1, "62": 1, "63": 1, "64": 1, "65": 1, "66": 1, "67": 1, "68": 1, "69": 1, "70": 1, "71": 1, "72": 1, "73": 1, "74": 1, "75": 1, "76": 1, "77": 1, "78": 1, "79": 1, "80": 1, "81": 1, "82": 1, "83": 1, "84": 1, "85": 1, "86": 1, "87": 1, "88": 1, "89": 1, "90": 1, "91": 1, "92": 1, "93": 1, "94": 1, "95": 1, "96": 1, "97": 1, "98": 1, "99": 1, "100": 1, "102": 1, "103": 1, "104": 1, "105": 1, "106": 1, "107": 1, "108": 1, "109": 1, "110": 1, "111": 1, "112": 1, "113": 1, "114": 1, "115": 1, "116": 1, "117": 1, "118": 1, "119": 1, "120": 1, "121": 1, "122": 1, "123": 1, "124": 1, "125": 1, "126": 1, "127": 1, "128": 1, "129": 1, "130": 1, "131": 1, "132": 1, "133": 1, "134": 1, "135": 1, "136": 1, "137": 1, "138": 1, "139": 1, "140": 1, "141": 1, "142": 1, "143": 1, "145": 1, "146": 1, "147": 1, "148": 1, "149": 1, "150": 1, "151": 1, "152": 1, "154": 1, "155": 1, "156": 1, "157": 1, "158": 1, "159": 1, "160": 1, "161": 1, "162": 1, "163": 1, "164": 1, "165": 1 }, "osm":
    { "0": 1, "1": 1, "2": 1, "3": 1, "4": 1, "7": 1, "8": 1, "10": 1, "11": 1, "12": 1, "13": 1, "15": 1, "16": 1, "19": 1, "22": 1, "23": 1, "24": 1, "25": 1, "26": 1, "27": 1, "31": 1, "32": 1, "33": 1, "34": 1, "39": 1, "41": 1, "42": 1, "43": 1, "44": 1, "49": 1, "52": 1, "57": 1, "61": 1, "65": 1, "66": 1, "68": 1, "70": 1, "72": 1, "73": 1, "74": 1, "79": 1, "80": 1, "81": 1, "83": 1, "85": 1, "86": 1, "87": 1, "88": 1, "89": 1, "90": 1, "91": 1, "92": 1, "93": 1, "94": 1, "102": 1, "103": 1, "104": 1, "105": 1, "107": 1, "108": 1, "109": 1, "111": 1, "112": 1, "113": 1, "114": 1, "115": 1, "116": 1, "124": 1, "131": 1, "132": 1, "133": 1, "137": 1, "139": 1, "143": 1, "146": 1, "148": 1, "150": 1, "151": 1, "154": 1, "157": 1, "158": 1, "161": 1, "165": 1 }, "demonstrates":
    { "1": 1, "12": 1, "14": 1, "28": 1, "29": 1, "34": 1, "35": 1, "36": 1, "50": 1, "62": 1, "63": 1, "81": 1, "90": 1, "98": 1, "102": 1, "103": 1, "104": 1, "105": 1, "109": 1, "130": 1, "156": 1 }, "animated":
    { "1": 1 }, "pan":
    { "1": 1 }, "zoom":
    { "1": 1, "22": 1, "38": 1, "81": 1, "86": 1, "94": 1, "163": 1, "164": 1, "165": 1 }, "and":
    { "1": 1, "6": 1, "9": 1, "18": 1, "20": 1, "21": 1, "22": 1, "23": 1, "38": 1, "43": 1, "74": 1, "79": 1, "116": 1 }, "rotation":
    { "1": 1, "12": 1, "107": 1 }, "animation":
    { "1": 1, "34": 1, "35": 1, "36": 1 }, "easing":
    { "1": 1, "34": 1 }, "proj":
    { "1": 1, "9": 1, "10": 1, "18": 1, "19": 1, "34": 1, "36": 1, "41": 1, "43": 1, "49": 1, "53": 1, "58": 1, "61": 1, "64": 1, "67": 1, "68": 1, "69": 1, "75": 1, "76": 1, "87": 1, "89": 1, "90": 1, "96": 1, "99": 1, "102": 1, "103": 1, "105": 1, "109": 1, "110": 1, "112": 1, "117": 1, "118": 1, "119": 1, "133": 1, "134": 1, "135": 1, "139": 1, "145": 1, "146": 1, "147": 1, "149": 1, "152": 1, "154": 1, "156": 1, "158": 1, "159": 1, "160": 1, "161": 1 }, "image":
    { "2": 1, "14": 1, "18": 1, "20": 1, "31": 1, "45": 1, "58": 1, "59": 1, "60": 1, "69": 1, "75": 1, "78": 1, "98": 1, "99": 1, "103": 1, "110": 1, "113": 1, "119": 1, "147": 1, "148": 1, "149": 1 }, "arcgis":
    { "2": 1, "3": 1, "134": 1, "135": 1, "159": 1, "160": 1 }, "mapserver":
    { "2": 1, "3": 1 }, "dynamiclayer":
    { "2": 1 }, "imagearcgisrest":
    { "2": 1 }, "a":
    { "3": 1, "4": 1, "5": 1, "7": 1, "11": 1, "12": 1, "14": 1, "16": 1, "17": 1, "22": 1, "28": 1, "30": 1, "31": 1, "32": 1, "35": 1, "37": 1, "39": 1, "40": 1, "43": 1, "44": 1, "46": 1, "47": 1, "49": 1, "50": 1, "51": 1, "53": 1, "54": 1, "56": 1, "58": 1, "62": 1, "64": 1, "67": 1, "68": 1, "69": 1, "70": 1, "72": 1, "74": 1, "75": 1, "76": 1, "77": 1, "78": 1, "79": 1, "82": 1, "85": 1, "95": 1, "96": 1, "98": 1, "99": 1, "101": 1, "106": 1, "107": 1, "108": 1, "112": 1, "115": 1, "117": 1, "118": 1, "119": 1, "120": 1, "124": 1, "127": 1, "128": 1, "130": 1, "132": 1, "135": 1, "136": 1, "138": 1, "141": 1, "142": 1, "144": 1, "146": 1, "148": 1, "150": 1, "151": 1, "152": 1, "153": 1, "154": 1, "155": 1, "157": 1, "158": 1, "159": 1, "160": 1, "162": 1, "163": 1, "164": 1 }, "tiled":
    { "3": 1, "47": 1, "128": 1, "145": 1, "150": 1, "151": 1, "152": 1 }, "tilelayer":
    { "3": 1, "145": 1, "151": 1 }, "tilearcgisrest":
    { "3": 1 }, "attributions":
    { "4": 1 }, "visibily":
    { "4": 1 }, "change":
    { "4": 1, "6": 1 }, "on":
    { "4": 1, "41": 1, "54": 1, "57": 1, "61": 1, "80": 1, "93": 1, "126": 1, "129": 1, "131": 1, "133": 1 }, "resize":
    { "4": 1 }, "to":
    { "4": 1, "6": 1, "7": 1, "8": 1, "15": 1, "19": 1, "22": 1, "26": 1, "28": 1, "29": 1, "33": 1, "34": 1, "35": 1, "36": 1, "44": 1, "46": 1, "49": 1, "53": 1, "56": 1, "58": 1, "61": 1, "62": 1, "67": 1, "79": 1, "86": 1, "88": 1, "93": 1, "94": 1, "96": 1, "101": 1, "102": 1, "109": 1, "124": 1, "128": 1, "131": 1, "133": 1, "149": 1 }, "collapse":
    { "4": 1 }, "them":
    { "4": 1 }, "small":
    { "4": 1 }, "maps":
    { "4": 1, "5": 1, "38": 1, "39": 1, "40": 1, "51": 1, "114": 1, "124": 1, "129": 1 }, "openstreetmap":
    { "4": 1, "10": 1, "11": 1, "12": 1, "31": 1, "32": 1, "42": 1, "44": 1, "65": 1, "66": 1, "70": 1, "74": 1, "85": 1, "89": 1, "93": 1, "104": 1, "107": 1, "108": 1, "109": 1, "115": 1, "124": 1, "137": 1 }, "attribution":
    { "4": 1, "11": 1, "16": 1, "74": 1 }, "bing":
    { "5": 1, "38": 1, "40": 1, "97": 1, "163": 1 }, "bingmaps":
    { "5": 1, "20": 1, "21": 1, "35": 1, "38": 1, "40": 1, "48": 1, "58": 1, "64": 1, "69": 1, "70": 1, "75": 1, "82": 1, "97": 1, "98": 1, "99": 1, "120": 1, "139": 1, "141": 1, "142": 1, "163": 1 }, "shows":
    { "6": 1, "8": 1, "15": 1, "46": 1, "49": 1, "88": 1, "128": 1 }, "how":
    { "6": 1, "8": 1, "12": 1, "15": 1, "34": 1, "35": 1, "36": 1, "46": 1, "49": 1, "61": 1, "81": 1, "88": 1, "93": 1, "128": 1, "131": 1, "133": 1 }, "the":
    { "6": 1, "8": 1, "9": 1, "20": 1, "21": 1, "23": 1, "24": 1, "25": 1, "26": 1, "28": 1, "29": 1, "41": 1, "48": 1, "50": 1, "52": 1, "57": 1, "62": 1, "75": 1, "81": 1, "83": 1, "85": 1, "87": 1, "95": 1, "106": 1, "111": 1, "116": 1, "139": 1, "143": 1, "149": 1, "150": 1, "152": 1, "154": 1 }, "canvas":
    { "6": 1, "9": 1, "10": 1, "29": 1, "54": 1, "101": 1, "114": 1 }, "compositing":
    { "6": 1 }, "blending":
    { "6": 1 }, "mode":
    { "6": 1, "25": 1 }, "in":
    { "6": 1, "25": 1, "30": 1, "41": 1, "46": 1, "62": 1, "63": 1, "104": 1, "121": 1, "134": 1, "159": 1 }, "post":
    { "6": 1 }, "precompose":
    { "6": 1 }, "eventhandlers":
    { "6": 1 }, "blend":
    { "6": 1 }, "modes":
    { "6": 1 }, "blendmode":
    { "6": 1 }, "blendingmode":
    { "6": 1 }, "composition":
    { "6": 1 }, "vector":
    { "6": 1, "7": 1, "9": 1, "12": 1, "13": 1, "17": 1, "20": 1, "21": 1, "23": 1, "24": 1, "25": 1, "26": 1, "28": 1, "29": 1, "31": 1, "32": 1, "33": 1, "34": 1, "35": 1, "36": 1, "37": 1, "41": 1, "42": 1, "44": 1, "48": 1, "50": 1, "52": 1, "53": 1, "54": 1, "55": 1, "56": 1, "57": 1, "60": 1, "61": 1, "62": 1, "63": 1, "64": 1, "71": 1, "73": 1, "76": 1, "77": 1, "79": 1, "83": 1, "84": 1, "89": 1, "95": 1, "100": 1, "111": 1, "116": 1, "117": 1, "120": 1, "121": 1, "122": 1, "123": 1, "129": 1, "130": 1, "131": 1, "132": 1, "133": 1, "134": 1, "135": 1, "136": 1, "137": 1, "138": 1, "139": 1, "140": 1, "141": 1, "142": 1, "143": 1 }, "feature":
    { "6": 1, "7": 1, "9": 1, "13": 1, "17": 1, "34": 1, "35": 1, "36": 1, "37": 1, "42": 1, "44": 1, "52": 1, "53": 1, "54": 1, "55": 1, "56": 1, "57": 1, "71": 1, "84": 1, "100": 1, "121": 1, "122": 1, "123": 1, "129": 1, "131": 1, "132": 1, "134": 1, "135": 1, "140": 1 }, "geom":
    { "6": 1, "13": 1, "17": 1, "26": 1, "27": 1, "29": 1, "34": 1, "35": 1, "36": 1, "37": 1, "42": 1, "43": 1, "44": 1, "52": 1, "53": 1, "54": 1, "55": 1, "56": 1, "57": 1, "71": 1, "73": 1, "79": 1, "95": 1, "100": 1, "101": 1, "121": 1, "122": 1, "123": 1, "129": 1, "131": 1 }, "point":
    { "6": 1, "13": 1, "17": 1, "27": 1, "34": 1, "35": 1, "44": 1, "53": 1, "54": 1, "55": 1, "56": 1, "57": 1, "71": 1, "73": 1, "100": 1, "101": 1, "121": 1, "123": 1, "131": 1 }, "style":
    { "6": 1, "9": 1, "12": 1, "13": 1, "17": 1, "20": 1, "21": 1, "23": 1, "27": 1, "28": 1, "29": 1, "34": 1, "35": 1, "36": 1, "42": 1, "44": 1, "48": 1, "49": 1, "50": 1, "52": 1, "53": 1, "54": 1, "55": 1, "56": 1, "57": 1, "60": 1, "62": 1, "63": 1, "71": 1, "73": 1, "76": 1, "77": 1, "79": 1, "84": 1, "89": 1, "95": 1, "100": 1, "101": 1, "116": 1, "120": 1, "121": 1, "122": 1, "123": 1, "130": 1, "131": 1, "135": 1, "136": 1, "137": 1, "138": 1, "139": 1, "141": 1, "142": 1, "165": 1 }, "circle":
    { "6": 1, "12": 1, "13": 1, "20": 1, "21": 1, "23": 1, "27": 1, "28": 1, "34": 1, "35": 1, "42": 1, "44": 1, "48": 1, "57": 1, "62": 1, "79": 1, "84": 1, "95": 1, "101": 1, "116": 1, "121": 1, "123": 1, "129": 1, "131": 1, "137": 1, "139": 1 }, "fill":
    { "6": 1, "9": 1, "12": 1, "13": 1, "17": 1, "20": 1, "21": 1, "23": 1, "27": 1, "28": 1, "29": 1, "35": 1, "42": 1, "44": 1, "48": 1, "57": 1, "60": 1, "62": 1, "63": 1, "71": 1, "76": 1, "77": 1, "79": 1, "84": 1, "89": 1, "95": 1, "100": 1, "101": 1, "116": 1, "120": 1, "121": 1, "123": 1, "130": 1, "131": 1, "135": 1, "136": 1, "137": 1, "138": 1, "139": 1 }, "stroke":
    { "6": 1, "9": 1, "12": 1, "13": 1, "17": 1, "20": 1, "21": 1, "23": 1, "27": 1, "28": 1, "29": 1, "34": 1, "35": 1, "36": 1, "42": 1, "44": 1, "48": 1, "49": 1, "52": 1, "57": 1, "60": 1, "62": 1, "63": 1, "71": 1, "73": 1, "76": 1, "77": 1, "79": 1, "84": 1, "89": 1, "95": 1, "100": 1, "101": 1, "116": 1, "121": 1, "122": 1, "123": 1, "130": 1, "131": 1, "135": 1, "136": 1, "137": 1, "138": 1, "139": 1, "141": 1, "142": 1 }, "using":
    { "7": 1, "13": 1, "16": 1, "18": 1, "20": 1, "21": 1, "23": 1, "24": 1, "25": 1, "26": 1, "33": 1, "44": 1, "45": 1, "48": 1, "52": 1, "56": 1, "59": 1, "71": 1, "79": 1, "89": 1, "111": 1, "116": 1, "121": 1, "125": 1, "134": 1, "135": 1, "139": 1, "142": 1, "143": 1, "145": 1, "149": 1, "159": 1, "160": 1 }, "dragbox":
    { "7": 1 }, "interaction":
    { "7": 1, "17": 1, "20": 1, "21": 1, "22": 1, "23": 1, "24": 1, "25": 1, "26": 1, "28": 1, "33": 1, "38": 1, "54": 1, "73": 1, "79": 1, "83": 1, "84": 1, "86": 1, "91": 1, "94": 1, "111": 1, "116": 1, "131": 1, "132": 1, "134": 1 }, "select":
    { "7": 1, "28": 1, "54": 1, "83": 1, "84": 1, "111": 1, "116": 1, "132": 1, "134": 1 }, "features":
    { "7": 1, "13": 1, "23": 1, "24": 1, "28": 1, "34": 1, "42": 1, "46": 1, "83": 1, "84": 1, "111": 1, "130": 1, "132": 1, "137": 1 }, "box":
    { "7": 1, "33": 1 }, "selection":
    { "7": 1 }, "events":
    { "7": 1, "19": 1, "33": 1, "59": 1, "111": 1, "125": 1 }, "condition":
    { "7": 1, "33": 1, "111": 1 }, "format":
    { "7": 1, "9": 1, "12": 1, "20": 1, "21": 1, "28": 1, "29": 1, "31": 1, "32": 1, "33": 1, "35": 1, "41": 1, "42": 1, "46": 1, "48": 1, "50": 1, "57": 1, "60": 1, "61": 1, "62": 1, "63": 1, "64": 1, "76": 1, "77": 1, "83": 1, "84": 1, "89": 1, "95": 1, "105": 1, "111": 1, "117": 1, "120": 1, "130": 1, "132": 1, "133": 1, "134": 1, "135": 1, "136": 1, "137": 1, "138": 1, "139": 1, "140": 1, "141": 1, "142": 1, "143": 1, "144": 1, "153": 1, "155": 1, "157": 1 }, "geojson":
    { "7": 1, "9": 1, "12": 1, "20": 1, "21": 1, "31": 1, "33": 1, "41": 1, "42": 1, "60": 1, "61": 1, "83": 1, "84": 1, "95": 1, "111": 1, "117": 1, "120": 1, "132": 1, "133": 1, "136": 1, "137": 1, "138": 1, "141": 1, "142": 1 }, "this":
    { "8": 1, "12": 1, "49": 1, "128": 1 }, "customize":
    { "8": 1 }, "buttons":
    { "8": 1 }, "tooltips":
    { "8": 1 }, "with":
    { "8": 1, "9": 1, "10": 1, "14": 1, "20": 1, "23": 1, "29": 1, "36": 1, "38": 1, "39": 1, "43": 1, "45": 1, "47": 1, "51": 1, "55": 1, "61": 1, "64": 1, "65": 1, "68": 1, "74": 1, "76": 1, "83": 1, "91": 1, "95": 1, "98": 1, "102": 1, "109": 1, "112": 1, "114": 1, "116": 1, "117": 1, "120": 1, "121": 1, "131": 1, "133": 1, "135": 1, "136": 1, "137": 1, "138": 1, "141": 1, "142": 1, "146": 1, "147": 1, "159": 1 }, "bootstrap":
    { "8": 1, "90": 1 }, "custom":
    { "8": 1, "15": 1, "16": 1, "17": 1, "29": 1, "34": 1, "53": 1, "74": 1, "76": 1, "91": 1, "95": 1, "120": 1, "126": 1, "136": 1, "145": 1, "159": 1 }, "tooltip":
    { "8": 1, "62": 1 }, "showing":
    { "9": 1, "95": 1 }, "countries":
    { "9": 1, "138": 1 }, "styled":
    { "9": 1 }, "patterns":
    { "9": 1 }, "gradients":
    { "9": 1 }, "styling":
    { "9": 1, "165": 1 }, "canvasgradient":
    { "9": 1 }, "or":
    { "9": 1, "12": 1 }, "canvaspattern":
    { "9": 1 }, "gradient":
    { "9": 1 }, "pattern":
    { "9": 1 }, "extent":
    { "9": 1, "18": 1, "28": 1, "33": 1, "67": 1, "87": 1, "88": 1, "102": 1, "103": 1, "105": 1, "119": 1, "120": 1, "136": 1, "146": 1, "152": 1, "154": 1, "156": 1, "158": 1 }, "has":
    { "9": 1, "65": 1, "114": 1, "155": 1 }, "renders":
    { "10": 1 }, "tiles":
    { "10": 1, "41": 1, "51": 1, "76": 1, "77": 1, "89": 1, "97": 1, "118": 1, "126": 1, "140": 1, "146": 1, "159": 1, "160": 1, "161": 1 }, "coordinates":
    { "10": 1 }, "for":
    { "10": 1, "73": 1, "84": 1, "126": 1, "147": 1 }, "debugging":
    { "10": 1 }, "layers":
    { "10": 1, "46": 1, "71": 1, "80": 1, "118": 1, "149": 1, "156": 1 }, "tiledebug":
    { "10": 1 }, "cartodb":
    { "11": 1 }, "simple":
    { "11": 1, "77": 1, "115": 1 }, "s":
    { "12": 1, "81": 1, "129": 1 }, "can":
    { "12": 1, "81": 1 }, "be":
    { "12": 1, "81": 1 }, "adjusted":
    { "12": 1 }, "so":
    { "12": 1 }, "geometry":
    { "12": 1, "28": 1, "57": 1, "95": 1, "101": 1 }, "coordinate":
    { "12": 1, "85": 1, "90": 1, "96": 1, "145": 1, "147": 1 }, "is":
    { "12": 1, "149": 1 }, "positioned":
    { "12": 1 }, "at":
    { "12": 1, "110": 1 }, "specific":
    { "12": 1 }, "pixel":
    { "12": 1, "54": 1, "98": 1, "99": 1, "110": 1, "164": 1 }, "location":
    { "12": 1 }, "advanced":
    { "12": 1, "76": 1, "91": 1 }, "positioning":
    { "12": 1 }, "center":
    { "12": 1 }, "cluster":
    { "13": 1, "28": 1 }, "clustered":
    { "13": 1 }, "text":
    { "13": 1, "28": 1, "60": 1, "76": 1, "77": 1, "120": 1, "131": 1, "136": 1, "137": 1, "138": 1, "143": 1 }, "color":
    { "14": 1, "53": 1 }, "manipulation":
    { "14": 1, "58": 1, "69": 1, "75": 1 }, "raster":
    { "14": 1, "98": 1, "99": 1, "102": 1, "105": 1, "110": 1, "113": 1 }, "hue":
    { "14": 1 }, "lightness":
    { "14": 1 }, "chroma":
    { "14": 1 }, "stamen":
    { "14": 1, "18": 1, "28": 1, "29": 1, "36": 1, "50": 1, "54": 1, "62": 1, "63": 1, "118": 1, "152": 1 }, "create":
    { "15": 1, "26": 1, "29": 1, "93": 1, "96": 1 }, "controls":
    { "15": 1, "88": 1, "165": 1 }, "icon":
    { "16": 1, "17": 1, "29": 1, "35": 1, "53": 1, "54": 1, "55": 1, "56": 1, "73": 1, "76": 1, "77": 1 }, "object":
    { "16": 1 }, "element":
    { "16": 1, "39": 1 }, "interactions":
    { "17": 1, "116": 1 }, "drag":
    { "17": 1, "20": 1, "21": 1, "22": 1, "38": 1, "132": 1 }, "editing":
    { "17": 1, "83": 1, "132": 1, "134": 1 }, "linestring":
    { "17": 1, "36": 1, "37": 1, "43": 1, "52": 1, "57": 1, "73": 1, "79": 1, "101": 1, "122": 1, "123": 1, "131": 1 }, "polygon":
    { "17": 1, "26": 1, "29": 1, "79": 1, "95": 1, "101": 1, "129": 1, "131": 1 }, "pointer":
    { "17": 1, "75": 1 }, "tilejson":
    { "17": 1, "53": 1, "56": 1, "67": 1, "68": 1, "80": 1, "96": 1, "112": 1, "125": 1, "127": 1, "128": 1, "130": 1 }, "openlayers":
    { "18": 1, "61": 1, "131": 1, "133": 1 }, "d3":
    { "18": 1 }, "together":
    { "18": 1, "23": 1, "116": 1 }, "integration":
    { "18": 1, "41": 1, "61": 1, "131": 1 }, "imagecanvas":
    { "18": 1 }, "listen":
    { "19": 1 }, "deviceorientation":
    { "19": 1 }, "device":
    { "19": 1 }, "orientation":
    { "19": 1, "43": 1 }, "gyronorm":
    { "19": 1 }, "math":
    { "19": 1 }, "drop":
    { "20": 1, "21": 1 }, "rendering":
    { "20": 1, "37": 1, "63": 1, "64": 1, "67": 1, "101": 1, "130": 1 }, "gpx":
    { "20": 1, "21": 1, "48": 1 }, "igc":
    { "20": 1, "21": 1, "57": 1 }, "kml":
    { "20": 1, "21": 1, "28": 1, "29": 1, "50": 1, "62": 1, "63": 1, "64": 1 }, "topojson":
    { "20": 1, "21": 1, "89": 1, "130": 1 }, "draganddrop":
    { "20": 1, "21": 1 }, "single":
    { "22": 1, "46": 1, "103": 1, "147": 1, "148": 1 }, "rotate":
    { "22": 1, "38": 1 }, "dragrotateandzoom":
    { "22": 1, "38": 1, "91": 1 }, "draw":
    { "23": 1, "24": 1, "25": 1, "26": 1, "33": 1, "73": 1, "79": 1, "116": 1, "129": 1, "131": 1, "134": 1 }, "modify":
    { "23": 1, "83": 1, "84": 1, "116": 1, "134": 1 }, "edit":
    { "23": 1, "24": 1, "25": 1, "26": 1, "79": 1, "83": 1, "84": 1, "116": 1, "131": 1, "134": 1 }, "featureoverlay":
    { "23": 1 }, "snap":
    { "23": 1, "116": 1, "131": 1 }, "freehand":
    { "24": 1, "25": 1, "26": 1 }, "drawing":
    { "25": 1, "73": 1 }, "regular":
    { "26": 1, "100": 1 }, "shapes":
    { "26": 1, "100": 1 }, "dynamic":
    { "27": 1 }, "data":
    { "27": 1, "48": 1, "57": 1, "113": 1, "128": 1 }, "multipoint":
    { "27": 1, "95": 1 }, "use":
    { "28": 1, "29": 1, "50": 1, "61": 1, "62": 1, "87": 1, "131": 1, "133": 1 }, "geometries":
    { "28": 1, "101": 1 }, "render":
    { "28": 1, "29": 1, "62": 1, "101": 1, "110": 1, "120": 1 }, "earthquake":
    { "28": 1, "62": 1 }, "clusters":
    { "28": 1 }, "regularshape":
    { "28": 1, "71": 1, "100": 1, "121": 1 }, "tocanvas":
    { "29": 1 }, "symbols":
    { "29": 1, "121": 1 }, "earthquakes":
    { "29": 1, "50": 1, "62": 1 }, "symbol":
    { "29": 1, "100": 1, "121": 1 }, "epsg":
    { "30": 1, "102": 1, "149": 1, "159": 1 }, "epsg4326":
    { "30": 1 }, "scaleline":
    { "30": 1, "108": 1, "109": 1, "145": 1, "147": 1 }, "tilewms":
    { "30": 1, "47": 1, "105": 1, "129": 1, "145": 1, "146": 1, "149": 1, "150": 1, "151": 1, "152": 1 }, "exporting":
    { "31": 1, "32": 1 }, "as":
    { "31": 1, "32": 1, "161": 1 }, "png":
    { "31": 1 }, "export":
    { "31": 1, "32": 1 }, "pdf":
    { "32": 1 }, "wkt":
    { "32": 1, "143": 1 }, "animate":
    { "34": 1, "36": 1 }, "flash":
    { "34": 1 }, "observable":
    { "34": 1, "79": 1 }, "move":
    { "35": 1 }, "along":
    { "35": 1, "133": 1 }, "line":
    { "35": 1, "73": 1, "108": 1 }, "marker":
    { "35": 1, "53": 1, "54": 1, "56": 1 }, "postcompose":
    { "35": 1, "36": 1 }, "polyline":
    { "35": 1 }, "flights":
    { "36": 1, "57": 1 }, "flight":
    { "36": 1 }, "arc":
    { "36": 1 }, "fractal":
    { "37": 1 }, "full":
    { "38": 1, "39": 1, "40": 1, "82": 1 }, "screen":
    { "38": 1, "39": 1, "40": 1, "82": 1 }, "effect":
    { "38": 1 }, "fullscreen":
    { "38": 1, "39": 1, "40": 1, "43": 1, "82": 1 }, "option":
    { "39": 1 }, "definition":
    { "39": 1 }, "extended":
    { "39": 1 }, "fullscreensource":
    { "39": 1 }, "slice":
    { "41": 1 }, "into":
    { "41": 1 }, "fly":
    { "41": 1 }, "browser":
    { "41": 1 }, "vt":
    { "41": 1 }, "mapbox":
    { "41": 1, "76": 1, "77": 1 }, "vectortile":
    { "41": 1, "76": 1, "77": 1, "89": 1, "140": 1 }, "projection":
    { "41": 1, "102": 1, "103": 1, "104": 1, "105": 1, "109": 1, "117": 1, "119": 1, "145": 1, "147": 1, "149": 1, "159": 1, "164": 1 }, "geolocated":
    { "43": 1 }, "oriented":
    { "43": 1 }, "geolocation":
    { "43": 1, "44": 1, "82": 1 }, "tracking":
    { "43": 1 }, "mobile":
    { "43": 1, "76": 1, "82": 1 }, "overlay":
    { "43": 1, "49": 1, "56": 1, "79": 1, "90": 1, "96": 1, "128": 1 }, "wms":
    { "45": 1, "46": 1, "47": 1, "105": 1, "144": 1, "145": 1, "146": 1, "147": 1, "148": 1, "149": 1, "150": 1, "151": 1, "152": 1 }, "getfeatureinfo":
    { "45": 1, "46": 1, "47": 1 }, "requests":
    { "45": 1, "47": 1 }, "foreachlayeratpixel":
    { "45": 1, "47": 1 }, "imagewms":
    { "45": 1, "59": 1, "147": 1, "148": 1, "149": 1 }, "fetch":
    { "46": 1 }, "per":
    { "46": 1 }, "name":
    { "46": 1 }, "request":
    { "46": 1, "141": 1 }, "wmsgetfeatureinfo":
    { "46": 1 }, "issuing":
    { "47": 1 }, "add":
    { "49": 1, "88": 1 }, "graticule":
    { "49": 1, "117": 1 }, "heatmap":
    { "50": 1 }, "from":
    { "51": 1, "57": 1, "63": 1, "99": 1, "113": 1, "124": 1, "128": 1, "130": 1, "140": 1, "157": 1 }, "here":
    { "51": 1 }, "api":
    { "51": 1 }, "xyz":
    { "51": 1, "105": 1, "106": 1, "110": 1, "113": 1, "126": 1, "134": 1, "135": 1, "159": 1, "160": 1, "161": 1, "162": 1 }, "hittolerance":
    { "52": 1 }, "parameter":
    { "52": 1, "154": 1 }, "hit":
    { "52": 1 }, "tolerance":
    { "52": 1 }, "assigning":
    { "53": 1 }, "colors":
    { "53": 1 }, "operations":
    { "54": 1, "98": 1 }, "sprite":
    { "55": 1 }, "webgl":
    { "55": 1, "65": 1, "114": 1, "121": 1 }, "sprites":
    { "55": 1 }, "symbolize":
    { "56": 1 }, "symbolizer":
    { "56": 1, "62": 1 }, "popup":
    { "56": 1, "90": 1, "96": 1 }, "tracks":
    { "57": 1 }, "recorded":
    { "57": 1 }, "multiple":
    { "57": 1 }, "paraglider":
    { "57": 1 }, "same":
    { "57": 1 }, "day":
    { "57": 1 }, "read":
    { "57": 1, "128": 1 }, "file":
    { "57": 1 }, "complex":
    { "57": 1 }, "closest":
    { "57": 1 }, "opencyclemap":
    { "57": 1 }, "apply":
    { "58": 1 }, "filter":
    { "58": 1, "141": 1 }, "imagery":
    { "58": 1 }, "filters":
    { "58": 1 }, "load":
    { "59": 1, "125": 1 }, "loading":
    { "59": 1, "125": 1, "134": 1, "135": 1, "139": 1, "142": 1 }, "jsts":
    { "61": 1 }, "buffer":
    { "61": 1 }, "shape":
    { "62": 1, "100": 1 }, "locations":
    { "62": 1 }, "timezones":
    { "63": 1 }, "clipping":
    { "65": 1, "66": 1 }, "restricting":
    { "67": 1 }, "limited":
    { "67": 1 }, "group":
    { "68": 1 }, "groups":
    { "68": 1 }, "input":
    { "68": 1 }, "bind":
    { "68": 1 }, "layergroup":
    { "68": 1 }, "portion":
    { "69": 1 }, "one":
    { "69": 1, "124": 1 }, "over":
    { "69": 1 }, "another":
    { "69": 1, "124": 1 }, "spy":
    { "69": 1 }, "swipe":
    { "70": 1 }, "ordering":
    { "71": 1 }, "z":
    { "71": 1 }, "index":
    { "71": 1 }, "setting":
    { "72": 1 }, "after":
    { "72": 1 }, "construction":
    { "72": 1 }, "lazy":
    { "72": 1 }, "arrows":
    { "73": 1 }, "each":
    { "73": 1 }, "string":
    { "73": 1 }, "segment":
    { "73": 1 }, "arrow":
    { "73": 1 }, "localized":
    { "74": 1 }, "server":
    { "74": 1, "134": 1, "135": 1, "139": 1, "142": 1 }, "openseamap":
    { "74": 1 }, "show":
    { "75": 1, "80": 1 }, "magnified":
    { "75": 1 }, "version":
    { "75": 1 }, "imager":
    { "75": 1 }, "under":
    { "75": 1 }, "magnify":
    { "75": 1 }, "grid":
    { "76": 1 }, "mvt":
    { "76": 1, "77": 1, "140": 1 }, "tilegrid":
    { "76": 1, "105": 1, "134": 1, "135": 1, "146": 1, "154": 1, "156": 1, "158": 1 }, "untiled":
    { "78": 1 }, "mapguide":
    { "78": 1 }, "imagemapguide":
    { "78": 1 }, "measure":
    { "79": 1 }, "lengths":
    { "79": 1 }, "areas":
    { "79": 1 }, "sphere":
    { "79": 1, "117": 1, "129": 1 }, "hide":
    { "80": 1 }, "depending":
    { "80": 1 }, "current":
    { "80": 1 }, "resolution":
    { "80": 1 }, "min":
    { "80": 1, "81": 1 }, "max":
    { "80": 1 }, "minresolution":
    { "80": 1 }, "maxresolution":
    { "80": 1 }, "minimum":
    { "81": 1 }, "level":
    { "81": 1, "110": 1 }, "changed":
    { "81": 1 }, "testing":
    { "84": 1 }, "modification":
    { "84": 1 }, "test":
    { "84": 1 }, "mouse":
    { "85": 1 }, "position":
    { "85": 1 }, "outside":
    { "85": 1 }, "mouseposition":
    { "85": 1, "131": 1 }, "restrict":
    { "86": 1, "94": 1 }, "wheel":
    { "86": 1 }, "trackpad":
    { "86": 1 }, "zooming":
    { "86": 1, "94": 1 }, "integer":
    { "86": 1, "94": 1 }, "levels":
    { "86": 1, "94": 1 }, "mousewheel":
    { "86": 1 }, "mousewheelzoom":
    { "86": 1 }, "moveend":
    { "87": 1 }, "event":
    { "87": 1 }, "navigation":
    { "88": 1 }, "zoomtoextent":
    { "88": 1 }, "mapzen":
    { "89": 1 }, "overlays":
    { "90": 1 }, "popover":
    { "90": 1 }, "overviewmap":
    { "91": 1, "92": 1 }, "customization":
    { "91": 1 }, "overview":
    { "91": 1, "92": 1 }, "permalinks":
    { "93": 1 }, "permalink":
    { "93": 1 }, "history":
    { "93": 1 }, "pinch":
    { "94": 1 }, "pinchzoom":
    { "94": 1 }, "vertices":
    { "95": 1 }, "styles":
    { "95": 1, "100": 1 }, "geometryfunction":
    { "95": 1 }, "uses":
    { "96": 1 }, "preloading":
    { "97": 1 }, "preload":
    { "97": 1 }, "pixelwise":
    { "98": 1 }, "grow":
    { "99": 1 }, "region":
    { "99": 1 }, "seed":
    { "99": 1 }, "growing":
    { "99": 1 }, "some":
    { "100": 1 }, "square":
    { "100": 1, "146": 1 }, "cross":
    { "100": 1 }, "star":
    { "100": 1 }, "triangle":
    { "100": 1 }, "x":
    { "100": 1 }, "arbitrary":
    { "101": 1, "102": 1 }, "client":
    { "102": 1, "103": 1, "104": 1, "105": 1, "109": 1, "149": 1 }, "side":
    { "102": 1, "103": 1, "104": 1, "105": 1, "109": 1, "114": 1 }, "reprojection":
    { "102": 1, "103": 1, "104": 1, "105": 1, "109": 1 }, "io":
    { "102": 1 }, "search":
    { "102": 1 }, "proj4js":
    { "102": 1, "103": 1, "105": 1, "117": 1, "147": 1 }, "tileimage":
    { "102": 1, "105": 1 }, "imagestatic":
    { "103": 1, "119": 1 }, "wgs84":
    { "104": 1 }, "between":
    { "105": 1 }, "various":
    { "105": 1, "165": 1 }, "projections":
    { "105": 1 }, "wmts":
    { "105": 1, "153": 1, "154": 1, "155": 1, "156": 1, "157": 1, "158": 1 }, "hidpi":
    { "105": 1, "155": 1, "161": 1 }, "wmtscapabilities":
    { "105": 1, "153": 1, "155": 1, "157": 1 }, "updating":
    { "106": 1 }, "by":
    { "106": 1, "114": 1 }, "changing":
    { "106": 1, "152": 1, "154": 1 }, "url":
    { "106": 1 }, "reusable":
    { "106": 1 }, "rotated":
    { "107": 1 }, "scale":
    { "108": 1 }, "nad83":
    { "109": 1 }, "indiana":
    { "109": 1 }, "east":
    { "109": 1 }, "sea":
    { "110": 1 }, "different":
    { "110": 1, "114": 1 }, "elevations":
    { "110": 1 }, "operation":
    { "110": 1 }, "flood":
    { "110": 1 }, "semi":
    { "112": 1 }, "transparent":
    { "112": 1 }, "calculate":
    { "113": 1 }, "shaded":
    { "113": 1 }, "relief":
    { "113": 1 }, "elevation":
    { "113": 1 }, "two":
    { "114": 1, "118": 1, "149": 1 }, "renderers":
    { "114": 1 }, "share":
    { "114": 1 }, "properties":
    { "114": 1 }, "shared":
    { "114": 1 }, "views":
    { "114": 1 }, "mollweide":
    { "117": 1 }, "component":
    { "117": 1 }, "watercolor":
    { "118": 1 }, "terrain":
    { "118": 1 }, "labels":
    { "118": 1, "120": 1, "136": 1, "137": 1 }, "static":
    { "119": 1 }, "xkcd":
    { "119": 1 }, "street":
    { "120": 1 }, "names":
    { "120": 1 }, "label":
    { "120": 1, "136": 1, "137": 1 }, "streets":
    { "120": 1 }, "atlas":
    { "121": 1 }, "atlasmanager":
    { "121": 1 }, "synthetic":
    { "122": 1, "123": 1 }, "lines":
    { "122": 1 }, "points":
    { "123": 1 }, "moving":
    { "124": 1 }, "target":
    { "124": 1 }, "teleporting":
    { "124": 1 }, "teleport":
    { "124": 1 }, "configuration":
    { "126": 1 }, "opacity":
    { "126": 1 }, "transitions":
    { "126": 1, "152": 1, "154": 1 }, "fade":
    { "126": 1 }, "transition":
    { "126": 1, "152": 1, "154": 1 }, "tileutfgrid":
    { "128": 1 }, "utfgrid":
    { "128": 1 }, "tissot":
    { "129": 1 }, "indicatrices":
    { "129": 1 }, "indicatrix":
    { "129": 1 }, "topology":
    { "130": 1, "131": 1 }, "topolis":
    { "131": 1 }, "translate":
    { "132": 1 }, "turf":
    { "133": 1 }, "js":
    { "133": 1 }, "turfjs":
    { "133": 1 }, "distance":
    { "133": 1 }, "rest":
    { "134": 1, "135": 1, "159": 1, "160": 1 }, "service":
    { "134": 1, "135": 1 }, "application":
    { "134": 1 }, "editable":
    { "134": 1 }, "esri":
    { "134": 1, "135": 1, "159": 1, "160": 1 }, "updatefeature":
    { "134": 1 }, "addfeature":
    { "134": 1 }, "esrijson":
    { "134": 1, "135": 1 }, "loadingstrategy":
    { "134": 1, "135": 1, "139": 1, "142": 1 }, "strategy":
    { "135": 1, "139": 1, "142": 1 }, "decluttering":
    { "136": 1 }, "renderer":
    { "136": 1 }, "country":
    { "138": 1 }, "information":
    { "138": 1, "140": 1 }, "xml":
    { "139": 1 }, "osmxml":
    { "139": 1 }, "bbox":
    { "139": 1, "142": 1 }, "getting":
    { "140": 1 }, "info":
    { "140": 1 }, "making":
    { "141": 1 }, "wfs":
    { "141": 1, "142": 1 }, "getfeature":
    { "141": 1 }, "parser":
    { "143": 1 }, "well":
    { "143": 1 }, "known":
    { "143": 1 }, "parsing":
    { "144": 1, "153": 1 }, "getcapabilities":
    { "144": 1, "153": 1, "157": 1 }, "response":
    { "144": 1, "153": 1 }, "capabilities":
    { "144": 1, "153": 1, "157": 1 }, "wmscapabilities":
    { "144": 1 }, "transform":
    { "145": 1 }, "functions":
    { "145": 1 }, "512x256px":
    { "146": 1 }, "512x256":
    { "146": 1 }, "non":
    { "146": 1 }, "integrating":
    { "147": 1 }, "transforms":
    { "147": 1 }, "which":
    { "149": 1 }, "unknown":
    { "149": 1 }, "without":
    { "149": 1 }, "that":
    { "150": 1 }, "wraps":
    { "150": 1 }, "across":
    { "150": 1 }, "meridian":
    { "150": 1 }, "wrapping":
    { "150": 1 }, "dateline":
    { "150": 1 }, "wrap":
    { "150": 1 }, "smooth":
    { "152": 1, "154": 1 }, "when":
    { "152": 1, "154": 1 }, "time":
    { "152": 1 }, "dimension":
    { "152": 1, "154": 1 }, "dimensions":
    { "152": 1 }, "nexrad":
    { "152": 1 }, "based":
    { "155": 1 }, "high":
    { "155": 1 }, "dpi":
    { "155": 1 }, "retina":
    { "155": 1, "161": 1 }, "displaying":
    { "156": 1 }, "ign":
    { "156": 1 }, "france":
    { "156": 1 }, "french":
    { "156": 1 }, "geoportail":
    { "156": 1 }, "created":
    { "157": 1 }, "document":
    { "157": 1 }, "512x512":
    { "159": 1 }, "tilesize":
    { "159": 1 }, "mercator":
    { "161": 1 }, "512x512px":
    { "161": 1 }, "available":
    { "161": 1 }, "maptiler":
    { "161": 1 }, "2x":
    { "161": 1 }, "devicepixelratio":
    { "161": 1 }, "constrained":
    { "163": 1 }, "minzoom":
    { "163": 1 }, "maxzoom":
    { "163": 1 }, "zoomify":
    { "164": 1 }, "deep":
    { "164": 1 }, "iip":
    { "164": 1 }, "zoomslider":
    { "165": 1 }, "sliders":
    { "165": 1 }, "slider":
    { "165": 1 }, "css":
    { "165": 1 }
}
};
