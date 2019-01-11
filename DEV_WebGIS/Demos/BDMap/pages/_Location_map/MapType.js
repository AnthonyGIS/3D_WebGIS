var tMapKey = { baidu: 'v22uaSd5zGqvQbBIAvnAM89LjcgYcdkd', gould: 'c193b7c51e579ad80ec35989db0d8898'};
var baiduMap = {
    show: function () {
        baiduMap.addBDLib();
    },
    addBDLib: function () {
        var script = document.createElement("script");
        script.src = "http://api.map.baidu.com/api?v=2.0&ak=" + tMapKey.baidu + "&callback=initialize";
        document.getElementsByTagName('head')[0].appendChild(script);
    },
    createMap: function (obj) {
        var map = new BMap.Map(obj);
        var point = new BMap.Point(116.404, 39.915);
        map.centerAndZoom(point, 15);
        map.enableScrollWheelZoom(true);

        // 地圖定位事件
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function (r) {
            if (this.getStatus() === BMAP_STATUS_SUCCESS) {
                var mk = new BMap.Marker(r.point);
                map.addOverlay(mk);
                map.panTo(r.point);
                var str = ['定位成功'];
                str.push('<div class="map_longitude" data-getLng="' + r.point.lng + '"> 经度：' + r.point.lng + '</div>');
                str.push('<div class="map_latitude" data-getLat="' + r.point.lat + '">纬度：' + r.point.lat + '</div>');
                document.getElementById('baiduTip').innerHTML = str.join(' ');
            }
            else {
                console.log('failed' + this.getStatus());
            }
        }, {enableHighAccuracy: true });


        // 地图上添加点击事件
        map.addEventListener('click', function () {
            var center = map.getCenter();
            document.querySelector('.editmap_map .map_longitude').innerHTML = '经度:' + center.lng;
            document.querySelector('.editmap_map .map_latitude').innerHTML = '经度:' + center.lat;
            document.querySelector('.editmap_map .map_longitude').setAttribute("data-getLng", '' + center.lng + '');
            document.querySelector('.editmap_map .map_latitude').setAttribute("data-getLat", '' + center.lat + '');
        });
        var ac = new BMap.Autocomplete({"input": "editmap_id", "location": map});
        ac.addEventListener("onhighlight", function (e) {
            var str = "";
            var _value = e.fromitem.value;
            var value = "";
            if (e.fromitem.index > -1) {
                value = _value.province + _value.city + _value.district + _value.street + _value.business;
            }
            str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
            value = "";
            if (e.toitem.index > -1) {
                _value = e.toitem.value;
                value = _value.province + _value.city + _value.district + _value.street + _value.business;
            }
            str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
            document.getElementById("searchResultPanel").innerHTML = str;
        });
        var myValue;
        ac.addEventListener("onconfirm", function (e) {
            var _value = e.item.value;
            myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
            document.getElementById("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
            setPlace();
        });

        // 去掉百度的logo
        // http://lbsyun.baidu.com/cms/jsapi/reference/jsapi_reference_3_0.html
        map.addEventListener('tilesloaded', hideLogo);//tilesloaded

        function hideLogo() {
            $(".BMap_cpyCtrl").hide();
            $(".anchorBL").hide();
        }


        function setPlace() {
            map.clearOverlays();

            function myFun() {
                var pp = local.getResults().getPoi(0).point;
                map.centerAndZoom(pp, 18);
                map.addOverlay(new BMap.Marker(pp));
            }

            var local = new BMap.LocalSearch(map, {onSearchComplete: myFun});
            local.search(myValue);
        }
    }
};


var gouldMap = {
    show: function () {
        gouldMap.addGDLib();
    },
    addGDLib: function () {
        var script = document.createElement("script");
        script.src = "http://webapi.amap.com/maps?v=1.4.0&key=" + tMapKey.gould + "&plugin=AMap.Autocomplete";
        document.getElementsByTagName('head')[0].appendChild(script);
    },
    createMap: function (obj) {
        var map = new AMap.Map(obj, {resizeEnable: true, zoom: 10, center: [116.480983, 40.0958]});
        map.plugin('AMap.Geolocation', function () {
            geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,
                timeout: 10000,
                buttonOffset: new AMap.Pixel(10, 20),
                zoomToAccuracy: true,
                buttonPosition: 'RB'
            });
            map.addControl(geolocation);
            geolocation.getCurrentPosition();
            console.log(onComplete);
            AMap.event.addListener(geolocation, 'complete', onComplete);
            AMap.event.addListener(geolocation, 'error', onError);
        });

        function onComplete(data) {
            var str = ['定位成功'];
            str.push('<div class="map_longitude" data-getLng="' + data.position.getLng() + '"> 经度：' + data.position.getLng() + '</div>');
            str.push('<div class="map_latitude"  data-getLat="' + data.position.getLat() + '">纬度：' + data.position.getLat() + '</div>');
            if (data.accuracy) {
                str.push('精度：' + data.accuracy + ' 米');
            }
            str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
            document.getElementById('tip').innerHTML = str.join(' ');
        }

        function onError(data) {
            document.getElementById('tip').innerHTML = '定位失败';
        }

        map.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], function () {
            var autoOptions = {city: "北京", input: "editmap_id"};
            autocomplete = new AMap.Autocomplete(autoOptions);
            var placeSearch = new AMap.PlaceSearch({city: '北京', map: map});
            AMap.event.addListener(autocomplete, "select", function (e) {
                placeSearch.search(e.poi.name)
            });
        });
        var _self = this;
        var clickEventListener = map.on('click', function (e) {
            document.querySelector('.map_longitude').innerHTML = '经度:' + e.lnglat.getLng();
            document.querySelector('.map_latitude').innerHTML = '纬度:' + e.lnglat.getLat();
            document.querySelector('.map_longitude').setAttribute("data-getLng", '' + e.lnglat.getLng() + '');
            document.querySelector('.map_latitude').setAttribute("data-getLat", '' + e.lnglat.getLat() + '');
        });
        var auto = new AMap.Autocomplete({input: "tipinput"});
        AMap.event.addListener(auto, "select", select);

        function select(e) {
            if (e.poi && e.poi.location) {
                map.setZoom(15);
                map.setCenter(e.poi.location);
            }
        }
    }
};



var returnMap = function (map) {
    if (map.show instanceof Function) {
        map.show();
    }

};