

function CeMaddKMZ(url){
	viewer.dataSources.removeAll();
	var kmzfile = Cesium.KmlDataSource.load(url,
	     {
	          camera: viewer.scene.camera,
	          canvas: viewer.scene.canvas
	     });
	viewer.dataSources.add(kmzfile);
}

//添加图层
function CeMaddlayer(url,layername){
	var layers = viewer.scene.imageryLayers;
	var newLayer = layers.addImageryProvider( new Cesium.WebMapServiceImageryProvider({
		id:'111',
        url : url,  
        layers: layername,
        parameters : {   
            transparent : 'true',
            format : 'image/png'
        }
   	})); 
	return newLayer;
}

//加载天地图
function CeMaddTiandiWMTSlayer(url,layername,style,format){
	var layers = viewer.scene.imageryLayers;
	var newLayer = layers.addImageryProvider( new Cesium.WebMapTileServiceImageryProvider({
	    url : url,
	    layer : layername,
	    style : style,
	    format : format,
	    tileMatrixSetID : "GoogleMapsCompatible",
	    format : 'image/png',
	    maximumLevel: 19
	}));
	return newLayer;
}

//删除图层
function CeMremovelayer(layer){
    var layers = viewer.scene.imageryLayers;
    layers.remove(layer);
}

//添加地形
function CeMaddterrain(url,terrainlayername,maxLevel){
	var terrainProvider = new Cesium.GeoserverTerrainProvider({
		heightMapWidth : 65,
		heightMapHeight : 65,
		url:url,
		layerName : terrainlayername,
		maxLevel : maxLevel,
		formatImage:{format:"image/png",extension:"png"},
		hasStyledImage:true,
		waterMask:false
	});
	return terrainProvider;
}
//添加图标
function CeMaddmark(lon,lat,height,id,img){
	var entities = viewer.entities;
	var stltPos = [lon, lat, height];
	var mark =entities.add( {  
		id : id,		
        position : Cesium.Cartesian3.fromDegrees.apply( this, stltPos ),  
        billboard : {  
            image : 'img/' + img,  
            horizontalOrigin :Cesium.HorizontalOrigin.CENTER,  
            verticalOrigin :Cesium.VerticalOrigin.BOTTOM
        }  
    });
	return mark;
}

//添加图标文字
function offsetByDistance(lon,lat,height,id,img,LabelGraphics) {
    Sandcastle.declare(offsetByDistance);
    var image = new Image();
    image.onload = function() {
        viewer.entities.add({
            position : Cesium.Cartesian3.fromDegrees(lon, lat),
            billboard : {
                position : Cesium.Cartesian3.fromDegrees(lon, lat),
                scaleByDistance : new Cesium.NearFarScalar(1.5e2, 3.0, 1.5e4, 0.5),
                image : image
            },
            label : {
                text : LabelGraphics,
                font : '10px sans-serif',
                showBackground : true,
                horizontalOrigin : Cesium.HorizontalOrigin.CENTER,
                pixelOffset : new Cesium.Cartesian2(0.0, -image.height),
                pixelOffsetScaleByDistance : new Cesium.NearFarScalar(1.5e2, 3.0, 1.5e3, 0.5)
            }
        });
    };
    image.src = 'img/' + img;
}
//添加图标文字
function  sds(lon,lat,height,id,img,LabelGraphics){
	var rainEntity=viewer.entities.add({
	       id: id,
	    name: LabelGraphics,             
	    position: Cesium.Cartesian3.fromDegrees(lon, lat),
	    billboard: {
	        image: '../img/' + img,
	        scale:0.7,
	        verticalOrigin: Cesium.VerticalOrigin.TOP
	    },
	    label: {
          text: LabelGraphics,
          font: '18px SimHei ',
          Width: 7,
   		  style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          fillColor: Cesium.Color.BLACK,
          outlineColor : Cesium.Color.WHITE,
          outlineWidth :3,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM
	    }
	  });  //添加
	//viewer.entities.getById(id).show = true;   //隐藏
	//viewer.entities.getById(id).label.text= " ";   //修改属性
	//viewer.entities.removeAll();  //移除所有
	//viewer.zoomTo(rainEntity);   //居中显示
	return rainEntity;
}
//去空格
function trimRight(lon,lat,height,id,img,s){  
    if(s == null) return "";  
    var whitespace = new String(" \t\n\r");  
    var str = new String(s);  
    if (whitespace.indexOf(str.charAt(str.length-1)) != -1){  
        var i = str.length - 1;  
        while (i >= 0 && whitespace.indexOf(str.charAt(i)) != -1){  
           i--;  
        }  
        str = str.substring(0, i+1);  
    }  
    sds(lon,lat,height,id,img,str);
    return str;  
}  
//添加文字
function setFont(lon,lat,height,LabelGraphics) {
    Sandcastle.declare(setFont);
    viewer.entities.add({
        position : Cesium.Cartesian3.fromDegrees(lon,lat,height),
        label : {
            text : LabelGraphics,
            font : '20px Helvetica',
            fillColor : Cesium.Color.SKYBLUE,
            outlineColor : Cesium.Color.BLACK,
            outlineWidth : 2,
            style : Cesium.LabelStyle.FILL_AND_OUTLINE
        }
    });
}

//根据ID去除实体
function CeMremoveEntitesByid(id){
	var tempmark = parent.frames["rightFrame"].viewer.entities.getById(id);
	parent.frames["rightFrame"].viewer.entities.remove(tempmark);
}

//根据对象去除实体
function CeMremoveEntitesByname(entites){
	viewer.entities.remove(entites);
}

//飞行到某点
var ss=0;
function CeMgotoposition(lon,lat,height){


    var redCone = viewer.entities.add({
        name : 'Red cone',
        position: Cesium.Cartesian3.fromDegrees(lon,lat,height),
        cylinder : {//圆锥
            length : height,
            topRadius : 0.0,
            bottomRadius : height,
            material : Cesium.Color.RED
        }
    });
    viewer.trackedEntity = redCone;

  /*  setTimeout(function(){
        viewer.trackedEntity =null;
        CeMremoveEntitesByname(redCone);
    },1000);*/
}
function kongge(s){
    if(s == null) return "";
    var whitespace = new String(" \t\n\r");
    var str = new String(s);
    if (whitespace.indexOf(str.charAt(str.length-1)) != -1){
        var i = str.length - 1;
        while (i >= 0 && whitespace.indexOf(str.charAt(i)) != -1){
            i--;
        }
        str = str.substring(0, i+1);
    }
    return str;
}

//添加3D模型
function CeMadd3Dentity(lon,lat,scale,model){
    var entity = viewer.entities.add({
        position : Cesium.Cartesian3.fromDegrees(lon,lat,scale),
        model : {
            uri : model,
            maximumScale : 0.01
        },
        scale : scale,//和原始大小相比的缩放比例
        minimumPixelSize :10 //最小尺寸，防止太小而看不见
    });

    return entity;
}

//删除3D模型
function CeMremove3Dentity(model){
	viewer.entities.remove(model);
}

//根据点数组画线
function CeMaddsimpleline(DegresArry,width,color,name,id){
	var Line = viewer.entities.add({  
	    name : name,  
	    id : id,
	    polyline : {  
	        positions : Cesium.Cartesian3.fromDegreesArray(DegresArry), 
	        width : width,  
	        material : color
	    }  
	});
	return Line;
}

//画帖底线、底面
function CeMaddTerrainLine(LineArray,id){
	var ellipsoid = viewer.scene.globe.ellipsoid;
	var positions = Cesium.Cartesian3.fromDegreesArray(LineArray);
	var flatPositions = Cesium.PolylinePipeline.generateArc({
	    positions: positions,
	    granularity: 0.000001
	});
	var cartographicArray = [];
	for (var i = 0; i < flatPositions.length; i+=3) {
	    var cartesian = Cesium.Cartesian3.unpack(flatPositions, i);
	    cartographicArray.push(ellipsoid.cartesianToCartographic(cartesian));
	}
	var entity = []
	Cesium.sampleTerrain(viewer.terrainProvider, 15, cartographicArray)
	.then(function(raisedPositionsCartograhpic) {
	    var raisedPositions = ellipsoid.cartographicArrayToCartesianArray(raisedPositionsCartograhpic);
	    //console.log(raisedPositions)
	    var entitytemp = viewer.entities.add({
	    	id : id,
	    	/*polygon : {
	    		 hierarchy : {//画面
	                    positions : raisedPositions
	                },
	               material : Cesium.Color.BLUE.withAlpha(0.5)
	    	 }*/
	        polyline : {//画线
	            positions : raisedPositions,
	            width : 0,
	            material : Cesium.Color.BLUE.withAlpha(0.0)
	        }
	    });
	});
}

//根据点数组画高亮线
function CeMaddglowingLine(DegresArry,width,color,name,glowPower){
	var glowingLine = viewer.entities.add({  
	    name : name,  
	    polyline : {  
	        positions : Cesium.Cartesian3.fromDegreesArray(DegresArry),  
	        width : width,  
	        material : new Cesium.PolylineGlowMaterialProperty({  
	            glowPower : glowPower,  
	            color : color
	        })  
	    }  
	});
	return glowingLine;
}

//根据顶点数组画多边形
function CeMaddpolygon(DegresArry,outwidth,fillcolor,outlinecolor,name){
	var Polygon = viewer.entities.add({  
	    name : name,  
	    polygon : {  
	        hierarchy : Cesium.Cartesian3.fromDegreesArray(DegresArry),  
	        material : fillcolor.withAlpha(outwidth),
	        outline : true,  
	        outlineColor : outlinecolor
	    }  
	});
	return Polygon;
}

//画曲线
function CeMDrawCurve(pointS,pointE,id,cita,Color){
	var positions = [
	    Cesium.Cartographic.fromDegrees(pointS[0], pointS[1]),
	    Cesium.Cartographic.fromDegrees(pointE[0], pointE[1])
	];
	Cesium.sampleTerrain(viewer.terrainProvider, 15, positions)
	.then(function(raisedPositionsCartograhpic) {
		var LineArray = [pointS[0], pointS[1],pointE[0], pointE[1]];
		var ellipsoid = viewer.scene.globe.ellipsoid;
		var positions = Cesium.Cartesian3.fromDegreesArray(LineArray);
		var flatPositions = Cesium.PolylinePipeline.generateArc({
		    positions: positions,
		    granularity: 0.000001
		});
        
        var cartographicArray = [];
		for (var i = 0; i < flatPositions.length; i+=3) {
		    var cartesian = Cesium.Cartesian3.unpack(flatPositions, i);
		    cartographicArray.push(ellipsoid.cartesianToCartographic(cartesian));
		}
		
		var geodesic = new Cesium.EllipsoidGeodesic();
        geodesic.setEndPoints(raisedPositionsCartograhpic[0],raisedPositionsCartograhpic[1]);
        var TotalDis = geodesic.surfaceDistance;
	    
	    var dertDistance = TotalDis/cartographicArray.length;
	    //raisedPositionsCartograhpic[0].height第一个点的高度
        var startPoint = [0,raisedPositionsCartograhpic[0].height];
        //raisedPositionsCartograhpic[1].height第二个点的高度
        //TotalDis离第一个点的 距离
        var endPoint = [TotalDis,raisedPositionsCartograhpic[1].height];
        var CurveCiTa = cita;
        
        cartographicArray[0].height = raisedPositionsCartograhpic[0].height;
        cartographicArray[cartographicArray.length-1].height = raisedPositionsCartograhpic[1].height;
	    
	    for (var i = 1;i<cartographicArray.length-1;i++){
	        	var pointDis = i*dertDistance;
	        	cartographicArray[i].height = FucCurveHeight(startPoint,endPoint,CurveCiTa,pointDis);
	        }
	        
        var raisedPositions = ellipsoid.cartographicArrayToCartesianArray(cartographicArray);
        var entitytemp = viewer.entities.add({
	    	id : id,
	        polyline : {
	            positions : raisedPositions,
	            width : 2,
	            material : Color
	        }
	    });
	    
	    
	});
}



function addLayer(){
	blackMarble = CeMaddlayer(url,'guangxi:DMS05_IMAGE');
}

function removeLayer(){
	CeMremovelayer(blackMarble);
}
	function addmark(){
		var mark = CeMaddmark(108.44162,23.44796,"00001","p.png");
	}
	
	function removemark(){
		CeMremoveEntitesByid("00001");
	}
	function add3D(){
		mod = CeMadd3Dentity(120.06,30.27,3,'models/CesiumGround/Cesium_Ground.gltf');
	}
	function remove3D(){
		CeMremoveEntitesByname(mod);
	}
function addline1(){
	line = CeMaddsimpleline(deArray,5,Cesium.Color.BLUE,"多段线");
}
function addline2(){
	line = CeMaddglowingLine(deArray,5,Cesium.Color.BLUE,"多段线",0.5);
}
function addpolygon(){
	pology = CeMaddpolygon(deArray,0.5,Cesium.Color.BLUE,Cesium.Color.RED,"多边形");
}

function CeMaddmoveModal(lineT,id){
	//Set the random number seed for consistent results.
	Cesium.Math.setRandomNumberSeed(3);
	var positionsValue = lineT._polyline._positions._value;

	//Set bounds of our simulation time
	var start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16));
	var stop = Cesium.JulianDate.addSeconds(start, positionsValue.length, new Cesium.JulianDate());

	//Make sure viewer is at the desired time.
	viewer.clock.startTime = start.clone();
	viewer.clock.stopTime = stop.clone();
	viewer.clock.currentTime = start.clone();
	viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
	viewer.clock.multiplier = 10;
	
	
	
	
	var property = new Cesium.SampledPositionProperty();
	
	for (var i = 0; i < positionsValue.length; i++) {
		var time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
		property.addSample(time, positionsValue[i]);
	}
	
	var position = property;

	//Actually create the entity
	var entityflay = viewer.entities.add({
		id : id,

	    //Set the entity availability to the same interval as the simulation time.
	    availability : new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
	        start : start,
	        stop : stop
	    })]),
	    
	    //Use our computed positions
	    position : position,

	    //Automatically compute orientation based on position movement.
	    orientation : new Cesium.VelocityOrientationProperty(position),

	    //Load the Cesium plane model to represent the entity
	  /*  label : {
	        // This callback updates the length to print each frame.
	        text: new Cesium.CallbackProperty(getLength, isConstant),
	        font : '20px sans-serif',
	        pixelOffset : new Cesium.Cartesian2(0.0, 20)
	    }*/
	    model : {
	        uri : 'models/CesiumAir/Cesium_Air.gltf',
	        minimumPixelSize : 64
	    }
	});
	
	
	return entityflay;
}

function CeMaddmoveModal(lineT,id){
    //将随机数种子设置为一致的结果。
    Cesium.Math.setRandomNumberSeed(3);
    var positionsValue = lineT._polyline._positions._value;

    //设置模拟时间的边界
    var start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16));
    var stop = Cesium.JulianDate.addSeconds(start, positionsValue.length, new Cesium.JulianDate());

    //确保查看器处于所需的时间。.
    viewer.clock.startTime = start.clone();
    viewer.clock.stopTime = stop.clone();
    viewer.clock.currentTime = start.clone();
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end


    viewer.clock.multiplier = 10;




    var property = new Cesium.SampledPositionProperty();

    for (var i = 0; i < positionsValue.length; i++) {
        var time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
        property.addSample(time, positionsValue[i]);
    }

    var position = property;

    //Actually create the entity
    var entityflay = viewer.entities.add({
        id : id,

        //将实体可用性设置为与模拟时间相同的间隔。
        availability : new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
            start : start,
            stop : stop
        })]),

        //Use our computed positions
        position : position,

        //基于位置移动的自动计算定位。
        orientation : new Cesium.VelocityOrientationProperty(position),

        //Load the Cesium plane model to represent the entity
        /*  label : {
              // This callback updates the length to print each frame.
              text: new Cesium.CallbackProperty(getLength, isConstant),
              font : '20px sans-serif',
              pixelOffset : new Cesium.Cartesian2(0.0, 20)
          }*/
        model : {
            uri : 'models/CesiumAir/Cesium_Air.gltf',
            minimumPixelSize : 64
        }
    });

    viewer.trackedEntity=entityflay;
    return entityflay;
}

function CeManimationPause(){
	viewer._clockViewModel.shouldAnimate = false;
}

function CeManimationCountinue(){
	viewer._clockViewModel.shouldAnimate = true;
}
var times;



//测量-----画点
function CreatePoint(currentClickLon,currentClickLat,height,name,img){
	viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(currentClickLon, currentClickLat,height), 
        billboard: {
	        image: 'img/'+img,
	        scale:0.7,
	        verticalOrigin: Cesium.VerticalOrigin.TOP
	    },
        label: {
	        text: name,
			font: '18px SimHei ',
	        Width: 7,
	        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
	        fillColor: Cesium.Color.YELLOW,
	        outlineColor : Cesium.Color.GRAY,
	        outlineWidth :2,
	        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
	        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
   		}
});
}

//测量-----画线
function CreateLine(array,name,collection){	
	viewer.entities.add({
        parent: polylines,
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(array),
            width: 2,
            material: Cesium.Color.BLUE
        },
        label: {
            text: name,
            font: '18px SimHei ',
            Width: 7,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            fillColor: Cesium.Color.YELLOW,
            outlineColor : Cesium.Color.GRAY,
            outlineWidth :2,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM
        },
        position: Cesium.Cartesian3.fromDegrees(collection[0],collection[1],collection[2])
    });
}
//测量-----画多边形
function CreatePolygon(array,name,collection){
	viewer.entities.add({
	    name: 'polygon on surface',
	    polygon: {
	        hierarchy: Cesium.Cartesian3.fromDegreesArray(array),
	        material: Cesium.Color.BLUE.withAlpha(0.5),
	        fill: true,  //显示填充
	        outline: true,
	        outlineWidth: 3.0,
	        outlineColor: Cesium.Color.BLUE
	    },
	    label : {
	        // This callback updates the length to print each frame.
	        text: name,
	        font: '18px SimHei ',
	        Width: 7,
	        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
	        fillColor: Cesium.Color.YELLOW,
	        outlineColor : Cesium.Color.GRAY,
	        outlineWidth :2,
	        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
	        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
	    },
	    position: Cesium.Cartesian3.fromDegrees(collection[0],collection[1],collection[2])
	});
}

//测量-----画圆
function CreateRound(array,name,lengthInMeters){
	 var redEllipse = viewer.entities.add({
	    position: Cesium.Cartesian3.fromDegrees(array[0],array[1],array[2]),
	    name : 'Red ellipse on surface',
	    ellipse : {
	        semiMinorAxis : lengthInMeters,
	        semiMajorAxis : lengthInMeters,
	        material : Cesium.Color.BLUE.withAlpha(0.5)
	    },
	    label : {
            // This callback updates the length to print each frame.
            text: name,
           	font: '18px SimHei ',
            Width: 7,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            fillColor: Cesium.Color.YELLOW,
            outlineColor : Cesium.Color.GRAY,
            outlineWidth :2,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM
        }
	});	
	return redEllipse;
}
//测量-----移动时候的线
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
/*var scene = viewer.scene;
var ellipsoid = scene.globe.ellipsoid; //获取当前视角高度
var height=ellipsoid.cartesianToCartographic(viewer.camera.position).height;*/




