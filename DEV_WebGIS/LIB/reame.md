add new lib example:
```
git submodule add --force https://github.com/kartena/Proj4Leaflet.git DEV_WebGIS/LIB/leaflet/Proj4Leaflet
git submodule add  -b master --force https://github.com/Leaflet/Leaflet.git DEV_WebGIS/LIB/leaflet/leaflet
git submodule add  -b master --force https://github.com/CesiumGS/cesium.git DEV_WebGIS/LIB/Cesium
git submodule add  -b dev --force https://github.com/mrdoob/three.js.git DEV_WebGIS/LIB/three_js
```


备注：
three.js的包太大，就没有git submodule方式添加了, 仅添加部分常用的目录文件。
具体可以到 [github](https://github.com/mrdoob/three.js) 上学习。



git 的 submodule 更多操作见自己的onenote:
0110 Git Submodule