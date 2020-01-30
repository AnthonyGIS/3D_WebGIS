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

缓冲区对象的构建与使用的五个关键步骤。
2020.1.30

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
    'void main(){\n' +
    '   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
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

    //指定清空<canvas>颜色
    gl.clearColor(0.3, 0.3, 0.3, 1.0);

    //清空<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // ---------------------------------------------------
    var n = initVertexBuffers(gl);
    gl.drawArrays(gl.LINE_LOOP, 0,n);
}


function initVertexBuffers(gl) {
    // DATA
    var vertices = new Float32Array([
        0.0,0.5,-0.5,-0.5,0.5,-0.5
    ]);
    var n = 3;

    // 步骤
    // createBuffer、bindBuffer、bufferData、vertexAttribPointer、enableVertexAttribArray
    // -------------------------------------------------------------
    // 创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log('Failed to create the buffer object.');
        return -1;
    }
    // 将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
    // Write data to buffer object
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);

    //获取a_Position变量存储位置
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0){
        console.log("Failed to get the storage location of a_Position");
        return -1;
    }
    // 将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0);
    // 连接变量与分配给他的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    return n;
}

