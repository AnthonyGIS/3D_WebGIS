
//计算弧线的高度
function FucCurveHeight(StartFuncPoint,EndFuncPoint,CurveCiTa,PointDis){
	var StartHeight = StartFuncPoint[1];
	var Distance = EndFuncPoint[0];
	var EndHeight = EndFuncPoint[1];
	
	var PointHeight = CurveCiTa*PointDis*PointDis
		+(EndHeight-StartHeight-CurveCiTa*Distance*Distance)*PointDis/Distance
		+StartHeight
	
	return PointHeight;
}


var lengthInMeters;

//计算长度
function lengthOf(array){
	var lengthOf=0;	
	for(var i=0; i<array.length-1; i++){
		//计算长度
		var coordinates1 = array[i];
		var coordinates2 = array[i+1];
	    var startCartographic1 = Cesium.Cartographic.fromDegrees(coordinates1[0],coordinates1[1]);
	    var startCartographic = Cesium.Cartographic.fromDegrees(coordinates2[0],coordinates2[1]);
	    geodesic.setEndPoints(startCartographic, startCartographic1);
		lengthOf = lengthOf + Math.round(geodesic.surfaceDistance);	
	}
	if(lengthOf>1000){
        var polylineDis= (lengthOf / 1000).toFixed(1) + " km";
    }else{
        var polylineDis= lengthOf + " m";
    }
	return polylineDis;
}

//计算圆面积
function toArea(startPointLon,startPointLat,endPointLon,endPointLat){
	//计算半径的长度
    var startCartographic1 = Cesium.Cartographic.fromDegrees(endPointLon, endPointLat);
    var startCartographic = Cesium.Cartographic.fromDegrees(startPointLon,startPointLat);
    geodesic.setEndPoints(startCartographic, startCartographic1);
    lengthInMeters = Math.round(geodesic.surfaceDistance);
    //计算圆的面积	
	var s = 3.14*(lengthInMeters*lengthInMeters);
	return s+'平方米';
}


 var earthRadiusMeters = 6371000.0;
 var metersPerDegree = 2.0 * Math.PI * earthRadiusMeters / 360.0;
 var radiansPerDegree = Math.PI / 180.0;
 var degreesPerRadian = 180.0 / Math.PI;
 var pointArr;
  //计算多边形面积
 function SphericalPolygonAreaMeters(points) {
     var totalAngle = 0;
     for (var i = 0; i < points.length; i++) {
         var j = (i + 1) % points.length;
         var k = (i + 2) % points.length;
         totalAngle += Angle(points[i], points[j], points[k]);
     }
     var planarTotalAngle = (points.length - 2) * 180.0;
     var sphericalExcess = totalAngle - planarTotalAngle;
     if (sphericalExcess > 420.0) {
         totalAngle = points.length * 360.0 - totalAngle;
         sphericalExcess = totalAngle - planarTotalAngle;
     } else if (sphericalExcess > 300.0 && sphericalExcess < 420.0) {
         sphericalExcess = Math.abs(360.0 - sphericalExcess);
     }
     var ss = sphericalExcess * radiansPerDegree * earthRadiusMeters * earthRadiusMeters;
     return sphericalExcess * radiansPerDegree * earthRadiusMeters * earthRadiusMeters;
 }
 /*角度*/
 function Angle(p1, p2, p3) {
     var bearing21 = Bearing(p2, p1);
     var bearing23 = Bearing(p2, p3);
     var angle = bearing21 - bearing23;
     if (angle < 0) {
         angle += 360;
     }
     return angle;
 }
  /*方向*/
 function Bearing(from, to) {
     var lat1 = from[1] * radiansPerDegree;
     var lon1 = from[0] * radiansPerDegree;
     var lat2 = to[1] * radiansPerDegree;
     var lon2 = to[0] * radiansPerDegree;
     var angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
     if (angle < 0) {
         angle += Math.PI * 2.0;
     }
     angle = angle * degreesPerRadian;
     return angle;
 }