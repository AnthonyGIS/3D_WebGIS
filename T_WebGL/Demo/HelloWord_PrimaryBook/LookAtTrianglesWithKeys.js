var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'uniform mat4 u_ViewMatrix;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    'gl_Position = u_ViewMatrix * a_Position;\n' +
    'gl_PointSize = 10.0;\n' +
    'v_Color = a_Color;\n' +
    '}\n';

var FSHADER_SOURCE=
    'precision mediump float;\n' +//!!! 需要声明浮点数精度，否则报错No precision specified for (float)
    'varying vec4 v_Color;\n' +
    'void main(){\n'+
    'gl_FragColor = v_Color;\n'+
    '}\n';

var g_eyeX = 0.20, g_eyeY = 0.25, g_eyeZ = 0.25; //视点



function main() {

    var canvas = document.getElementById("webgl");
    if (!canvas) {
        console.log("Failed to retrieve the <canvas> element");
        return;
    }

    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log("Failed to get the rendering context for WebGL");
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("Failed to initialize shaders.");
        return;
    }

    //设置顶点位置
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');

    //设置视点、视线、上方向
    var viewMatrix = new Matrix4();

    //注册键盘事件响应函数
    document.onkeydown = function (ev) {
        keydown(ev, gl, n, u_ViewMatrix,viewMatrix);
    };

   draw(gl, n, u_ViewMatrix, viewMatrix);
}

function keydown(ev, gl, n, u_ViewMatrix, viewMatrix) {
    if(ev.keyCode == 39){   //按下右键
        g_eyeX += 0.01;
    }else if(ev.keyCode == 37){ //按下左键
        g_eyeX -= 0.01;
    }else {
        return ;
    }
    draw(gl, n, u_ViewMatrix, viewMatrix);
}

function draw(gl, n, u_ViewMatrix, viewMatrix) {
    //设置视点和视线
    viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, 0, 0, 1, 0);

    //将视图矩阵传递给u_ViewMatrix变量
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
    var verticesColors = new Float32Array(
        [
            0.0,  0.5,  -0.4,  0.4,  1.0,  0.4, // The back green one
            -0.5, -0.5,  -0.4,  0.4,  1.0,  0.4,
            0.5, -0.5,  -0.4,  1.0,  0.4,  0.4,

            0.5,  0.4,  -0.2,  1.0,  0.4,  0.4, // The middle yellow one
            -0.5,  0.4,  -0.2,  1.0,  1.0,  0.4,
            0.0, -0.6,  -0.2,  1.0,  1.0,  0.4,

            0.0,  0.5,   0.0,  0.4,  0.4,  1.0,  // The front blue one
            -0.5, -0.5,   0.0,  0.4,  0.4,  1.0,
            0.5, -0.5,   0.0,  1.0,  0.4,  0.4
        ]
    );
    var n = 9; //点的个数


    //创建缓冲区对象
    var verteColorBuffer = gl.createBuffer();
    if (!verteColorBuffer) {
        console.log("Failed to create this buffer object");
        return -1;
    }
    //将缓冲区对象保存到目标上
    gl.bindBuffer(gl.ARRAY_BUFFER, verteColorBuffer);

    //向缓存对象写入数据
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    var FSIZE = verticesColors.BYTES_PER_ELEMENT;

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log("Failed to get the storage location of a_Position");
        return -1;
    }
    //将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE *6, 0);
    //连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Color < 0) {
        console.log("Failed to get the storage location of a_Position");
        return -1;
    }

    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);//取消绑定的缓冲区对象
    return n;
}
