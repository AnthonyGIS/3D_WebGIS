# 一、Cesium



该文档是用来说明，如何从网络上下载cesium及覆盖本地的库。



## 1.1 cesium的下载及本地node服务配置

（1）最新的cesium版本[下载](https://cesium.com/downloads/)及放置到如下的目录下

E:\Learns\WebGIS\文档\LIBS\Cesium-1.65

（2）在该目录下安装cesium所需要的库：

express、compression、request、yargs

使用命令安装：

```
# 在项目的目录下安装（推荐）
# 安装的文件在该目录下的 node_modules 目录下了。
npm install express
# 或者全局方式安装
npm install -g express
```

（3）启动

node  server.js


![cesium_1](Docs\imgs\cesium_1.png)



## 1.2 配置D3_WebGIS中的cesium库

将下载的cesium发布包里的 *Build/Cesium、Source* 目录，分别覆盖掉本项目中的：

'DEV_WebGIS/LIB/Cesium' 下的相应目录。





## 1.3 相关库

OpenLayer版本的Cesium

http://openlayers.org/ol-cesium/


openlayer 库

https://github.com/openlayers/openlayers





## 1.4 使用

### 隐藏掉logo

```
viewer._cesiumWidget._creditContainer.style.display = "none";
```

### 添加defaultAccessToken

 https://cesium.com/ion/tokens 

```
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmNTdmYzUwZS0yYmJkLTQwNTQtYjk3OC01NDQ4ODhlZmFjZmEiLCJpZCI6NjY4Mywic2NvcGVzIjpbImFzbCIsImFzciIsImFzdyIsImdjIl0sImlhdCI6MTU0NzEyNjAyMX0.9C_6xLe-gC17O0_0pRxDygYdzeMmvvYqiP2gzQLA5Vo'var viewer = new Cesium.Viewer('cesiumContainer');
```



## 1.5 更新历史

v1.53, 2019.1.10

v1.65, 2020.1.28





# 二、百度地图

## 地图

 JS API

http://lbsyun.baidu.com/index.php?title=jspopular 

 Android 地图SDK 

 http://lbsyun.baidu.com/index.php?title=androidsdk 

##  地图可视化 

 http://lbsyun.baidu.com/solutions/solutions/visualization 

## 位置数据可视化

 http://lbsyun.baidu.com/solutions/solutions/mapvdata 





# 三、Openlayers

## 3.1 总体

官网

 https://openlayers.org/ 

Example

 https://openlayers.org/en/latest/examples/ 

Github

 https://github.com/openlayers/openlayers 





## 3.2 版本使用信息

 https://github.com/openlayers/openlayers/releases 



v6.1.1	2020.1.27

















# 四、Leaflet

编写目的：

探索轻量级webGIS技术，实现无人机航线数据的更高级别的可视化。



下载

 https://leafletjs.com/download.html 

Github

 https://github.com/Leaflet/Leaflet 



DEMOS OF Org  [quick-start](https://leafletjs.com/examples/quick-start/)



## 4.1 版本使用信息

1.4.0  2019.1.9

1.6.0  2020.1.27



更新时，仅需将DEV_WebGIS/LIB/leaflet 目录下的

images
leaflet.css
leaflet.js
leaflet-src.esm.js
leaflet-src.js

目录、文件进行更新替换即可。




## 4.2 参考博文
***
1. [LUB1: leaflet入门——地图加载（以arcgis服务为例）](https://blog.csdn.net/u012320231/article/details/81905986)<br/>
2. △ [LUB2: Leaflet各种实战实例](https://blog.csdn.net/wypersist/article/details/80523721)<br/>
3. [LUB3: leaflet+esri-leaflet+heatmap实现热力图](https://www.cnblogs.com/mengjiaxing/p/7766924.html)<br/>
4. [LUB4: leaflet常用插件地址整理](https://blog.csdn.net/yangdengxian/article/details/79954827)
5. [官方的操作手册](https://leafletjs.com/reference-1.4.0.html#path)



## 4.3 除leaflet之外的额外常用插件:
___
* ☆ [esri-leaflet.js](https://esri.github.io/esri-leaflet/),  [Esri Leaflet Quickstart]( https://esri.github.io/esri-leaflet/examples/)<br/>
* [L.Control.MousePosition.js](https://github.com/ardhi/Leaflet.MousePosition)<br/>
* △ [proj4.js与proj4leaflet.js](https://github.com/kartena/Proj4Leaflet)<br/>







# 五、ArcGIS Server JS API

2020.1.29 已经移除，不常用。



# 六、Mapbox
计划新增。



# 七、D3
计划新增。


















