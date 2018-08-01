		
		 var actEntity;
        var c;

		function dianjiditu(pickedObject){	
           	 if (Cesium.defined(pickedObject) && (pickedObject.id != undefined)) {
                actEntity = pickedObject.id;
                var changedC = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, actEntity._position._value);

                positionPopUp(changedC);
                c=changedC;
                $('#trackPopUp').show();
                //console.log(changedC);
            } else {
                $('#trackPopUp').hide();
            }
		}		
		
		//实时判断地图是否拖动
		var removeHandler = viewer.scene.postRender.addEventListener(function () {
            if(actEntity!=null){
                var changedC = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, actEntity._position._value);
                // If things moved, move the popUp too
                if ((c.x !== changedC.x) || (c.y !== changedC.y)) {
                    c = changedC;
                }
                positionPopUp(c);
            }
        });
		//地图拖动时重新调整div的位置
        function positionPopUp (c) {
            var x = c.x - ($('#trackPopUpContent').width()) / 2;
            var y = c.y - ($('#trackPopUpContent').height());
            $('#trackPopUpContent').css('transform', 'translate3d(' + x + 'px, ' + y + 'px, 0)');
        }

     	//声明div
        var infoDiv = '<div id="trackPopUp" style="display:none;">'+
            '<div id="trackPopUpContent" class="leaflet-popup" style="top:11px;left:0;">'+
            '<a class="leaflet-popup-close-button" onclick="yincang()" > ×</a>'+
            '<div class="leaflet-popup-content-wrapper" style="overflow-y: hidden;width: 300px;">'+
            '<h4 id="trackPopUpLink" class="leaflet-popup-content" style="max-width: 300px;">Okhttp3中DiskLrcCache的使用</h4>'+
            '<div style="height: 110px;"><img style="width: 100%;height:100%;" src="img/p_big3.jpg"></div>'+
            '<div style="width:100%;overflow: hidden;"><div style="width:110%;overflow-y: auto;line-height: 1.80;font-weight: 700;font-size: 12px;">主要是okhttp3中缓存DiskLruCache类的使用完整例子，主要实现了写入、读取功能。</div></div>'+
            '</div>'+
            '<div class="leaflet-popup-tip-container">'+
            '<div class="leaflet-popup-tip"></div>'+
            '</div>'+
            '</div>'+
            '</div>';
		//创建div
        $("#map").append(infoDiv);

        $('.leaflet-popup-close-button').click(function(){
            $('#trackPopUp').hide();
        });
        function yincang(){
            $('#trackPopUp').hide();
        }
        function xianshi(){
        	 $('#trackPopUp').show();
        	 
        }