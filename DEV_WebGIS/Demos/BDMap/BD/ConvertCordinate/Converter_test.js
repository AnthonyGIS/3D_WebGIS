

var GPS = {

    //定义一些常量
    PI: 3.1415926535897932384626,
    x_PI: 3.14159265358979324 * 3000.0 / 180.0,
    ellipse_a: 6378245.0,//  ellipse_a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
    ellipse_ee: 0.00669342162296594323,//  ellipse_ee: 椭球的偏心率。

    DeltaCal: function (lat, lon) {
        // Krasovsky 1940
        // a = 6378245.0, 1/f = 298.3
        // b = a * (1 - f)
        // ee = (a^2 - b^2) / a^2;
        var dLat = this.transformlat(lon - 105.0, lat - 35.0);
        var dLon = this.transformlng(lon - 105.0, lat - 35.0);
        var radLat = lat / 180.0 * this.PI;
        var magic = Math.sin(radLat);
        magic = 1 - this.ellipse_ee * magic * magic;
        var sqrtMagic = Math.sqrt(magic);
        dLat = (dLat * 180.0) / ((this.ellipse_a * (1 - this.ellipse_ee)) / (magic * sqrtMagic) * this.PI);
        dLon = (dLon * 180.0) / (this.ellipse_a / sqrtMagic * Math.cos(radLat) * this.PI);
        return {'lat': dLat, 'lon': dLon};
    },
    WGS84_To_GCJ2: function (wgsLat, wgsLon) {
        /// <summary>
        /// WGS-84 to GCJ-02
        /// </summary>
        /// <param name="wgsLat" type="type"></param>
        /// <param name="wgsLon" type="type"></param>
        /// <returns type=""></returns>
        if (this.out_of_china(wgsLat, wgsLon))
            return {'lat': wgsLat, 'lon': wgsLon};

        var d = this.DeltaCal(wgsLat, wgsLon);
        return {'lat': wgsLat + d.lat, 'lon': wgsLon + d.lon};
    },
    GCJ2_To_WGS84: function (gcjLat, gcjLon) {
        /// <summary>
        /// GCJ-02 to WGS-84
        /// </summary>
        /// <param name="gcjLat" type="type"></param>
        /// <param name="gcjLon" type="type"></param>
        /// <returns type=""></returns>
        if (this.out_of_china(gcjLat, gcjLon))
            return {'lat': gcjLat, 'lon': gcjLon};

        var d = this.DeltaCal(gcjLat, gcjLon);
        return {'lat': gcjLat - d.lat, 'lon': gcjLon - d.lon};
    },

    GCJ2_To_WGS84_Exact: function (gcjLat, gcjLon) {
        /// <summary>
        /// GCJ-02 to WGS-84 exactly
        /// </summary>
        /// <param name="gcjLat" type="type"></param>
        /// <param name="gcjLon" type="type"></param>
        /// <returns type=""></returns>
        var initDelta = 0.01;
        var threshold = 0.000000001;
        var dLat = initDelta, dLon = initDelta;
        var mLat = gcjLat - dLat, mLon = gcjLon - dLon;
        var pLat = gcjLat + dLat, pLon = gcjLon + dLon;
        var wgsLat, wgsLon, i = 0;
        while (1) {
            wgsLat = (mLat + pLat) / 2;
            wgsLon = (mLon + pLon) / 2;
            var tmp = this.WGS84_To_GCJ2(wgsLat, wgsLon);
            dLat = tmp.lat - gcjLat;
            dLon = tmp.lon - gcjLon;
            if ((Math.abs(dLat) < threshold) && (Math.abs(dLon) < threshold))
                break;

            if (dLat > 0) pLat = wgsLat; else mLat = wgsLat;
            if (dLon > 0) pLon = wgsLon; else mLon = wgsLon;

            if (++i > 10000) break;
        }
        //console.log(i);
        return {'lat': wgsLat, 'lon': wgsLon};
    },

    /**
     * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
     * 即谷歌、高德 转 百度
     * @returns {*[]}
     * @param gcjLat
     * @param gcjLon
     */
    GCJ2_To_BD09: function (gcjLat, gcjLon) {
        /// <summary>
        /// GCJ-02 to BD-09
        /// </summary>
        /// <param name="gcjLat" type="type"></param>
        /// <param name="gcjLon" type="type"></param>
        /// <returns type=""></returns>
        var x = gcjLon, y = gcjLat;
        var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.x_PI);
        var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.x_PI);
        bdLon = z * Math.cos(theta) + 0.0065;
        bdLat = z * Math.sin(theta) + 0.006;
        return {'lat': bdLat, 'lon': bdLon};
    },

    /**
     * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
     * 即 百度 转 谷歌、高德
     * @returns {*[]}
     * @param bdLat
     * @param bdLon
     */
    BD09_To_GCJ2: function (bdLat, bdLon) {
        /// <summary>
        /// BD-09 to GCJ-02
        /// </summary>
        /// <param name="bdLat" type="type"></param>
        /// <param name="bdLon" type="type"></param>
        /// <returns type=""></returns>
        var x = bdLon - 0.0065, y = bdLat - 0.006;
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_PI);
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_PI);
        var gcjLon = z * Math.cos(theta);
        var gcjLat = z * Math.sin(theta);
        return {'lat': gcjLat, 'lon': gcjLon};
    },
    wgs84_to_mercator: function (wgsLat, wgsLon) {
        /// <summary>
        /// WGS-84 to Web mercator 
        /// mercatorLat -> y mercatorLon -> x
        /// </summary>
        /// <param name="wgsLat" type="type"></param>
        /// <param name="wgsLon" type="type"></param>
        /// <returns type=""></returns>
        var x = wgsLon * 20037508.34 / 180.;
        var y = Math.log(Math.tan((90. + wgsLat) * this.PI / 360.)) / (this.PI / 180.);
        y = y * 20037508.34 / 180.;
        return {'lat': y, 'lon': x};
        /*
        if ((Math.abs(wgsLon) > 180 || Math.abs(wgsLat) > 90))
            return null;
        var x = 6378137.0 * wgsLon * 0.017453292519943295;
        var a = wgsLat * 0.017453292519943295;
        var y = 3189068.5 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
        return {'lat' : y, 'lon' : x};
        //*/
    },
    mercator_to_wgs84: function (mercatorLat, mercatorLon) {
        /// <summary>
        /// Web mercator to WGS-84
        /// mercatorLat -> y mercatorLon -> x
        /// </summary>
        /// <param name="mercatorLat" type="type"></param>
        /// <param name="mercatorLon" type="type"></param>
        /// <returns type=""></returns>
        var x = mercatorLon / 20037508.34 * 180.;
        var y = mercatorLat / 20037508.34 * 180.;
        y = 180 / this.PI * (2 * Math.atan(Math.exp(y * this.PI / 180.)) - this.PI / 2);
        return {'lat': y, 'lon': x};
        /*
        if (Math.abs(mercatorLon) < 180 && Math.abs(mercatorLat) < 90)
            return null;
        if ((Math.abs(mercatorLon) > 20037508.3427892) || (Math.abs(mercatorLat) > 20037508.3427892))
            return null;
        var a = mercatorLon / 6378137.0 * 57.295779513082323;
        var x = a - (Math.floor(((a + 180.0) / 360.0)) * 360.0);
        var y = (1.5707963267948966 - (2.0 * Math.atan(Math.exp((-1.0 * mercatorLat) / 6378137.0)))) * 57.295779513082323;
        return {'lat' : y, 'lon' : x};
        //*/
    },


    transformlat: function (lng, lat) {
        var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
        return ret
    },
    transformlng: function (lng, lat) {
        var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
        return ret
    },
    distance: function (latA, lonA, latB, lonB) {
        /// <summary>
        /// two point's distance
        /// </summary>
        /// <param name="latA" type="type"></param>
        /// <param name="lonA" type="type"></param>
        /// <param name="latB" type="type"></param>
        /// <param name="lonB" type="type"></param>
        /// <returns type=""></returns>
        var earthR = 6371000.;
        var x = Math.cos(latA * this.PI / 180.) * Math.cos(latB * this.PI / 180.) * Math.cos((lonA - lonB) * this.PI / 180);
        var y = Math.sin(latA * this.PI / 180.) * Math.sin(latB * this.PI / 180.);
        var s = x + y;
        if (s > 1) s = 1;
        if (s < -1) s = -1;
        var alpha = Math.acos(s);
        return alpha * earthR;
    },
    /**
     * 判断是否在国内，不在国内则不做偏移
     * @param lng
     * @param lat
     * @returns {boolean}
     */
    out_of_china: function (lng, lat) {
        return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
    }
};