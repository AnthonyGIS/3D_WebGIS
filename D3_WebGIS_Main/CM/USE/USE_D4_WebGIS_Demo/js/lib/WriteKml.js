define(['Cesium'],function(Cesium){
	var WriteKml = function(){
		
	};
	WriteKml.write = function(entities){
	    var objs = [];
	    for(var m = 0,n = entities.length;m < n;m++){
	        objs.push(write(entities[m]));
	    }
	    var openNode = createNode('open','1');
	    var visibilityNode = createNode('visibility','1');
	    var nameNode = createNode('name','<![CDATA[test]]>');
	    var nodes = [openNode,visibilityNode,nameNode];
	    for(var i = 0,j = objs.length;i < j;i++){
	        var obj = objs[i];
	        nodes.push(obj['styleNode']);
	        nodes.push(obj['placeMarkNode']);
	    }
	    var documentNode = addNodes('Document',nodes);
	    var kmlNode = createXML(documentNode);
	    return kmlNode;
	}
	function createXML(content){
	    var head = '<?xml version="1.0" encoding="UTF-8"?>';
	    var nameSpace = '<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:atom="http://www.w3.org/2005/Atom">';
	    return [
	        head,
	        nameSpace,
	        content,
	        '</kml>'
	    ].join('\n');
	}
	function write(entity){
	    var styleNode,
	    	modelNode,
	        placeMarkNode,
	    	geometryNode;//暂时不支持
	    if(entity.billboard){
	        styleNode = createStyleNode(entity);
	        placeMarkNode = createPlaceMark(entity,modelNode);
	    }
	    else if(entity.model){
	        modelNode = createModelNode(entity);
	        placeMarkNode = createPlaceMark(entity,modelNode);
	    }
	    else{

	    }
	    return {
	        placeMarkNode : placeMarkNode,
	        styleNode : styleNode
	    };
	}
	function createStyleNode(entity){
	    var billboard = entity.billboard;
	    var styleNode;
	    if(billboard){
	        var img = billboard.image;
	        var hrefNode;
	        if(img){
	            var href = img._value;
	            var hrefNode = createNode('href',href);
	            var iconNode = addNode('Icon',hrefNode);
	            var scaleNode;
	            if(billboard.scale){
	                var scale = billboard.scale._value;
	                scaleNode = createNode('scale',scale);
	            }
	            else{
	                scaleNode = createNode('scale',1);
	            }
	            var pixelOffset = billboard.pixelOffset;
	            var hotSpotNode;
	            if(pixelOffset){
	                var x = pixelOffset._value.x;
	                x = -1*(x - billboard.width*0.5*scale);
	                var y = pixelOffset._value.y;
	                y = y + billboard.height*0.5*scale;
	                var obj = {
	                    x : x,
	                    y : y,
	                    xunits : 'pixels',
	                    yunits : 'pixels'
	                };
	                hotSpotNode = addOnlyAttrNode('hotSpot',obj);
	            }
	            var iconStyleNode = addNodes('IconStyle',[scaleNode,iconNode,hotSpotNode])
	            var path = entity.path;
	            var lineStyleNode;
	            if(path){
	                var color = path.material.color._value;
	                var width = path.width._value;
	                var colorNode = createNode('color',color);
	                var widthNode = createNode('width',width);
	                lineStyleNode = addNodes('LineStyle',[colorNode,widthNode]);
	            }
	            styleNode = addNodes('Style',[iconStyleNode,lineStyleNode],{
	                id : entity.id
	            });
	        }
	    }

	    return styleNode;
	}
	function createPlaceMark(entity,modelNode){
	    var position = entity.position;
	    var placeMarkNode;
	    var descriptionValue = '';
	    if(entity.description){
	        descriptionValue = entity.description.getValue();
	    }
	    var description = '<![CDATA[{description}]]>'.replace('{description}',descriptionValue);
	    var entityName = '<![CDATA[{name}]]>'.replace('{name}',entity.name);
	    if(modelNode){
	        var nameNode = createNode('name',entityName);
	        var descriptionNode = createNode('description',description);
	        placeMarkNode = addNodes('Placemark',[nameNode,descriptionNode,modelNode]);
	    }
	    else{
	        if(position instanceof Cesium.CompositePositionProperty){
	            var intervals = position.intervals;
	            if(intervals && intervals instanceof Cesium.TimeIntervalCollection){
	                var timeInterval = intervals._intervals[0];
	                if(timeInterval && timeInterval instanceof Cesium.TimeInterval){
	                    var data = timeInterval.data._value._property;
	                    var times = [];
	                    var values = data._values;
	                    var points = [];
	                    var len = data._times.length;
	                    var j = 0;
	                    var i = 0;
	                    while(j < len){
	                        points.push(new Cesium.Cartesian3(values[i],values[i+1],values[i+2]));
	                        var time = data._times[j];
	                        times[j] = Cesium.JulianDate.toIso8601(time);
	                        j++;
	                        i = i + 3;
	                    }
	                    var trackNodes = [];
	                    for(var i = 0,j = times.length;i < j;i++){
	                        var coord = Cesium.Cartographic.fromCartesian(points[i]);
	                        var lon = Cesium.Math.toDegrees(coord.longitude);
	                        var lat = Cesium.Math.toDegrees(coord.latitude);
	                        var height = coord.height
	                        var coordStr = lon + ' ' + lat + ' ' + height;
	                        var coordNode = createNode('gx:coord',coordStr);
	                        var whenNode = createNode('when',times[i]);
	                        trackNodes.push(whenNode);
	                        trackNodes.push(coordNode);
	                    }
	                    var trackNode = addNodes('gx:Track',trackNodes);
	                    var altitudeModeNode = createNode('altitudeMode','absolute');
	                    var interpolateNode = createNode('gx:interpolate','1');
	                    var multiTrackNode = addNodes('gx:MultiTrack',[altitudeModeNode,interpolateNode,trackNode]);
	                    var styleUrlNode = createNode('styleUrl','#' + entity.id);
	                    var descriptionNode = createNode('description',description);
	                    var nameNode = createNode('name',entityName);
	                    placeMarkNode = addNodes('Placemark',[nameNode,descriptionNode,styleUrlNode,multiTrackNode],{
	                        id : entity.id
	                    });
	                }
	            }
	        }
	        else if(position instanceof Cesium.SampledPositionProperty){
	            var data = position._property;
	            var times = [];
	            var values = data._values;
	            var points = [];
	            var len = data._times.length;
	            var j = 0;
	            var i = 0;
	            while(j < len){
	                points.push(new Cesium.Cartesian3(values[i],values[i+1],values[i+2]));
	                var time = data._times[j];
	                times[j] = Cesium.JulianDate.toIso8601(time);
	                j++;
	                i = i + 3;
	            }
	            var trackNodes = [];
	            for(var i = 0,j = times.length;i < j;i++){
	                var coord = Cesium.Cartographic.fromCartesian(points[i]);
	                var lon = Cesium.Math.toDegrees(coord.longitude);
	                var lat = Cesium.Math.toDegrees(coord.latitude);
	                var height = coord.height
	                var coordStr = lon + ' ' + lat + ' ' + height;
	                var coordNode = createNode('gx:coord',coordStr);
	                var whenNode = createNode('when',times[i]);
	                trackNodes.push(whenNode);
	                trackNodes.push(coordNode);
	            }
	            var trackNode = addNodes('gx:Track',trackNodes);
	            var altitudeModeNode = createNode('altitudeMode','absolute');
	            var interpolateNode = createNode('gx:interpolate','1');
	            var multiTrackNode = addNodes('gx:MultiTrack',[altitudeModeNode,interpolateNode,trackNode]);
	            var styleUrlNode = createNode('styleUrl','#' + entity.id);
	            var descriptionNode = createNode('description',description);
	            var nameNode = createNode('name',entityName);
	            placeMarkNode = addNodes('Placemark',[nameNode,descriptionNode,styleUrlNode,multiTrackNode],{
	                id : entity.id
	            });
	        }
	        else{
	            var point = position._value;
	            var coord = Cesium.Cartographic.fromCartesian(point);
	            var lon = Cesium.Math.toDegrees(coord.longitude);
	            var lat = Cesium.Math.toDegrees(coord.latitude);
	            var coordStr = lon + ',' + lat + ',' + coord.height;
	            var coordNode = createNode('coordinates',coordStr);
	            var pointNode = addNode('Point',coordNode);
	            var nameNode = createNode('name',entityName);
	            var descriptionNode = createNode('description',description);
	            var styleUrlNode = createNode('styleUrl','#' + entity.id);
	            var altitudeModeNode = createNode('altitudeMode','absolute');
	            placeMarkNode = addNodes('Placemark',[nameNode,descriptionNode,styleUrlNode,altitudeModeNode,pointNode]);
	        }
	    }

	    return placeMarkNode;

	}
	function addOnlyAttrNode(nodeName,attr){
	    var startTag = '<' + nodeName;
	    var result = [startTag];
	    for(var key in attr){
	        result.push(key + '=' + '\"' + attr[key] + '\"');
	    }
	    result.push('/>');
	    return result.join(' ');
	}
	function createNode(name,content){
	    var startTag = '<' + name + '>';
	    var endTag = '</' + name + '>';
	    return [
	        startTag,
	        content,
	        endTag
	    ].join('');
	}
	function addNodes(parent,children,attr){
	    var startTag = '<' + parent;
	    for(var key in attr){
	        startTag += (' ' + key + '=' + '\"' + attr[key] + '\"' + ' ');
	    }
	    startTag += '>';
	    var endTag = '</' + parent + '>';
	    var result = [];
	    result.push(startTag);
	    for(var i = 0,j = children.length;i < j;i++){
	        var child = children[i];
	        if(child){
	            result.push(child);
	        }
	    }
	    result.push(endTag);
	    return result.join('\n');
	}
	function addNode(parent,child){
	    var startTag = '<' + parent + '>';
	    var endTag = '</' + parent + '>';
	    return [
	        startTag,
	        child,
	        endTag
	    ].join('\n');
	}
	return WriteKml;
});