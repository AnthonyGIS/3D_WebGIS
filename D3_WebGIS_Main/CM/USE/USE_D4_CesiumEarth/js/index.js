if(navigator.systemLanguage ? navigator.systemLanguage : navigator.language == 'zh-CN'){
	require(['resource/resourceCN'],function(ResourceCN){
		window.Resource = ResourceCN;
		require(['common'],function(){
			require(["Cesium","Zlib"], function(Cesium,Zlib){
				init(Cesium,Zlib);
			});
		});
	});
}
else{
	require(['./resource/resourceEN'],function(ResourceEN){
		window.Resource = ResourceEN;
		require(['common'],function(){
			require(["Cesium","Zlib"], function(Cesium,Zlib){
				init(Cesium,Zlib);
			});
		});
	});
}
function init(Cesium,Zlib){
	function getDescription(feature){
		var simpleStyleIdentifiers = [Resource.name,Resource.address];
        var html = '';
        for ( var key in feature) {
            if (feature.hasOwnProperty(key)) {
                if (simpleStyleIdentifiers.indexOf(key) == -1) {
                    continue;
                }
                var value = feature[key];
                if (value !== '') {
                    html += '<tr><td>' + key + '</td><td>' + value + '</td></tr>';
                }
            }
        }
        if (html.length > 0) {
            html = '<table class="zebra"><tbody>' + html + '</tbody></table>';
        }
        return html;
	}
	var options = {
			geocoder : true
	};
	var isPCBroswer = Cesium.FeatureDetection.isPCBroswer();
	var viewer;
	if(isPCBroswer){
		viewer = new Cesium.Viewer('cesiumContainer',{
			geocoder : true
		});
	}
	else{
		viewer = new Cesium.Viewer('cesiumContainer',{
			geocoder : true
		});
		var scene = viewer.scene;
		if(Cesium.defined(scene.sun)) {
			scene.sun.show = false;
		}
		if(Cesium.defined(scene.moon)) {
			scene.moon.show = false;
		}
//		if(Cesium.defined(scene.skyAtmosphere)) {
//			scene.skyAtmosphere.show = false;
//		}
		if(Cesium.defined(scene.skyBox)) {
			scene.skyBox.show = false;
		}
		document.documentElement.style.height = window.innerHeight + 'px';
		
		document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	}
	
	if(viewer.geocoder){
		viewer.geocoder.viewModel.geoKey = 'NGyNBR7nqy1edmqO6NpnIECG';
	}
	viewer.scene.globe.depthTestAgainstTerrain = true;
	viewer.scene.globe.enableLighting = true;

	viewer.cesiumWidget.creditContainer.style.display = "none"; //去cesium logo水印 

	//圆球mode
	//Cesium.Ellipsoid.WGS84 = Cesium.freezeObject(new Cesium.Ellipsoid(6378137.0, 6378137.0, 6378137.0));
	//if(!window.isLogin){
	//	viewer.camera.setView({
	//		destination: new Cesium.Cartesian3(6788287.844465209,-41980756.10214644,29619220.04004376)
	//    });
	//	viewer.camera.flyTo({
	//		destination : new Cesium.Cartesian3(-5668622.32641487,21155586.53109959,12644793.325518927),
	//        duration: 5
	//    });
    //}
	viewer.pickEvent.addEventListener(function(feature){
        var name = feature[Resource.name];
        var des = getDescription(feature);
        viewer.selectedEntity = new Cesium.Entity({
            name : name,
            description : des
        });
    });
	require(['jquery'],function($){
		$('#myActTitle').text(Resource.account);
		$('#myMsgTitle').text(Resource.myMsg);
		$('#saveTitle').text(Resource.save);
		$('#uploadDataTitle').text(Resource.uploadData);
		$('#exitTitle').text(Resource.exit);
		if(!isPCBroswer){
			var supportsOrientationChange = "onorientationchange" in window,
		    orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
			window.addEventListener(orientationEvent, function() {
				$("html").css("width", window.innerWidth);
				$("html").css("height", window.innerHeight);
				$("#cesiumContainer").css("width", window.innerWidth);
				$("#cesiumContainer").css("height", window.innerHeight);
			}, false);
		}
		$("#loadOverlay").hide();
		$('#loadbar').removeClass('ins');
		Window.LOADING_FLAG = false;
 
        require(['Tabs','dropdown','./views/ToolBar','./tools/Position','./views/ViewerContainer','./models/SceneModel','./views/ErrorPannel','./views/Compass','./views/GeoLocation','./views/AqiQuery'],
        		function(Tabs,dropdown,ToolBar,Position,ViewerContainer,SceneModel,ErrorPannel,Compass,GeoLocation,AqiQuery){
        	var sceneModel = new SceneModel(viewer);
            var viewerContainer = new ViewerContainer();
            var toolBar = new ToolBar({
                sceneModel : sceneModel,
                isPCBroswer : isPCBroswer
            });
            viewerContainer.addComponent(toolBar, new Position());
            if(!isPCBroswer){
            	$('#addMarkerBtn').hide();
            	$('#measureBtn').hide();
            }
        
            var errorPannel = new ErrorPannel();
            viewerContainer.addComponent(errorPannel);
            var compassContainer = new Compass({
            	sceneModel : sceneModel
            });
            viewerContainer.addComponent(compassContainer);
            var locationContainer = new GeoLocation({
				sceneModel : sceneModel
			});
			viewerContainer.addComponent(locationContainer,new Position({
				mode : 'rt',
				x : '10px',
				y : '50px'
			}));
			var pmContainer = new AqiQuery({
				sceneModel : sceneModel
			});
			viewerContainer.addComponent(pmContainer,new Position({
				mode : 'rt',
				x : '10px',
				y : '150px'
			}));
            
	        $('#save').on('click',function(evt){
				if(sceneModel){
					sceneModel.save();
				}
				evt.stopPropagation();
				return false;
	        });
	       
	  


        });
	});
}