


(function (win) {
    function MapGrid(b, para) {
        this.dom = document.querySelector(b);
        this.init(this.dom, para);
    }

    MapGrid.prototype = {
        init: function (b, para) {
            mapPrive._init(b, para)
        }
    };

    var mapPrive = (function () {
        return {
            _html: function () {
                return '    <div class="editmap_header">' +
                    '		    <div class="editmap_title"></div>' +
                    '		    <input type="text" id="editmap_id" class="editmap_id" placeholder="请输入关键字,选定后搜索"/>	' +
                    '		    <div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"></div>' +
                    '       </div>' +
                    '       <div class="editmap_mapAll" id="editmap_mapAll">' +
                    ' 		    <div id="tip" style="display: none"></div>' +
                    '       </div>' +
                    '       <div id="baiduTip" style="display: none"></div>' +
                    '       <div class="editmMap_btnAll">' +
                    '		    <button class="editmMap_btnAll_ok" type="button">确认</button>' +
                    '		    <button class="editmMap_btnAll_close" type="button">取消</button>' +
                    '       </div>';
            },
            _init: function (b, para) {
                this.dom = b;
                this._data(para);
            },
            _data: function (para) {
                var params = {
                    type: para.type || gouldMap,
                    callback: para.callback || function () {
                    }
                };
                this._bind(params);
            },
            _bind: function (para) {
                var div_bom, div_ovel, self = this;

                // 输入框添加单击事件
                this.dom.addEventListener('click', function () {

                    div_bom = document.createElement('div');
                    div_bom.className = 'editmap_map';
                    div_ovel = document.createElement('div');
                    div_ovel.className = 'ovel';
                    document.body.appendChild(div_bom);
                    document.body.appendChild(div_ovel);

                    //var map_title = div_bom.querySelector('.editmap_title');
                    div_bom.innerHTML = self._html();
                    var mapOk = div_bom.querySelector('.editmMap_btnAll_ok'),
                        mapClose = div_bom.querySelector('.editmMap_btnAll_close');


                    // 显示浮动弹框，并处理弹窗内的事件交互
                    returnMap(para.type);
                    var _self = this;
                    // 高德
                    if (para.type === gouldMap) {
                        div_bom.querySelector('#tip').style = 'block';
                        setTimeout(function () {
                            gouldMap.createMap(div_bom.querySelector('#editmap_mapAll'));
                            mapOk.addEventListener('click', function () {
                                var lng = div_bom.querySelector('.map_longitude').getAttribute('data-getlng');
                                var lat = div_bom.querySelector('.map_latitude').getAttribute('data-getlat');
                                _self.setAttribute('data-value', lng + ',' + lat);
                                _self.value = lng + ',' + lat;
                                document.body.removeChild(div_ovel);
                                document.body.removeChild(div_bom);
                                $('.amap-sug-result').remove();
                                para.callback(lng, lat);
                            });
                        }, 500);
                    }
                    else {
                        // 百度
                        div_bom.querySelector('#baiduTip').style.display = 'block';
                        setTimeout(function () {
                            baiduMap.createMap(div_bom.querySelector('#editmap_mapAll'));
                            mapOk.addEventListener('click', function () {
                                var lng = div_bom.querySelector('.map_longitude').getAttribute('data-getlng');
                                var lat = div_bom.querySelector('.map_latitude').getAttribute('data-getlat');
                                _self.setAttribute('data-value', lng + ',' + lat);
                                _self.value = lng + ',' + lat;
                                document.body.removeChild(div_ovel);
                                document.body.removeChild(div_bom);
                                $('.amap-sug-result').remove();
                                para.callback(lng, lat);
                            });
                        }, 500);
                    }

                    mapClose.addEventListener('click', function () {
                        document.body.removeChild(div_ovel);
                        document.body.removeChild(div_bom);
                        $('.amap-sug-result').remove();
                    });
                    self._center(div_bom);
                    setTimeout(function () {
                        self._btnBInd(div_bom, self.dom);
                    }, 500);
                }, false);
            },
            _btnBInd: function (b, d) {
            },
            _center: function (b) {
                var win = ($(window).width() - $(b).width()) / 2;
                var hei = ($(window).height() - $(b).height()) / 2;
                $(b).css({left: win, top: hei});
                $(window).on('resize', function () {
                    var win = ($(window).width() - $(b).width()) / 2;
                    var hei = ($(window).height() - $(b).height()) / 2;
                    $(b).css({left: win, top: hei});
                });
            }
        }
    })();
    win.MapGrid = MapGrid;
}(window));