import * as d3 from "./d3";

function CoordinateMap(dom, center, anglePoints) {

    this.width = 600;
    this.height = 600;

    this.color = d3.scale.category20();

    this.svg = d3.select('.mapDiv')
        .append('svg')
        .attr('width', this.width)
        .attr('height', this.height)
        .attr('transform', 'translate(0,0)');

    this.group1 = this.svg.append('g');
    this.group2 = this.svg.append('g');
    this.group3 = this.svg.append('g');

    //地理投影 经纬度  转 平面
    this.projection = d3.geo.mercator()
        .center(center)
        .scale(23000)
        .translate([this.width / 2, this.height / 2]);

    this.anglePoints = anglePoints;
}

CoordinateMap.prototype = {
    constructor: CoordinateMap,
    addGeoMap: function() {
        this.addPoints();
    },
    addPoints: function() {

        d3.json('./json/shanghai.json', (error, root) => {

            if (error) {
                console.log(root.features);
                return console.log(error);
            }

            var path = d3.geo.path()
                .projection(this.projection);

            this.group1.selectAll('path')
                .data(root.features)
                .enter()
                .append('path')
                .attr('fill', 'none')
                .attr("stroke", "#000")
                .attr("stroke-width", 1)
                .attr("d", path);

            this.group2.selectAll('path')
                .data(root.points)
                .enter()
                .append('path')
                .attr('fill', (d, i) => {
                    return this.color(i);
                })
                .attr('stroke', 'none')
                .attr('d', path);

            var icon = 'M20,60 L0,30 C0,30 20,0 40,30 L20,60';
            this.group3.selectAll('path')
                .data(this.anglePoints)
                .enter()
                .append('g')
                .attr('transform', (v, i) => {
                    var xy = this.projection(v.data);
                    return `translate(${xy[0]} ${xy[1]})`;
                })
                .append('path')
                .attr('d', icon)
                .attr('fill', 'blue')
                .attr('stroke', 'none')
                .on('click', function(d, i) {

                    console.log(d);
                    console.log(d3.select(this)[0][0]);

                });

        });
    }
};




var shanghaiMap = new CoordinateMap('.mapDiv', [121.479102, 31.23212], [
    { name: '吕浦大桥', data: [121.487294, 31.195348] },
    { name: "潘石镇", data: [121.649061, 31.421497] },
    { name: "东平国家森林公园", data: [121.489738, 31.691537] }
]);
shanghaiMap.addGeoMap();