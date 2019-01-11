define(['backbone','Cesium','../Util','../Config'],function(Backbone,Cesium,Util,Config){
    var S3MLayerModel = Backbone.Model.extend({
        addLayer : function(sceneModel,isFlyMode){
        	var viewer = sceneModel.viewer;
            if(!this.viewer){
                this.viewer = viewer;
                this.sceneModel = sceneModel;
            }
            var me = this;
            var type = this.get('type');
            var scpUrl = this.get('url');
            var name = this.get('realName') || this.get('name');
            var defer = Cesium.when.defer();
            if(Util.S3M_CACHE[scpUrl]){
            	Util.showErrorMsg(Resource.layerExistMsg);
                return defer.reject();
            }
            var promise = viewer.scene.addS3MTilesLayerByScp(scpUrl,{
                name : name
            });
            return Cesium.when(promise,function(layer){
            	me.sceneModel.trigger('layerAdded',me);
                me.sceneModel.layers.add(me);
                me.layer = layer;
                if(isFlyMode){
                	me.flyTo();
                }
                Util.S3M_CACHE[scpUrl] = name;
                if(me.get('realName') == 'srsb'){
                	layer.setQueryParameter({
                        url: 'http://www.supermapol.com/iserver/services/data-srsb/rest/data',
                        dataSourceName: 'vector',
                        dataSetName: '房屋面',
                        keyWorld: 'SmID'
                    });
                }
                var attrQueryPars = me.attrQueryPars;
                if(Cesium.defined(attrQueryPars)){
                	layer.setQueryParameter(attrQueryPars);
                }
                if(me.get('isVisible') == false){
                	layer.visible = false;
                }
                return defer.resolve(layer);
            },function(err){
                Util.showErrorMsg(Resource.scpUrlErrorMsg);
                return defer.reject();
            });
        },
        removeLayer : function(viewer){
        	var name = this.get('realName');
        	var scpUrl = this.get('url');
        	if(Util.S3M_CACHE[scpUrl]){
        		Util.S3M_CACHE[scpUrl] = undefined;
        		delete Util.S3M_CACHE[scpUrl];
            }
        	viewer.scene.layers.remove(name);
        	this.sceneModel.layers.remove(this);
        },
        flyTo : function(){
        	var scpName = this.get('realName');
        	var cameraParam = Config.CAMERA_PARAM[scpName];
        	if(cameraParam){
        		this.viewer.scene.camera.flyTo({
            		destination : new Cesium.Cartesian3(cameraParam.Cartesian3.x,cameraParam.Cartesian3.y,cameraParam.Cartesian3.z),
            		orientation : {
            			heading : cameraParam.heading,
            			pitch : cameraParam.pitch,
            			roll : cameraParam.roll
            		}
            	});
        		return ;
        	}
            var layer = this.layer;
            if(this.get('realName') == "T8H_NoLod"){
            	this.viewer.scene.camera.flyTo({
            		destination : new Cesium.Cartesian3(-2627165.1432829266,3933035.5960504636,4264844.38928223),
            		orientation : {
            			heading : 0.6642083137167463,
            			pitch : -0.37902552808937795,
            			roll : 0.0022196324266055
            		}
            	});
            	return ;
            }
            if(layer){
            	var bounds = layer.layerBounds;
            	if(!bounds){
            		var extend = 0.1;
            		var left = Cesium.Math.toRadians(layer.lon - extend);
            		var right = Cesium.Math.toRadians(layer.lon + extend);
            		var top = Cesium.Math.toRadians(layer.lat + extend);
            		var bottom = Cesium.Math.toRadians(layer.lat - extend);
            		bounds = new Cesium.Rectangle(left,bottom,right,top);
            		layer.layerBounds = bounds;
            	}
            	var camera = this.viewer.scene.camera;
            	var bd = Cesium.BoundingSphere.fromRectangle3D(bounds);
            	camera.flyToBoundingSphere(bd);
            }
        },
        setVisible : function(isVisible){
            this.layer.visible = isVisible;
            this.set('isVisible',isVisible);
        },
        getJsonObj : function(){
        	var obj = {
            		displayName: this.get("name"),
            		isVisible: this.layer.getObjsVisible(-1),
            		classType: "OSGB",
            		sourceURI: this.get("url")
            	};
        	
        	return obj;
        }
    });
    return S3MLayerModel;
});