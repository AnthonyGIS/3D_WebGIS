define(['Cesium'],function(Cesium){
	var AqiService = function(){
		
	};
	var helper,send;
	AqiService.isStart = false;
	AqiService.start = function(viewer){
		if(AqiService.isStart == true){
			return ;
		}
		AqiService.isStart = true;
		var currentRectangle = null;
		var bWorking = false;
		var imgData = draw();
		var clock = viewer.cesiumWidget.clock;
		var startTimestamp,endTimestamp ;
		var timeout = 1000;
        var circleTable = [];
        viewer.scene.globe.depthTestAgainstTerrain = false;
        viewer.scene.camera.flyTo({
    		destination : Cesium.Cartesian3.fromDegrees(116.46, 39.92, 6378137/20),
    		duration : 0.1
    	}); 
        if (navigator.geolocation)
		{
        	navigator.geolocation.getCurrentPosition(function(position){
        		viewer.scene.camera.flyTo({
        			destination : Cesium.Cartesian3.fromDegrees(position.coords.longitude, position.coords.latitude, 6378137/20)
        		}); 
        	});
		}
		function tick() {
			viewer.scene.globe.depthTestAgainstTerrain = false;
			endTimestamp = (new Date).getTime();
			if(bWorking == false)
			{
				var localRectangle = viewer.camera.computeViewRectangle();
				if(!localRectangle.equals(currentRectangle))
				{
					var bounds = localRectangle.south * 180.0 / Math.PI + "," 
								+ localRectangle.west * 180.0 / Math.PI + "," 
								+ localRectangle.north * 180.0 / Math.PI + "," 
								+ localRectangle.east * 180.0 / Math.PI;

					function startWorker(strBounds)
					{
						startTimestamp = endTimestamp = (new Date).getTime();
						send = new Worker("./js/lib/pmworkers.js");
						var obj = {bounds:strBounds,imgData:imgData.data};
						send.postMessage(obj);
						bWorking = true;
						send.onmessage = function (event) {
							var currentData = event.data.entityTable;
							var currentDate = event.data.date;
							if(currentData.length != 0 && currentDate>startTimestamp){
								viewer.entities.removeAll();
								for (var i = currentData.length - 1; i >= 0; i--) {
									var color = new Cesium.Color(currentData[i].color.red,currentData[i].color.green,currentData[i].color.blue,0.1);
									var imgCircle = circleTable[currentData[i].aqiValue];
									if(imgCircle == null){								
										var circleCanvas = document.createElement('canvas');
										var pixelRadius = 13;
										circleCanvas.width = pixelRadius * 2;
										circleCanvas.height = pixelRadius * 2;
										var circleCtx = circleCanvas.getContext('2d');
										circleCtx.fillStyle = "#ffffff00";
										circleCtx.globalAlpha = 0.0;
										circleCtx.fillRect(0, 0, pixelRadius*2, pixelRadius*2);
										var r = imgData.data[currentData[i].aqiValue*4];
										var g = imgData.data[currentData[i].aqiValue*4+1];
										var b = imgData.data[currentData[i].aqiValue*4+2];
										circleCtx.globalAlpha = 1.0;
										circleCtx.beginPath();
										circleCtx.arc(pixelRadius, pixelRadius, pixelRadius, 0, Math.PI * 2, true);
										circleCtx.closePath();
										var strColor = 'rgb('+r+','+g+','+b+')';
										circleCtx.fillStyle = strColor;
										circleCtx.fill();
										imgCircle = circleTable[currentData[i].aqiValue] = circleCanvas;
									}
									viewer.entities.add({
										position : Cesium.Cartesian3.fromDegrees(currentData[i].lon, currentData[i].lat),
										billboard : {
											image : imgCircle.toDataURL(), // default: undefined
											show : true										
										},
										name:currentData[i].name,
										description:currentData[i].description
									});
								}						
								currentRectangle = localRectangle;
							}
							bWorking = false;
							send.terminate();
						};
					}
					startWorker(bounds);
				}
			}
			else if(endTimestamp - startTimestamp>timeout){
				bWorking = false;
				timeout += 1000;
				send.terminate();
			}
		}
		helper = new Cesium.EventHelper();
		helper.add(clock.onTick,tick);
	};
	AqiService.remove = function(viewer){
		helper.removeAll();
		send.terminate();
		viewer.entities.removeAll();
		viewer.scene.globe.depthTestAgainstTerrain = true;
		AqiService.isStart = false;
	};
	function draw() {
		var canvas = document.createElement('canvas');
		canvas.width = 500;
		canvas.height = 500;
		var ctx = canvas.getContext('2d');
		ctx.beginPath();
		/* 指定渐变区域 */
		var grad = ctx.createLinearGradient(0,0, 500,0);
		/* 指定几个颜色 */
		grad.addColorStop(0.05,'rgb(0, 228, 0)'); // green
		grad.addColorStop(0.15,'rgb(256, 256, 0)'); // yellow
		grad.addColorStop(0.25,'rgb(256, 126, 0)'); // orange
		grad.addColorStop(0.35,'rgb(256, 0, 0)'); // red
		grad.addColorStop(0.5,'rgb(153, 0, 76)'); // purple
		grad.addColorStop(0.8,'rgb(126, 0, 35)'); // maroon
		/* 将这个渐变设置为fillStyle */
		ctx.fillStyle = grad; 
		/* 绘制矩形 */
		ctx.rect(0,0, 500,500);
		ctx.fill();
		// ctx.fillRect(0,0, 140,140);
		return ctx.getImageData(0,0,500,1);
	}
	return AqiService;
});