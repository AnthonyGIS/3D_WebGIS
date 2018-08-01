// 定义气象模拟类
var WeatherSim;


WeatherSim = (function (Cesium, $) {

    var gravityAcc = 9.8;
    var rainGravityAcc = 100 * gravityAcc;
    var gravityScratch = new Cesium.Cartesian3();


    // 定义属性字段
    function WeatherSim(_viewer, _center, _radius, style_url) {
        this.weatherSimViewer = _viewer || undefined;
        this.center = _center;
        this.centerCarto = Cesium.Ellipsoid.WGS84.cartesianToCartographic(_center);
        this.radius = _radius;
        this.particleSystem;
        this._currentLocation = getCameraLocation(this.weatherSimViewer.container) || null;
        this._currentGbcode = '';
        this._styleurl = style_url;
        this._style = {};
        //this.gravityAcc = 9.8;
    }

    WeatherSim.prototype.loadStyle = function () {
        var that = this;
        $.getJSON('' + that._styleurl, function (data) {
            that._style = data;
        }.bind(this));
    };

    WeatherSim.prototype.snow = function (rate) {
        var that = this;
        if (Cesium.defined(this.particleSystem))
            this.weatherSimViewer.scene.primitives.remove(this.particleSystem);
        var life = Math.sqrt(this.centerCarto.height * 2 / gravityAcc);
        this.particleSystem = this.weatherSimViewer.scene.primitives.add(new Cesium.ParticleSystem({
            image: 'images/snowflake.png',
            //startColor:Cesium.Color.fromHsl(0.66, 1.0, 0.7),
            //endColor:Cesium.Color.fromHsl(0.66, 1.0, 0.7),
            //startScale : 1.0,
            //endScale : 1.0,
            life: life || 10.0,
            //speed : 5.0,
            width: 10,
            height: 10,
            rate: rate || 50.0,
            lifeTime: 300,
            modelMatrix: computeModelMatrix(that.center),
            emitterModelMatrix: computeEmitterModelMatrix(),
            emitter: new Cesium.CircleEmitter(that.radius),
            forces: [applyGravity]
        }));
    };

    WeatherSim.prototype.rain = function (rate, width, height) {
        var that = this;
        if (Cesium.defined(this.particleSystem))
            this.weatherSimViewer.scene.primitives.remove(this.particleSystem);
        var life = Math.sqrt(this.centerCarto.height * 2 / rainGravityAcc) + 2;
        this.particleSystem = this.weatherSimViewer.scene.primitives.add(new Cesium.ParticleSystem({
            image: 'images/raindrop2.png',
            //startColor:Cesium.Color.fromHsl(0.66, 1.0, 0.8),
            //endColor:Cesium.Color.fromHsl(0.66, 1.0, 0.8),
            //startScale : 1.0,
            //endScale : 1.0,
            life: life || 10.0,
            //speed : 5.0,
            width: width || 3,
            height: height || 10,
            rate: rate || 50,
            lifeTime: 300,
            modelMatrix: computeModelMatrix(that.center),
            emitterModelMatrix: computeEmitterModelMatrix(),
            emitter: new Cesium.CircleEmitter(that.radius),
            forces: [applyForceRain]
        }));
    };



    WeatherSim.prototype.autoUpdateWeather = function () {
        this.updateLocation(this.weatherSimViewer.container);
    };

    // update current location when camera move end
    WeatherSim.prototype.updateLocation = function (container) {
        var that = this;
        viewer.camera.moveEnd.addEventListener(function () {

            that._currentLocation = getCameraLocation(container) || null;//this._currentLocation;
            if (!that._currentLocation) {
                return;
            }
            that.updateWeather(that._currentLocation.longitude, that._currentLocation.latitude, function (data) {
                that.updateStyle(data);
            });
            console.log('updateLocation done');

        });
    };

    function getCameraLocation(container) {

        var degrees;
        var width = container.clientWidth;
        var height = container.clientHeight;
        var offsetTop = container.clientTop;
        var offsetLeft = container.clientLeft;
        var center = new Cesium.Cartesian2(width / 2 + offsetLeft, height / 2 + offsetTop);
        var cartesian = viewer.camera.pickEllipsoid(center);
        if (!Cesium.defined(cartesian)) {
            // console.log('center not on globe');
            return null;
        }
        var radians = Cesium.Cartographic.fromCartesian(cartesian);

        degrees = {
            latitude: Cesium.Math.toDegrees(radians.latitude),
            longitude: Cesium.Math.toDegrees(radians.longitude),
            height: Cesium.Math.toDegrees(radians.height)
        };

        // console.log('getCameraLocation done');
        return degrees;
    }

    WeatherSim.prototype.updateStyle = function (data) {

        var index_today = data.ic[0].slice(1);
        console.log(index_today);

        var thisStyle = this._style[index_today];
        var brightnessShift = thisStyle.skyAtmosphere.brightnessShift;
        var saturationShift = thisStyle.skyAtmosphere.saturationShift;
        this.weatherSimViewer.scene.skyAtmosphere.brightnessShift = brightnessShift;
        this.weatherSimViewer.scene.skyAtmosphere.saturationShift = saturationShift;
        if (thisStyle.rate) {
            if ((thisStyle.id >= 3 && thisStyle.id <= 12) || 19 === thisStyle.id || (thisStyle.id >= 21 && thisStyle.id <= 25)) {
                this.rain(thisStyle.rate);
            }
            else if ((thisStyle.id >= 13 && thisStyle.id <= 17) || (thisStyle.id >= 26 && thisStyle.id <= 28)) {
                this.snow(thisStyle.rate);
            }
        }
    };

    WeatherSim.prototype.updateWeather = function (lon, lat, callback) {
        var input = {"lonlat": '' + lon + ',' + lat, 'level': '5'};
        var url = 'http://weather.tianditu.com/weather/changeArea?type=changeCity&postStr=' + JSON.stringify(input);

        $.getJSON(url, function (data) {

            // url: http://weather.tianditu.com/weather/changeArea?type=changeCity&postStr={%22lonlat%22:%22121.39056746724242,31.16679786182727%22,%22level%22:%225%22}
            // data:
            // {"Streetview":1,"ds":"","gbcode":"156310104","name":"徐汇","parentGbcode":"156310000","parentName":"上海",
            // "weatherCode":101021200,"wholeName":"上海市徐汇区"}
            var gbcode;

            var name = data.name; //徐汇
            gbcode = data.gbcode; //156310104
            var parentName = data.parentName; // 上海
            var parentGbcode = data.parentGbcode; //156310000
            if (name && gbcode && parentName && parentGbcode) {
                if (this._currentGbcode !== gbcode) {
                    this._currentGbcode = gbcode;
                    console.log('get new gbcode');
                    getWeather(gbcode, parentGbcode, callback);
                }
                else {
                    console.log('get old gbcode');
                }

            }
            else {
                console.log('not a city');
                //getWeather();
            }
        }.bind(this));
    };

    function getWeather(gbcode, parentGbcode, callback) {

        //if (!gbcode || !parentGbcode);
        var url = 'http://weather.tianditu.com/weather/weathers?gbcode=' + gbcode;
        $.getJSON(url, function (data) {
            //{"currentdata":[{"region":{"gbcode":"156310104","name":"徐汇","lng":"121.432202","lat":"31.190211"},"dt":"2018-05-05 08:00","ic":["n07","n08","n01"],"index":[{"i5":"早晨气象条件较适宜晨练，但晨练时会感觉有点凉，建议晨练着装不要过于单薄，以防感冒。","i4":"较适宜","i2":"晨练指数"},{"i5":"白天天气晴好，您在这种天气条件下，会感觉早晚凉爽、舒适，午后偏热。","i4":"较舒适","i2":"舒适度指数"},{"i5":"天气热，建议着短裙、短裤、短薄外套、T恤等夏季服装。","i4":"热","i2":"穿衣指数"}],"dw":[{"fg":"3-4级","tmp":"23~21℃","fa":"小雨","fe":"南风"},{"fg":"微风","tmp":"28~18℃","fa":"中雨","fe":"北风"},{"fg":"微风","tmp":"23~16℃","fa":"多云","fe":"北风"}],"wcode":"101021200"}],"data":[]}
            if (data.currentdata.length) {
                callback(data.currentdata[0]);
                console.log('getWeather done(current district)');
            }
            else {
                if (parentGbcode !== '0') {
                    var url2 = 'http://weather.tianditu.com/weather/weathers?gbcode=' + parentGbcode;
                    $.getJSON(url2, function (data) {
                        if (data.currentdata.length) {
                            callback(data.currentdata[0]);
                            console.log('getWeather done(parent district)');
                        }
                        else {
                            console.log('no weather report');
                        }
                    });
                }
            }
        });
    }

    function computeModelMatrix(center) {
        return Cesium.Transforms.eastNorthUpToFixedFrame(center, undefined, new Cesium.Matrix4());
    }

    function computeEmitterModelMatrix() {
        var hpr = Cesium.HeadingPitchRoll.fromDegrees(0.0, 180.0, 0.0, new Cesium.HeadingPitchRoll());
        var trs = new Cesium.TranslationRotationScale();
        trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, new Cesium.Quaternion());
        return Cesium.Matrix4.fromTranslationRotationScale(trs, new Cesium.Matrix4());
    }



    // Common method
    // -----------------------------------------------------------------------

    function applyGravity(p, dt) {
        // Compute a local up vector for each particle in geocentric space.
        var position = p.position;
        Cesium.Cartesian3.normalize(position, gravityScratch);
        Cesium.Cartesian3.multiplyByScalar(gravityScratch, -gravityAcc * dt, gravityScratch);
        p.velocity = Cesium.Cartesian3.add(p.velocity, gravityScratch, p.velocity);
    }

    function applyForceRain(p, dt) {
        var position = p.position;

        Cesium.Cartesian3.normalize(position, gravityScratch);
        Cesium.Cartesian3.multiplyByScalar(gravityScratch, -rainGravityAcc * dt, gravityScratch);
        p.velocity = Cesium.Cartesian3.add(p.velocity, gravityScratch, p.velocity);
    }




    return WeatherSim;

})(window.Cesium || {}, window.$ || {});