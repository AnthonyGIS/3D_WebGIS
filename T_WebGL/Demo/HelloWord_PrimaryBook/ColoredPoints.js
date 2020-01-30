/*
                        -----------------------------------
                        |                                   |
                        |                                   |
                        |                 ^  y              |
                        |                |                  |
                        |                |                  |
                        |            ----+---->   x         |
                        |                \                  |
                        |                 \                 |
                        |                  \  z             |
                        |                   v               |
                        |                                   |
                        -----------------------------------
*/



// 顶点着色器
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'void main(){\n' +
    '   gl_Position = a_Position;\n' +
    '   gl_PointSize = 10.0;\n' +
    '}\n';

// 片元着色器
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +
    'void main(){\n' +
    '   gl_FragColor = u_FragColor;\n' +
    '}\n';


function main() {

    //获取canvas元素
    var canvas = document.getElementById("webgl");
    if(!canvas){
        console.log("Failed to retrieve the <canvas> element");
        return;
    }

    //获取WebGL绘图上下文
    var gl = getWebGLContext(canvas);
    if(!gl){
        console.log("Failed to get the rendering context for WebGL");
        return;
    }

    //初始化着色器
    if(!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)){
        console.log("Failed to initialize shaders.");
        return;
    }

    //获取a_Position、u_FragColor变量存储位置
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0){
        console.log("Failed to get the storage location of a_Position");
        return;
    }
    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if(!u_FragColor){
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    //指定清空<canvas>颜色
    gl.clearColor(0.3, 0.3, 0.3, 1.0);

    //清空<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);


    // ---------------------------------------------------
    canvas.onmousedown = function(ev){
        click(ev,gl,canvas,a_Position,u_FragColor);
    };
}

var g_points = [];
var g_colors = [];
function click(ev,gl,canvas,a_Position,u_FragColor) {

    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();

    x = ( (x - rect.left) - canvas.width/2) / ( canvas.width/2);
    y = (canvas.height/2 -( y-rect.top)) / ( canvas.height/2);

    // save coordinate to array
    g_points.push([x,y]);
    if (x>=0.0 && y>=0.0){ // 象限1
        g_colors.push([1.0,0.0,0.0,1.0]);
    }
    else if (x<0.0 && y<0.0) { // 3
        g_colors.push([0.0,1.0,0.0,1.0]);
    }
    else {  // other
        g_colors.push([1.0,1.0,1.0,1.0]);
    }

    // 清空canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = g_points.length;
    for (var i = 0; i<len; i++){
        var xy = g_points[i];
        var rgba = g_colors[i];

        // 将点的位置传输到gl变量中
        gl.vertexAttrib3f(a_Position,xy[0],xy[1],0.0);
        gl.uniform4f(u_FragColor,rgba[0],rgba[1],rgba[2],rgba[3]);

        // 绘制点
        gl.drawArrays(gl.POINT,0,1);
    }
    

}

