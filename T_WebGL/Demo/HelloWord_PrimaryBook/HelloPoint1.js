
// 顶点着色程序
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'void main(){\n' +
    'gl_Position = a_Position;\n' +
    'gl_PointSize = 10.0;\n' +
    '}\n';

// 片元着色
var FSHADER_SOURCE = 'void main(){\n' +
    'gl_FragColor = vec4(1.0,0.0,0.0,1.0);\n' +
    '}\n';

 function  main() {
     var canvas = document.getElementById('webgl');

     // 获取webGL上下文
     var gl = getWebGLContext(canvas);
     if(!gl)
     {
         console.log('Faild to get the rendering context for webGL');
         return;
     }

     // 初始化着色器
     if (!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE))
     {
         console.log('Failed to initialize shaders.');
         return;
     }


     // 获取attribute变量的存储位置
     var a_Position = gl.getAttribLocation(gl.program,'a_Position');
     if(a_Position<0)
     {
         console.log('Failed to get the storage location of a_Position');
         return;
     }

     canvas.onmousedown = function (ev) { click(ev,gl,canvas,a_Position); };
     // 指定Canvas的背景颜色
     gl.clearColor(0.8,0.8,0.8,1.0);

     // 清空canvas
     gl.clear(gl.COLOR_BUFFER_BIT);
 }

 var g_points = [];

 function click(ev,gl,canvas, a_Position) {
     var x = ev.clientX;
     var y = ev.clientY;
     var rect = ev.target.getBoundingClientRect();

     x = ((x-rect.left) - canvas.height/2) /(canvas.height/2);
     y = (rect.width/2 - (y-rect.top)) /(canvas.width/2);

     g_points.push(x);
     g_points.push(y);

     // 清空canvas
     gl.clear(gl.COLOR_BUFFER_BIT);

     var length = g_points.length;
     for(var i = 0;i<length;i+=2)
     {
         // 将顶点位置传输为Attribute 变量
         gl.vertexAttrib3f(a_Position,g_points[i],g_points[i+1],0.0);
         gl.drawArrays(gl.POINTS,0,1);
     }
 }