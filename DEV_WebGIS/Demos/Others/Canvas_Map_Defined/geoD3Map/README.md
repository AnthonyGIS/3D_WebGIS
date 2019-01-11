# geoD3Map
根据 geoJson， 使用 d3 画出地图

    //地理投影 经纬度  转 平面
    
    this.projection = d3.geo.mercator()
        .center(center)
        .scale(48500)
        .translate([this.width / 2, this.height / 2]);
        
        
        
    //geoJson 轮廓
    
    this.path = d3.geo.path()
         .projection(this.projection);
        
