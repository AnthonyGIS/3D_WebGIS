var viewer = new Cesium.Viewer('cesiumContainer', {
    imageryProvider : new Cesium.ArcGisMapServerImageryProvider({
        url : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
    }),
    baseLayerPicker : false
});

Sandcastle.reset = function() {
  viewer.dataSources.removeAll();
  //Set the camera to a US centered tilted view and switch back to moving in world coordinates.
  viewer.camera.lookAt(Cesium.Cartesian3.fromDegrees(-98.0, 40.0), new Cesium.Cartesian3(0.0, -4790000.0, 3930000.0));
  viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
};

Sandcastle.finishedLoading();

var dataSource = Cesium.CzmlDataSource.load("data/nations_test_reformat.czml");
viewer.dataSources.add(dataSource);
// viewer.dataSources.add(Cesium.GeoJsonDataSource.load('ne_10m_us_states.topojson', {
//         stroke: Cesium.Color.PINK,
//         strokeWidth: 3
//     }));
// Cesium.loadJson('nations_test.json').then(function(Data) {
//   for( state of Data){
//     var blueBox = viewer.entities.add({
//       name : 'box',
//       position: Cesium.Cartesian3.fromDegrees(state.lon, state.lat, 000000)
//     });
//     for( i in state['Call Drop Rate']){
//       var date = state['Call Drop Rate'][i][0];
//       var rate = state['Call Drop Rate'][i][1];
//       var subs = state['Subscriber'][i][1];
//       blueBox.box = {
//           dimensions : new Cesium.Cartesian3(subs/4, 50000.0, rate*20000000),
//           material : Cesium.Color.fromRandom({
//             alpha: 1.0
//           }),
//           outline : true,
//       }
//     }
//   }
// }).otherwise(function(error) {
//     alert("ERROR: ",error);
// });

//
// state.lon, state.lat state['Call Drop Rate'][1][1]
// state['Call Drop Rate'][1][0]
// state.lon, state.lat state['Call Drop Rate'][1][1]

//draw d3 chart
var w = 500;
  var h = 200;
  var padding =40;
  var svg = d3.select("body").append("svg")
  .attr("width", w)
  .attr("height", h)
  .attr("padding", padding);

d3.json('data/nations_test.json',function(data){
  var dataSet = data;
  var days = dataSet[0]['Subscriber'].length;
  var result = [];
  var formatAsPercentage = d3.format(".1%");
  for (i = 0; i < days; i++){
    var everyday = [];
    for (state of dataSet){
      var array1 = state['Call Drop Rate'];
      var array2 = state['Call Setup Failure Rate'];
      var array3 = state['Subscriber'];
      everyday.push([array1[i][1], array2[i][1], array3[i][1], array3[i][0] ]);
    }
    result.push( everyday );
  }

  var xScale = d3.scaleLinear()
  .domain([0, d3.max(result[0], function(d) { return d[1]; })])
  .range([padding, w - padding * 2]);
  var yScale = d3.scaleLinear()
  .domain([0, d3.max(result[0], function(d) { return d[0]; })])
  .range([h - padding, padding]);
  var rScale = d3.scaleLinear()
  .domain([0, d3.max(result[0], function(d) { return d[2]; })])
  .range([2, 20]);

  //draw bubble with data
  svg.selectAll(".bubble")
  .data(result[0])
  .enter()
  .append("circle")
  .attr('class','bubble')
  .attr('fill',function() {
    return "hsl(" + Math.random() * 360 + ",100%,50%)";
  })
  .attr("cx",function(d){
    return xScale(d[1]);
  })
  .attr("cy", function(d){
    return yScale(d[0]);
  })
  .attr("r", function(d){
    return rScale(d[2]);
  });

  //add x,y axis
  var xAxis = d3.axisBottom()
  .scale(xScale);
  var yAxis = d3.axisLeft()
  .scale(yScale)
  .ticks(7)
  .tickFormat(formatAsPercentage);

  svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(0," + (h - padding/2) + ")")
  .call(xAxis);
  svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(" + padding + ",0)")
  .call(yAxis);
  // add text
  svg.append("text")
  .attr("transform", "translate(" + (w/2) + "," + (h - padding/2) + ")")
  .style("text-anchor", "right")
  .text("Call Setup Failures Rate");

  svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 + padding)
  .attr("x", 0 - w/3)
  .attr("dy", "1em")
  .style("text-anchor" , "right")
  .text("Call Drop Rate");
  //
  svg.append("text")
  .attr("x", (w/2))
  .attr("y", h - (4*padding))
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text(result[0][0][3]);
})
