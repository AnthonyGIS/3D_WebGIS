/**
 cesium length and area measure

 @author Cheetah
 @date 2021-02-19 11:31


 实现思路（以距离测量为例）：
 1、点击按钮开始测量，侦听鼠标LEFT_CLICK事件，记录坐标，绘制节点和折线；
 2、侦听鼠标移动事件，鼠标点击后即复制一个浮动点，在MOUSE_MOVE事件中不断更新最后一个浮动点，动态更新折线绘制；
 3、侦听鼠标右击事件，RIGHT_CLICK触发时销毁测量相关事件句柄（ScreenSpaceEventHandler），删除多余的浮动点；
 4、折线的动态绘制通过CallbackProperty属性绑定positions属性实现。


 Usage:
 // html
 <div style="position:absolute;width: 350px;height: 30px; top: 25px; left: 10px;">
 <div id="measure"> </div>
 </div>

 //创建测量工具
 new MeasureTool({
    viewer: viewer,
    target: 'measure'
})

 REF
 https://www.cnblogs.com/HandyLi/p/11125326.html
 https://www.jianshu.com/p/4a97d3ed4a06
 https://www.runoob.com/css3/css3-buttons.html
 https://blog.csdn.net/qq_26941173/article/details/78752648
 */



/*
 params:
      viewer:required,三维视图
      target:required,测量工具放置的div的id
 */
var MeasureTool = (function() {

    // 初始化界面
    // ---------------------------------------------------------------------------
    function _(option) {
        this.viewer = option.viewer;
        this.dom = document.getElementById(option.target);
        this.options = option;

        var me = this;
        me._addBtnStyle();
        var btnDistance = document.createElement('button');
        btnDistance.innerHTML = '测量距离';
        btnDistance.setAttribute("class", "measure_btn");
        //btnDistance.style.cssText = "width: 100px;";
        btnDistance.onclick = function() {
            if(me.bMeasuring)
                return;

            me.bMeasuring = true;
            me._measureLineSpace();
        };
        this.dom.appendChild(btnDistance);

        var btnArea = document.createElement('button');
        btnArea.innerHTML = '测量面积';
        btnArea.setAttribute("class", "measure_btn");
        btnArea.onclick = function() {
            if(me.bMeasuring)
                return;

            me.bMeasuring = true;
            me._measureAreaSpace();
        };
        this.dom.appendChild(btnArea);

        var btnClear = document.createElement('button');
        btnClear.innerHTML = '清除结果';
        btnClear.setAttribute("class", "measure_btn");
        btnClear.onclick = function() {
            //删除事先记录的id
            for(var jj = 0; jj < me.measureIds.length; jj++) {
                me.viewer.entities.removeById(me.measureIds[jj]);
            }
            me.measureIds.length = 0;
        };
        this.dom.appendChild(btnClear);

        this.bMeasuring = false;
        this.measureIds = [];
    }

    _.prototype._addBtnStyle=function (){
        // add css class dynamic. 21.2.19
        var style = document.getElementsByTagName("style");
        if (style.length === 0) {
            style = document.createElement("style");
            // style.type = "text/css";
            document.getElementsByTagName('head')[0].appendChild(style);
        }
        else
        {
            style = style[0];
        }

        try{
            style.appendChild(document.createTextNode(".measure_btn{" +
                "width: 80px; padding:3px; margin: 2px; background-color: #428bca99; color: #ff08; border:none;" +
                "outline:none; -moz-border-radius: 5px; -webkit-border-radius: 5px; border-radius: 5px;-khtml-border-radius: 5px;" +
                "text-align: center;vertical-align: middle; font-weight:200;font-size:50%" +
                "-webkit-transition-duration: 0.4s;transition-duration: 0.4s;}" +   // hover切换的动画
                ":focus {outline:none;} /*for IE*/" +  // outline none
                "::-moz-focus-inner {border-color: transparent;} /*for mozilla*/" +  // outline none for ie and mozilla
                ".measure_btn:hover{background-color: #428bcaff; color: #fff;}"));
        }catch(ex){
            //style.styleSheet.cssText = "body{background-color:red}";//针对IE
            console.log('can not add defined btn css class.')
        }

        return style;
    }

    _.prototype._addStylesheetRules = function(decls) {
        /**
         * Add a stylesheet rule to the document (may be better practice, however,
         * to dynamically change classes, so style information can be kept in
         * genuine stylesheets (and avoid adding extra elements to the DOM))
         * Note that an array is needed for declarations and rules since ECMAScript does
         * not afford a predictable object iteration order and since CSS is
         * order-dependent (i.e., it is cascading); those without need of
         * cascading rules could build a more accessor-friendly object-based API.
         * @param {Array} decls Accepts an array of JSON-encoded declarations
         * @example
         addStylesheetRules([
         ['h2', // Also accepts a second argument as an array of arrays instead
         ['color', 'red'],
         ['background-color', 'green', true] // 'true' for !important rules
         ],
         ['.myClass',
         ['background-color', 'yellow']
         ]
         ]);

         REF
         https://www.jb51.net/article/35180.htm
         */

        //var style = document.createElement('style');
        //document.getElementsByTagName('head')[0].appendChild(style);
        var style = document.getElementsByTagName("style");
        if (style.length === 0) {
            style = document.createElement("style");
            document.getElementsByTagName('head')[0].appendChild(style);
        }
        else
        {
            style = style[0];
        }

        if (!window.createPopup) { /* For Safari */
            style.appendChild(document.createTextNode(''));
        }
        var s = document.styleSheets[document.styleSheets.length - 1];
        for (var i=0, dl = decls.length; i < dl; i++) {
            var j = 1, decl = decls[i], selector = decl[0], rulesStr = '';
            if (Object.prototype.toString.call(decl[1][0]) === '[object Array]') {
                decl = decl[1];
                j = 0;
            }
            for (var rl=decl.length; j < rl; j++) {
                var rule = decl[j];
                rulesStr += rule[0] + ':' + rule[1] + (rule[2] ? ' !important' : '') + ';\n';
            }
            if (s.insertRule) {
                s.insertRule(selector + '{' + rulesStr + '}', s.cssRules.length);
            }
            else { /* IE */
                s.addRule(selector, rulesStr, -1);
            }
        }
    }


    // 内部测量距离函数
    // ---------------------------------------------------------------------------
    _.prototype._finishMeasure = function() {
        this.bMeasuring = false;
    }

    _.prototype._measureLineSpace = function() {
        var me = this;
        var viewer = this.viewer;
        // 取消双击事件-追踪该位置
        viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection);
        var positions = [];
        var poly = null;
        var distance = 0;
        var cartesian = null;
        var floatingPoint;
        var labelPt;


        function getTerrainDistance(point1cartographic, point2cartographic) {
            var geodesic = new Cesium.EllipsoidGeodesic();
            geodesic.setEndPoints(point1cartographic, point2cartographic);
            var s = geodesic.surfaceDistance;
            var cartoPts = [point1cartographic];
            for(var jj = 1000; jj < s; jj += 1000) {　　//分段采样计算距离
                var cartoPt = geodesic.interpolateUsingSurfaceDistance(jj);
                //                console.log(cartoPt);
                cartoPts.push(cartoPt);
            }
            cartoPts.push(point2cartographic);
            //返回两点之间的距离
            var promise = Cesium.sampleTerrain(viewer.terrainProvider, 8, cartoPts);
            Cesium.when(promise, function(updatedPositions) {
                // positions height have been updated.
                // updatedPositions is just a reference to positions.
                for(var jj = 0; jj < updatedPositions.length - 1; jj++) {
                    var geoD = new Cesium.EllipsoidGeodesic();
                    geoD.setEndPoints(updatedPositions[jj], updatedPositions[jj + 1]);
                    var innerS = geoD.surfaceDistance;
                    innerS = Math.sqrt(Math.pow(innerS, 2) + Math.pow(updatedPositions[jj + 1].height - updatedPositions[jj].height, 2));
                    distance += innerS;
                }

                //在三维场景中添加Label
                var textDistance = distance.toFixed(2) + "米";
                if(distance > 10000)
                    textDistance = (distance / 1000.0).toFixed(2) + "千米";
                floatingPoint = viewer.entities.add({
                    name: '贴地距离',
                    position: labelPt,
                    point: {
                        pixelSize: 5,
                        color: Cesium.Color.RED,
                        outlineColor: Cesium.Color.WHITE,
                        outlineWidth: 2,
                    },
                    label: {
                        text: textDistance,
                        font: '18px sans-serif',
                        fillColor: Cesium.Color.GOLD,
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        outlineWidth: 1,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(20, -20),
                    }
                });
                me.measureIds.push(floatingPoint.id);
            });
        }

        //空间两点距离计算函数
        function getSpaceDistance(positions) {
            //只计算最后一截，与前面累加
            //因move和鼠标左击事件，最后两个点坐标重复
            var i = positions.length - 3;
            var point1cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
            var point2cartographic = Cesium.Cartographic.fromCartesian(positions[i + 1]);
            getTerrainDistance(point1cartographic, point2cartographic);
        }

        var PolyLinePrimitive = (function() {
            function _(positions) {
                this.options = {
                    name: '直线',
                    polyline: {
                        show: true,
                        positions: [],
                        material: Cesium.Color.CHARTREUSE,
                        width: 3,
                        clampToGround: true
                    }
                };
                this.positions = positions;
                this._init();
            }

            _.prototype._init = function() {
                var _self = this;
                var _update = function() {
                    return _self.positions;
                };
                //实时更新polyline.positions
                this.options.polyline.positions = new Cesium.CallbackProperty(_update, false);
                var addedEntity = viewer.entities.add(this.options);
                me.measureIds.push(addedEntity.id);
            };

            return _;
        })();

        handler.setInputAction(function(movement) {
            let ray = viewer.camera.getPickRay(movement.endPosition);
            cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            if(!Cesium.defined(cartesian)) //跳出地球时异常
                return;
            if(positions.length >= 1) {
                if(!Cesium.defined(poly)) {
                    positions.push(cartesian);
                    poly = new PolyLinePrimitive(positions);
                } else {
                    positions.pop();
                    positions.push(cartesian);
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function(movement) {
            let ray = viewer.camera.getPickRay(movement.position);
            cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            if(!Cesium.defined(cartesian)) //跳出地球时异常
                return;

            if(positions.length === 0) {
                positions.push(cartesian.clone());
            }
            positions.push(cartesian);
            //记录鼠标单击时的节点位置，异步计算贴地距离
            labelPt = positions[positions.length - 1];
            if(positions.length > 2) {
                getSpaceDistance(positions);
            } else if(positions.length === 2) {
                //在三维场景中添加Label
                floatingPoint = viewer.entities.add({
                    name: '空间距离',
                    position: labelPt,
                    point: {
                        pixelSize: 3,
                        color: Cesium.Color.RED,
                        outlineColor: Cesium.Color.WHITE,
                        outlineWidth: 1,
                    }
                });
                me.measureIds.push(floatingPoint.id);
            }

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction(function() {
            handler.destroy(); //关闭事件句柄
            handler = undefined;
            positions.pop(); //最后一个点无效
            if(positions.length === 1)
                viewer.entities.remove(floatingPoint);
            //记录测量工具状态
            me._finishMeasure();

        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }


    //内部测量面积函数
    // ---------------------------------------------------------------------------
    _.prototype._measureAreaSpace = function() {
        var me = this;
        var viewer = this.viewer;
        // 取消双击事件-追踪该位置
        viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        // 鼠标事件
        var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection);
        var tmp_positions = [];
        var pgPointsPicked = [];
        var polygon = null;
        // var tooltip = document.getElementById("toolTip");
        var cartesian = null;
        var floatingPoint;//浮动点
        // tooltip.style.display = "block";
        var radiansPerDegree = Math.PI / 180.0;//角度转化为弧度(rad)
        var degreesPerRadian = 180.0 / Math.PI;//弧度转化为角度


        var PolygonPrimitive = (function() {
            function _(positions) {
                this.options = {
                    name: '多边形',
                    polygon: {
                        hierarchy: [],
                        // perPositionHeight : true,
                        material: Cesium.Color.GREEN.withAlpha(0.5),
                        // heightReference:20000
                    }
                };

                this.hierarchy = {positions};
                this._init();
            }

            _.prototype._init = function () {
                var _self = this;
                var _update = function () {
                    return _self.hierarchy;
                };
                //实时更新polygon.hierarchy
                this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update, false);
                var addedEntity = viewer.entities.add(this.options);
                me.measureIds.push(addedEntity.id);
            };

            return _;
        })();

        handler.setInputAction(function(movement){

            let ray = viewer.camera.getPickRay(movement.endPosition);
            cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            //cartesian = viewer.scene.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
            if(tmp_positions.length >= 2){
                if (!Cesium.defined(polygon)) {
                    tmp_positions.push(cartesian);
                    polygon = new PolygonPrimitive(tmp_positions);
                }else{
                    tmp_positions.pop();
                    tmp_positions.push(cartesian);
                }
            }
        },Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function(movement){
            let ray = viewer.camera.getPickRay(movement.position);
            cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            // cartesian = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
            tmp_positions.push(cartesian);

            //在三维场景中添加点
            var cartographic = Cesium.Cartographic.fromCartesian(tmp_positions[tmp_positions.length - 1]);
            pgPointsPicked.push({
                lon: Cesium.Math.toDegrees(cartographic.longitude),
                lat: Cesium.Math.toDegrees(cartographic.latitude) ,
                hei:cartographic.height});

            addPointVertexLabel(viewer, tmp_positions[tmp_positions.length - 1]);
        },Cesium.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction(function(){
            handler.destroy();
            tmp_positions.pop();

            var textArea = getArea(pgPointsPicked) + "平方公里";
            var areaEntity = viewer.entities.add({
                name : '多边形面积',
                position : tmp_positions[tmp_positions.length - 2],
                // point : {
                //  pixelSize : 5,
                //  color : Cesium.Color.RED,
                //  outlineColor : Cesium.Color.WHITE,
                //  outlineWidth : 2,
                //  heightReference:Cesium.HeightReference.CLAMP_TO_GROUND
                // },
                label : {
                    text : textArea,
                    font : '18px sans-serif',
                    fillColor : Cesium.Color.GOLD,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineWidth : 2,
                    verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset : new Cesium.Cartesian2(20, -40),
                    heightReference:Cesium.HeightReference.CLAMP_TO_GROUND
                }
            });
            me.measureIds.push(areaEntity.id);

            //记录测量工具状态
            me._finishMeasure();

        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK );


        // 面节点标注
        function addPointVertexLabel(viewer, pt)
        {
            floatingPoint = viewer.entities.add({
                name : '多边形面积',
                position : pt,  // label location
                point : {
                    pixelSize : 5,
                    color : Cesium.Color.RED,
                    outlineColor : Cesium.Color.WHITE,
                    outlineWidth : 2,
                    heightReference:Cesium.HeightReference.CLAMP_TO_GROUND
                }
            });
            me.measureIds.push(floatingPoint.id);
        }

        // 长度
        function distance(point1,point2){
            var point1cartographic = Cesium.Cartographic.fromCartesian(point1);
            var point2cartographic = Cesium.Cartographic.fromCartesian(point2);
            /**根据经纬度计算出距离**/
            var geodesic = new Cesium.EllipsoidGeodesic();
            geodesic.setEndPoints(point1cartographic, point2cartographic);
            var s = geodesic.surfaceDistance;
            //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
            //返回两点之间的距离
            s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
            return s;
        }

        //计算多边形面积
        function getArea(points) {

            var res = 0;
            //拆分三角曲面

            for (var i = 0; i < points.length - 2; i++) {
                var j = (i + 1) % points.length;
                var k = (i + 2) % points.length;
                var totalAngle = Angle(points[i], points[j], points[k]);


                var dis_temp1 = distance(tmp_positions[i], tmp_positions[j]);
                var dis_temp2 = distance(tmp_positions[j], tmp_positions[k]);
                res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle)) ;
                console.log(res);
            }


            return (res/1000000.0).toFixed(4);
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
            var lat1 = from.lat * radiansPerDegree;
            var lon1 = from.lon * radiansPerDegree;
            var lat2 = to.lat * radiansPerDegree;
            var lon2 = to.lon * radiansPerDegree;
            var angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
            if (angle < 0) {
                angle += Math.PI * 2.0;
            }
            angle = angle * degreesPerRadian;//角度
            return angle;
        }
    }

    return _;
})();
