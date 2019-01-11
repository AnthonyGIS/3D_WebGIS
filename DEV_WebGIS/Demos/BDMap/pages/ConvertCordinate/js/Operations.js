
// 百度地图的一些操作函数
// 2017.9.29 1429


var Ary_count = 1000;//数组的最大值
var Ary_Marker = [];//标注对象数组
var Ary_MarkerUserd = [];//标记标注对象是否被使用（1表示被使用）
var Ary_PolyLine = [];//折线对象数组
var Ary_PolyLinecount = 100;//折线数组的最大值
var Ary_PolyLineUsed = [];//标记折线对象是否被使用（1表示被使用）
var Ary_PolyPoint = [];//折线点



function getCenter(map) {
    /// <summary>
    /// 返回地图的中心点的坐标
    /// </summary>

    var point1 = map.getCenter();
    var lvstr = point1.lat + ', ' + point1.lng;

    return lvstr;
}


function panTo(map, lat, lng) {
    /// <summary>
    /// 将地图的中心点更改为给定的点
    /// </summary>
    /// <param name="map" type="type"></param>
    /// <param name="lat" type="type"></param>
    /// <param name="lng" type="type"></param>

    map.panTo(new BMap.Point(lng, lat));
}


//设置缩放级别
function setZoom(map, zoom) {
    map.setZoom(zoom); //map.getZoom();
}

function zoomIn(map)//地图放大一级
{
    map.zoomIn();
}

function zoomOut(map)//地图缩小一级
{
    map.zoomOut();
}


function SetMinMaxZoom(min_zoom, max_zoom) {
    /// <summary>
    /// 设置地图缩放范围
    /// </summary>
    /// <param name="min_zoom" type="type"></param>
    /// <param name="max_zoom" type="type"></param>

    map.setMinZoom(min_zoom);
    map.setMaxZoom(max_zoom);
}


function enableDoubleClickZoom(enable)//启用或禁止地图双击缩放
{
    if (enable == 1) {
        map.enableDoubleClickZoom();
    }
    else {
        map.disableDoubleClickZoom();
    }
}

function enableScrollWheelZoom(enable)//启用或禁止滚轮缩放
{
    if (enable == 1) {
        map.enableScrollWheelZoom();
    }
    else {
        map.disableScrollWheelZoom();
    }
}














// 创建标注
// --------------------------------------------------------------------------------
function addMarker_lat_lng(map, lat, lng) {
    var k = -1;
    for (var i = 0; i < Ary_count; i++) {
        if (Ary_MarkerUserd[i] != 1) {
            Ary_MarkerUserd[i] = 1;
            k = i;
            break;
        }
    }
    if (k >= 0) {
        var point = new BMap.Point(lng, lat);
        Ary_Marker[i] = new BMap.Marker(point);
        var a = document.title;
        Ary_Marker[i].setTitle(a);
        map.addOverlay(Ary_Marker[i]);

        var label = new BMap.Label(a, { offset: new BMap.Size(25, -10) });
        Ary_Marker[i].setLabel(label);
        label.hide();

        document.body.title = i + '';
    } else {
        document.body.title = '-1';
    }
}

function marker_dblclick(e) {
    alert(e.point.lat);
}

function removeMarker(id) {
    /// <summary>
    /// 删除指定的标注
    /// </summary>
    /// <param name="id" type="type"></param>

    if (id >= 0 && id < Ary_count && Ary_MarkerUserd[id] == 1) {
        Ary_MarkerUserd[id] = 0;
        map.removeOverlay(Ary_Marker[id]);
    }
}

// 清除地图上所有覆盖物
function clearOverlays() {
    map.clearOverlays();
    for (var i = 0; i < Ary_count; i++) {
        if (Ary_MarkerUserd[i] == 1) {
            Ary_MarkerUserd[i] = 0;
        }
    }
    for (var i = 0; i < Ary_PolyLinecount; i++) {
        if (Ary_PolyLineUsed[i] == 1) {
            Ary_PolyLineUsed[i] = 0;
        }
    }
}


//移动指定的marker
function setPositionMarker(lat, lng, id) {
    if (id >= 0 && id < Ary_count && Ary_MarkerUserd[id] == 1) {
        var Point1 = new BMap.Point(lng, lat);
        Ary_Marker[id].setPosition(Point1);
    }
}

//获得指定marker的位置
function getPositionMarker(id) {
    if (id >= 0 && id < Ary_count && Ary_MarkerUserd[id] == 1) {
        var Point1 = Ary_Marker[id].getPosition();
        document.body.title = Point1.lat + '/' + Point1.lng;
    }
}

function getOffsetMarker(id)//获得标注的偏移值
{
    if (id >= 0 && id < Ary_count && Ary_MarkerUserd[id] == 1) {
        var Size1 = Ary_Marker[id].getOffset();
        document.body.title = Size1.width + '/' + Size1.height;
    }
}

function setOffsetMarker(widht, height, id)//设置标注偏移值
{
    if (id >= 0 && id < Ary_count && Ary_MarkerUserd[id] == 1) {
        var size1 = new BMap.Size(width, height);
        Ary_Marker[id].setOffset(size1);
    }
}

function EnableDragMarker(id, value)//设置单个标注是否可以拖动
{
    if (id >= 0 && id < Ary_count && Ary_MarkerUserd[id] == 1) {
        if (value == 0) {
            Ary_Marker[id].disableDragging();
        }
        else {
            Ary_Marker[id].enableDragging();
        }
    }

}

function EnableDragMarkerAll(value)//设置所有标注是否可以拖动
{
    for (var i = 0; i < Ary_count; i++) {
        if (Ary_MarkerUserd[i] == 1) {
            if (value == 0) {
                Ary_Marker[i].disableDragging();
            }
            else {
                Ary_Marker[i].enableDragging();
            }

        }
    }
}



function AnimationMarker(id, value)//设置标注跳动动画效果
{
    if (id >= 0 && id < Ary_count && Ary_MarkerUserd[id] == 1) {
        if (value == 0) {
            Ary_Marker[id].setAnimation(null);
        }
        else {
            Ary_Marker[id].setAnimation(BMAP_ANIMATION_BOUNCE);
        }
    }
}


function setIconMarker(id, widht, height)//设置标注的新图标(百度自带的图标位置是正确的)
{
    if (id >= 0 && id < Ary_count && Ary_MarkerUserd[id] == 1) {
        var Url = document.title;
        //alert(Url);
        var size = new BMap.Size(widht, height);
        var lvicon = new BMap.Icon(Url, size);
        var offset1 = new BMap.Size(0, height / 2 - height);
        Ary_Marker[id].setOffset(offset1);
        Ary_Marker[id].setIcon(lvicon);
    }
}

function setLabelOfMarker(id, isHide)//设置标注的文字标签是否隐藏
{
    if (id >= 0 && id < Ary_count && Ary_MarkerUserd[id] == 1) {
        var lable = Ary_Marker[id].getLabel();
        if (isHide == 0) {
            lable.show();
        } else {
            lable.hide();
        }
    }
}





// 有关坐标与变换
// --------------------------------------------------------------------------------

function pixelToPoint(x, y)//地图像素坐标转地图坐标
{
    var Point1 = map.pixelToPoint(new BMap.Pixel(x, y));
    var a = Point1.lat + '/' + Point1.lng;
    document.body.title = a;
}

function pointToPixel(lat, lng)//地图坐标转像素坐标
{
    var pix1 = map.pointToPixel(new BMap.Point(lng, lat));
    var a = pix1.x + '/' + pix1.y;
    document.body.title = a;
}

function getBounds()//获得地图矩形区域的坐标
{
    var bounds1 = map.getBounds();
    var sw = bounds1.getSouthWest();
    var ne = bounds1.getNorthEast();
    var lvstr = sw.lat + '/';
    lvstr = lvstr + sw.lng + '/' + ne.lat + '/' + ne.lng;
    document.body.title = lvstr;
}

function getSize()//获得地图区域的宽度和高度
{
    var size1 = map.getSize();
    var lvstr = size1.width + '/' + size1.height;
    document.body.title = lvstr;
}


function gpsToBaidu(lat, lng)//Gps坐标转百度
{
    var gpsPoint = new BMap.Point(lng, lat);
    BMap.Convertor.translate(gpsPoint, 0, translateCallback);
}

translateCallback = function (point) {
    var lvstr = point.lat + '/' + point.lng;
    document.body.title = lvstr;
};


function getDistance(lat1, lng1, lat2, lng2)//获得地图上两坐标点的距离（米
{
    var Point1 = new BMap.Point(lng1, lat1);
    var Point2 = new BMap.Point(lng2, lat2);
    var a1 = map.getDistance(Point1, Point2);
    document.body.title = a1 + '';
}




// 绘图
// --------------------------------------------------------------------------------
function addPolyLine_lat_lng(lat1, lng1, lat2, lng2)// 创建折线
{
    var k = -1;
    //var name;
    for (var i = 0; i < Ary_PolyLinecount; i++) {
        if (Ary_PolyLineUsed[i] != 1) {
            Ary_PolyLineUsed[i] = 1;
            k = i;
            break;
        }
    }
    if (k >= 0) {
        var point1 = new BMap.Point(lng1, lat1);
        var point2 = new BMap.Point(lng2, lat2);
        Ary_PolyPoint[i][0] = point1;
        Ary_PolyPoint[i][1] = point2;
        Ary_PolyLine[i] = new BMap.Polyline(Ary_PolyPoint[i], { enableClicking: false, strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5 });
        map.addOverlay(Ary_PolyLine[i]);
        document.body.title = i + '';
        //name=Ary_PolyLine[i].getStrokeStyle();
        //alert(name);
    } else {
        document.body.title = '-1';
    }

}

function removePolyLine(id)//删除指定的折线
{
    if (id >= 0 && id < Ary_PolyLinecount && Ary_PolyLineUsed[id] == 1) {
        Ary_PolyLineUsed[id] = 0;
        map.removeOverlay(Ary_PolyLine[id]);
    }
}

function setPositionAt(id, index, lat, lng)//修改折线index点的坐标
{
    if (id >= 0 && id < Ary_PolyLinecount && Ary_PolyLineUsed[id] == 1) {
        var lvpoint = new BMap.Point(lng, lat);
        Ary_PolyLine[id].setPositionAt(index, lvpoint);
    }
}

function setPath(id, index, lat, lng)//往折线点坐标数组中增加一个点坐标
{
    var lvresult = 0;//返回值(0失败  1成功)
    if (id >= 0 && id < Ary_PolyLinecount && Ary_PolyLineUsed[id] == 1) {
        if (index > 1 && index < Ary_count) {
            Ary_PolyPoint[id][index] = new BMap.Point(lng, lat);
            Ary_PolyLine[id].setPath(Ary_PolyPoint[id]);
            lvresult = 1;
        }
    }
    document.body.title = lvresult + '';
}

function setStrokeColor(id, color)//修改折线的颜色
{
    if (id >= 0 && id < Ary_PolyLinecount && Ary_PolyLineUsed[id] == 1) {
        var Str_color = "blue";
        switch (color) {
            case 0:
                Str_color = "black";
                break;
            case 1:
                Str_color = "Maroon";
                break;
            case 2:
                Str_color = "Green";
                break;
            case 3:
                Str_color = "Olive";
                break;
            case 4:
                Str_color = "Navy";
                break;
            case 5:
                Str_color = "Purple";
                break;
            case 6:
                Str_color = "Teal";
                break;
            case 7:
                Str_color = "Red";
                break;
            case 8:
                Str_color = "Lime";
                break;
            case 9:
                Str_color = "Yellow";
                break;
            case 10:
                Str_color = "Blue";
                break;
            case 11:
                Str_color = "Fuchsia";
                break;
            case 12:
                Str_color = "Aqua";
                break;
            case 13:
                Str_color = "Gray";
                break;
            case 14:
                Str_color = "Silver";
                break;
            case 15:
                Str_color = "White";
                break;

        }
        Ary_PolyLine[id].setStrokeColor(Str_color);
    }
}

function setStrokeWeight(id, weight)//设置折线的宽度>=1
{
    if (id >= 0 && id < Ary_PolyLinecount && Ary_PolyLineUsed[id] == 1 && weight >= 1) {
        Ary_PolyLine[id].setStrokeWeight(weight);
    }
}

function setStrokeOpacity(id, value)//设置折线的透明度0-1,可以为小数
{
    if (id >= 0 && id < Ary_PolyLinecount && Ary_PolyLineUsed[id] == 1) {
        if (value >= 0 && value <= 1) {
            Ary_PolyLine[id].setStrokeOpacity(value);
        }
    }
}

function setStrokeStyle(id, style1)//设置折线为实线0或虚线1
{
    if (id >= 0 && id < Ary_PolyLinecount && Ary_PolyLineUsed[id] == 1) {
        if (style1 == 0) {
            Ary_PolyLine[id].setStrokeStyle("solid");
        } else {
            Ary_PolyLine[id].setStrokeStyle("dashed");
        }
    }
}
