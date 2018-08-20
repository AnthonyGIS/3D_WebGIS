
// 动态原型方式
function CesiumCordinateDisplay(viewer) {

    /* // usage
      var displayPanel = new CesiumCordinateDisplay(viewer);
      displayPanel.AddStatusPanelHTML();
      displayPanel.InitialStatusPanel();
      displayPanel.SetMouseMoveEvent();
      Create by WENG LIU; V1.0 2018.4.18 11
      */

    this.viewer = viewer;
    this.canvas = viewer.scene.canvas;
    this.longitude_show = null;
    this.latitude_show = null;
    this.z_show = null;
    this.osgb_show = null;
    this.gltf_show = null;
    this.camera_show = null;
    this.status_panel_disp = null;

    // 动态原型方式是使用一个标志来判断是否已经给原型赋予了方法。这样可以保证该方法只创建一次
    if (typeof CesiumCordinateDisplay._initialized === "undefined") {

        CesiumCordinateDisplay.prototype.InitialStatusPanel = function () {
            this.longitude_show = document.getElementById('longitude_show');
            this.latitude_show = document.getElementById('latitude_show');
            this.z_show = document.getElementById('z_show');
            this.osgb_show = document.getElementById('osgb_show');
            this.gltf_show = document.getElementById('gltf_show');
            this.camera_show = document.getElementById('camera_show');
            this.status_panel_disp = document.getElementById('status_panel_disp');
        };
        CesiumCordinateDisplay.prototype.SetMouseMoveEvent = function () {

            //具体事件的实现
            var ray, position1, cartographic1, lng, lat, height, terrain_height, status_length_plus;

            var handler = new Cesium.ScreenSpaceEventHandler(this.canvas);
            handler.setInputAction(function (event) {

                status_length_plus = 0;
                ray = viewer.scene.camera.getPickRay(event.endPosition);
                position1 = viewer.scene.globe.pick(ray, viewer.scene);
                cartographic1 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position1);
                terrain_height = cartographic1.height;

                var feature = viewer.scene.pick(event.endPosition);
                if (feature === undefined) {
                    lng = Cesium.Math.toDegrees(cartographic1.longitude);
                    lat = Cesium.Math.toDegrees(cartographic1.latitude);
                }
                if (feature instanceof Cesium.Cesium3DTileFeature) {
                    var cartesian = viewer.scene.pickPosition(event.endPosition);
                    if (Cesium.defined(cartesian)) {
                        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                        lng = Cesium.Math.toDegrees(cartographic.longitude);
                        lat = Cesium.Math.toDegrees(cartographic.latitude);
                        height = cartographic.height;//模型高度 } }

                        osgb_show.innerText = 'osgb Z: ' + height.toFixed(2); // Terrain
                        this.status_length_plus += 1;
                    }
                }
                else {
                    this.osgb_show.innerText = "";
                }


                if (viewer.scene.mode === Cesium.SceneMode.MORPHING) {
                    var pickedObject = scene.pick(event.endPosition);
                    if (viewer.scene.pickPositionSupported && Cesium.defined(pickedObject) && pickedObject.node) {
                        cartesian = viewer.scene.pickPosition(event.endPosition);
                        if (Cesium.defined(cartesian)) {
                            cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                            lng = Cesium.Math.toDegrees(cartographic.longitude);
                            lat = Cesium.Math.toDegrees(cartographic.latitude);

                            height = cartographic.height;//模型高度
                            // mapPosition = {x: lng, y: lat, z: height};
                            // console.log('gltf模型表面的的高度（lng:' + lng + ',lat:' + lat + 'height:' + height);
                            status_length_plus += 1;
                            this.gltf_show.innerHTML = 'gltf Z: ' + height.toFixed(2);
                        }
                    }
                }
                else
                    this.gltf_show.innerText = "";


                this.longitude_show.innerHTML = lng.toFixed(8);
                this.latitude_show.innerHTML = lat.toFixed(8);
                this.z_show.innerText = 'Terrain Z: ' + terrain_height.toFixed(2); // Terrain

                this.camera_show.innerHTML = (this.viewer.camera.positionCartographic.height / 1000).toFixed(3);
                this.status_panel_disp.style.width = (500 + 130 * status_length_plus).toString() + 'px';


            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);//MOUSE_MOVE


        };
        CesiumCordinateDisplay._initialized = true;
    }

    if (typeof this.alertInfo !== "function") {
        console.log("这段代码只执行一次");
        CesiumCordinateDisplay.prototype.AddStatusPanelHTML = function () {
            // window.onload = function () {
                var div = document.createElement("div"); //设置 div 属性，如 id
                div.setAttribute("id", "status_panel_disp");
                div.style.cssText = "width:500px;height:30px;position:absolute;bottom:30px;right:100px;z-index:1;border-radius:6px; overflow-y: hidden;" +
                    "font-size:small;background-color:rgba(200,200,200,0.46); text-align:center;line-height: 30px;";
                div.innerHTML = " <span style=\"color: white; \">Lng: <span id=\"longitude_show\"></span></span>\n" +
                    "    <span style=\"color: white; \">Lat: <span id=\"latitude_show\"></span></span>\n" +
                    "    <!--Z-->\n" +
                    "    <span style=\"font-size: small; color: white; \">  <span id=\"z_show\"></span></span>\n" +
                    "    <!--osgb-->\n" +
                    "    <span style=\"font-size: small; color: white; \"> <span id=\"osgb_show\"></span></span>\n" +
                    "    <!--gltf-->\n" +
                    "    <span style=\"font-size: small; color: white; \"> <span id=\"gltf_show\"></span></span>\n" +
                    "    <span style=\"font-size: small; color: white; \">Camera Z:<span id=\"camera_show\"></span>km</span>";
                document.body.appendChild(div);

            // }
        }
    }
}