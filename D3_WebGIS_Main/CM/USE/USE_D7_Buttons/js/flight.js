
	var flightArray = [];

        var xian=0;
        var scene = viewer.scene;
        var ellipsoid = scene.globe.ellipsoid;
            
        var ssq;
        var fei;
        var zanti=0;
        //调用飞行方法
        function huaxian(num){
        	operation = 1;
            xian=1;
            //开始画线
            if(num==1){
               addPolyline12(1);
            }
            //开始漫游
            if(num==2){
                var ss=[];
                var gaodu=document.getElementById("gaodu").value;
                if(gaodu==""){
                    gaodu="0";
                }
                for(var i=0;i<flightArray.length;i++){
                    var qihe = flightArray[i];
                    for(var j=0;j<qihe.length;j++){                        
                        if(j==2){
                        	var height = qihe[j]+parseInt(gaodu);
                        	ss.push(height);
                        }else{
                        	ss.push(qihe[j]);
                        }
                    };                    
                }
                clearAllPan();
                ssq = highLine(array);
               	if(flight==1){
	        		flight = 0;  
	        		flightArray = [];
	        	}                
                xian=0;
                fei=CeMaddmoveModal11(ssq,"111");
                viewer.trackedEntity=fei;
                scene.screenSpaceCameraController.enableRotate = false;
                scene.screenSpaceCameraController.enableZoom = false;
                huaxian(1);
            }
            //清除漫游的线
            if(num==3){
                xian=0;
                viewer.entities.remove(ssq);
            }
            //结束漫游并清空线
            if(num==4){
            	operation = 0;
                xian=0;
                viewer.entities.remove(ssq);
                CeMremove3Dentity(fei);
                scene.screenSpaceCameraController.enableRotate = true;
                scene.screenSpaceCameraController.enableZoom = true;
                viewer.trackedEntity=null;
            }
            //取消跟随
            if(num==5){
                scene.screenSpaceCameraController.enableRotate = true;
                scene.screenSpaceCameraController.enableZoom = true;
            }
            //暂停或继续
            if(num==6){
                if(zanti==0){
                    viewer._clockViewModel.shouldAnimate = false;
                    zanti=1;
                }else{
                    viewer._clockViewModel.shouldAnimate = true;
                    zanti=0;
                }
            }
        }


        viewer.zoomTo(viewer.entities);
        
        
        //画高度线
        function highLine(array){
        	var highLine = viewer.entities.add({
                polyline : {
                    positions : Cesium.Cartesian3.fromDegreesArrayHeights(ss),
                    width : 5,
                    material : new Cesium.PolylineOutlineMaterialProperty({
                        color : Cesium.Color.RED,
                        outlineWidth : 2,
                        outlineColor : Cesium.Color.BLACK
                    })
                }
            });
            return highLine;
        }
        //飞行方法
        function CeMaddmoveModal11(lineT,id){
            //将随机数种子设置为一致的结果。
            Cesium.Math.setRandomNumberSeed(3);
            var positionsValue = lineT._polyline._positions._value;
            //设置模拟时间的边界
            var start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16));
            var stop = Cesium.JulianDate.addSeconds(start, positionsValue.length, new Cesium.JulianDate());
            //alert(stop);
            //确保查看器处于所需的时间。.
            viewer.clock.startTime = start.clone();
            viewer.clock.stopTime = stop.clone();
            viewer.clock.currentTime = start.clone();
            viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
            //飞行速度
            viewer.clock.multiplier = 0.1;
            var property = new Cesium.SampledPositionProperty();
            for (var i = 0; i < positionsValue.length; i++) {
                var time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
                property.addSample(time, positionsValue[i]);
            }
            var position = property;   
            var entityflay = viewer.entities.add({
                id : id,
                //将实体可用性设置为与模拟时间相同的间隔。
                availability : new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
                    start : start,
                    stop : stop
                })]),
                position : position,
                //基于位置移动的自动计算定位。
                orientation : new Cesium.VelocityOrientationProperty(position),               
                model : {
                    uri : 'models/CesiumAir/CesiumDrone.gltf',
                    minimumPixelSize : 64
                }
            });
            setTimeout(function(){
                viewer.trackedEntity=entityflay;
            },1000);
            return entityflay;
        }