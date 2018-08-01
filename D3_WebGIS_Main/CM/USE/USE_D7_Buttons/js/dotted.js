	
	//数据变量
	var list2=[]; 
	var list3=[];
	var list4=[];
	//布尔型变量
    var isPoint = false;
    var isPolyline = false;
    var isPolygon_line = false;
    var isRound = false;
     var isArc = false;

    //是否开始绘制标识
    var isStartDraw = false;
    var isclear = false;
    var points = viewer.entities.add(new Cesium.Entity());
    var polylines = viewer.entities.add(new Cesium.Entity());
    var Polygons_Line = viewer.entities.add(new Cesium.Entity());

    //画多边形过程中展示的线最后要移除或者不显示
    var Polygon_Lines_remove = viewer.entities.add(new Cesium.Entity());

    var ellipsoid = scene.globe.ellipsoid;
    canvas.onclick = function () {
        canvas.focus();
    };
   
    viewer.zoomTo(viewer.entities);

    defaultZoomAmount_ = 3000000.0;
    var lastPointLon = -999.0;
    var lastPointLat = -999.0;
    var gaocheng=10;
    var gaocheng1=10;
    var firstPointLon = -999.0;
    var firstPointLat = -999.0;
    var measurePointsArray=new Array();
    measurePointsArray.splice(0,measurePointsArray.length);
    var endCartographic = new Cesium.Cartographic();
    var geodesic = new Cesium.EllipsoidGeodesic();
    var PolygonPointArray_line = null;
    var PolygonPointArray_fill = null;
    //鼠标移动时的那条线 
	var moveLine_first =moveLine("moveLine_first");
	var moveLine_second =moveLine("moveLine_second");
    function moveLine(id){
    	var moveLine_first = viewer.entities.add({
	        id: id,
	        name: 'line on the surface',
	        polyline: {
	            show: false,
	            width: 2,
	            material: Cesium.Color.WHITE
	        }
		});
		return moveLine_first;
    }	
    
    handler.setInputAction(function(){},
        Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    //鼠标移动时做的操作
    function yidong(cartesian,curMovementLon,curMovementLat,height){
        if (isPolyline || isPolygon_line || isRound ||isArc) {           
            if (cartesian && isStartDraw) {
                //做清除工作把全局变量moveLine清除掉了 ，需要重新加到entities上 否则显示不正常
                if (isclear) {
                    viewer.entities.add(moveLine_first);
                    viewer.entities.add(moveLine_second);
                    isclear = false;
                }           
                viewer.entities.getById("moveLine_first").polyline.positions = Cesium.Cartesian3.fromDegreesArrayHeights([lastPointLon, lastPointLat,gaocheng, curMovementLon, curMovementLat,height]);//修改属性
                viewer.entities.getById("moveLine_first").polyline.show = true;
                if (PolygonPointArray_line != null) {
                    if (PolygonPointArray_line.length >= 3) {
                        viewer.entities.getById("moveLine_second").polyline.positions = Cesium.Cartesian3.fromDegreesArrayHeights([curMovementLon, curMovementLat, height,firstPointLon, firstPointLat,gaocheng1]);//修改属性
                        viewer.entities.getById("moveLine_second").polyline.show = true;
                    }
                }
            }
        }
    }
	
    //鼠标左击做的操作
    function mouseLeft(cartesian,cartographic,currentClickLon,currentClickLat,height){ 
		if(isPoint){			
        	var name = '经度：'+currentClickLon+'\n纬度：'+currentClickLat+'\n高度：'+height;
        	CreatePoint(currentClickLon,currentClickLat,height,name,'glyphicons_242_google_maps.png');                      
        }
        if(isPolyline || isPolygon_line ) {
            if (cartesian) {
                //记录画多边形的点
                if(isPolygon_line){
                	var list=[];
                    list.push(currentClickLon,currentClickLat);
                    list2.push(list);
                }
                //记录画圆的中心点
				if(isRound){
                	if(list3.length==0){
                		list3.push(currentClickLon,currentClickLat,height);
                		isPolyline = false;
                	}                	
                }
				//记录弧线的第一个点
				if(isArc){
                	if(list4.length==0){
                		list4.push(currentClickLon,currentClickLat);
                		isPolyline = false;
                	}                	
                }
                if (!isStartDraw){
                	//创建点
                	CreatePoint(currentClickLon,currentClickLat,height,'起点'); 
                	//存经纬度、高度
                    firstPointLon = currentClickLon;
                    firstPointLat = currentClickLat;
                    gaocheng1=height;
                    PolygonPointArray_line = null;
                    PolygonPointArray_fill = null;
                    measurePointsArray.splice(0,measurePointsArray.length);
                    //var startCartographic = Cesium.Cartographic.fromDegrees(firstPointLon, firstPointLat);
                    measurePointsArray.push(cartographic);
                    isStartDraw = true;
                } else {                    
                    if (isPolyline || isPolygon_line )
                    {
                        endCartographic = Cesium.Cartographic.fromDegrees(currentClickLon, currentClickLat);
                        console.log(endCartographic);
                        measurePointsArray.push(endCartographic);
                        var arrLength=measurePointsArray.length;
                        var tmpDis=0;
                        var sumDis=0;
                        for(var i=1;i<arrLength;i++)
                        {
                            geodesic.setEndPoints(measurePointsArray[i-1], measurePointsArray[i]);
                            tmpDis=Math.round(geodesic.surfaceDistance);
                            sumDis=sumDis+tmpDis;
                        }
                        if(sumDis>1000){
                            var polylineDis= (sumDis / 1000).toFixed(1) + " km";
                        }else{
                            var polylineDis= sumDis + " m";
                        }
                        //  console.log(dis);
                        var array = [lastPointLon, lastPointLat, gaocheng,currentClickLon,currentClickLat,height];
                        var collection = [currentClickLon,currentClickLat,height];
                        CreateLine(array,polylineDis.toString(),collection);
                        viewer.entities.getById("moveLine_first").polyline.show = false;
                        viewer.entities.getById("moveLine_second").polyline.show = false;
                    }
                }
                //记录鼠标点击的当前位置 作为下一次画线的起始点位置
                lastPointLon = currentClickLon;
                lastPointLat = currentClickLat;
                gaocheng=height;

                if (isPolygon_line) {
                    if (PolygonPointArray_line == null)
                        PolygonPointArray_line = new Array();
	                    PolygonPointArray_line.push(currentClickLon);
	                    PolygonPointArray_line.push(currentClickLat);
                }
            }
        }
    }


    //鼠标右键点击时做的操作
    function  mouseMiddle(cartesian,cartographic,endPointLon,endPointLat,height) {
        if (isPolyline || isPolygon_line || isRound || isArc){        	
            if (cartesian && isStartDraw){
                 if(isPolygon_line){
                	var list=[];
                    list.push(endPointLon,endPointLat);
                    list2.push(list);
                }   
                //画弧线
                if(isArc){
                	clearAllPan();
                	var list =[endPointLon,endPointLat];
                	var cita = -0.0006;
                	CeMDrawCurve(list4,list,"0001",cita,Cesium.Color.BLUE);
                	list4=[];
                }
                //画圆
                if(isRound){
                	clearAllPan();
                	//计算圆面积
                	var s = toArea(list3[0], list3[1],endPointLon,endPointLat);
		            //创建圆
		            var array = [list3[0], list3[1], list3[2]];
		            var redEllipse = CreateRound(array,s,lengthInMeters);
					//清空存储的圆中心点
					list3=[];
                }
                measurePointsArray.push(cartographic);
                var arrLength=measurePointsArray.length;
                var tmpDis=0;
                var sumDis=0;
                for(var i=1;i<arrLength;i++){
                    geodesic.setEndPoints(measurePointsArray[i-1], measurePointsArray[i]);
                    tmpDis=Math.round(geodesic.surfaceDistance);
                    sumDis=sumDis+tmpDis;
                }
                //考虑多边形最后显示距离
                geodesic.setEndPoints(measurePointsArray[0], measurePointsArray[arrLength-1]);
                tmpDis=Math.round(geodesic.surfaceDistance);
                sumDis1=sumDis+tmpDis;
                if(sumDis>1000){
                    var polylineDis= (sumDis / 1000).toFixed(1) + " km";
                    var polygonDis = (sumDis1 / 1000).toFixed(1) + " km";
                }else{
                    var polylineDis= (sumDis) + " m";
                    var polygonDis = (sumDis1) + " m";
                }
                if (isPolyline || isPolygon_line){
                    if(isPolyline){
                    	//画末线段
                    	var array = [lastPointLon, lastPointLat,gaocheng, endPointLon, endPointLat,height];
                    	var collection = [endPointLon, endPointLat,height]; 
                    	CreateLine(array,polylineDis.toString(),collection); 
                    }
                    if ( isPolygon_line ){
                    	if (PolygonPointArray_line.length < 3){              
			        	  	return false;	
			        	 }                        
                        viewer.entities.getById("moveLine_second").polyline.show = false;
                    }
                    viewer.entities.getById("moveLine_first").polyline.show = false;
                }
                operation = 0;
                var mianji;
                //画多边形 不带填充               
                if (isPolygon_line){
                	clearAllPan();
                	 mianji = SphericalPolygonAreaMeters(list2);
                    if (PolygonPointArray_line != null){
                        PolygonPointArray_line.push(endPointLon);
                        PolygonPointArray_line.push(endPointLat);
                    }                     
                    //当多边形数组中点的个数大于等于3时添加多边形
                    if (PolygonPointArray_line.length >= 3) {
                    	var name = mianji.toFixed(2)+"平方米";
                    	var collection = [firstPointLon, firstPointLat,gaocheng1]; 
                    	CreatePolygon(PolygonPointArray_line,name,collection);                       
                    }
                    list2=[]; 
                    //停止加点线面
                    shuangji();
                    PolygonPointArray_line = null;
                    viewer.entities.getById("moveLine_first").polyline.show = false;
                    viewer.entities.getById("moveLine_second").polyline.show = false;
                }
                 isPolyline = false;
                isStartDraw = false;
            }
        }
        
    }



    //加点
    function addPoint() {
    	operation = 1;
    	shuangji();
        isPoint = true;        
    }
	//清空点线面
    function clearAllPan() {
        viewer.entities.removeAll();        
        isStartDraw = false;
        isclear = true;
    }
    //停止加线面
    function shuangji(){
    	isPoint = false;       
        isPolyline = false;
        isRound = false;
        isArc = false;
        isPolygon_line = false;
        isPolygon_fill = false;
        isStartDraw = false;
    }
    //加线
    var flight = 0;
    function addPolyline12(num){
    	//判断是否为飞行画线
    	//flight=1为飞行画线
    	if(num==1){
    		flight = 1;
    	}
    	operation = 1;
        shuangji();
        isPolyline = true;
    }
	 //画面
    function addPolyline13() {
    	operation = 1;
        shuangji();
        isPolygon_line = true;
    }
     //画圆
    function addPolyline14() {
    	operation = 1;
        shuangji();
        isPolyline = true;
        isRound = true;
    }    
 	//画弧线
    function addPolyline15() {
    	operation = 1;
        shuangji();
        isPolyline = true;
        isArc = true;
    }
    

