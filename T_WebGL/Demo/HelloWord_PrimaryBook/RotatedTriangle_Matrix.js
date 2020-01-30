// P102
// 变换矩阵缩放

// ------------------------------------------------------------------
var VSHADER_SOURCE =
    //x' = x cos b - y sin b
    //y' = x sin b + y cos b
    //z' = z
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_xformMatrix;\n' +
    'void main(){\n' +
    'gl_Position = u_xformMatrix*a_Position;\n' +
    '}\n';
// ------------------------------------------------------------------


var FSHADER_SOURCE=
    'void main(){'+
    'gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);'+
    '}';

var ANGLE = 90.0;


function main(){

    var canvas = document.getElementById("webgl");
    if(!canvas){
        console.log("Failed to retrieve the <canvas> element");
        return;
    }

    var gl = getWebGLContext(canvas);
    if(!gl){
        console.log("Failed to get the rendering context for WebGL");
        return;
    }

    if(!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)){
        console.log("Failed to initialize shaders.");
        return;
    }

    //设置顶点位置
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    // ------------------------------------------------------------------

    // 普通的旋转矩阵
    // ==========================
    // 创建旋转矩阵
    var radian = Math.PI * ANGLE / 180.0;
    var cosB = Math.cos(radian), sinB = Math.sin(radian);

    // 注意WebGL中的矩阵是列主序的
    var xformMatrix = new Float32Array([
        cosB, sinB, 0.0,0.0,
        -sinB, cosB, 0.0,0.0,
        0.0,0.0, 1.0, 0.0,
        0.0,0.0,0.0,1.0
    ]);

    // 缩放矩阵
    // ==========================
    // var xformMatrix = new Matrix4();
    // xformMatrix.setScale(0.5, 1.5, 1.0);

    // 旋转和平移
    // ==========================
    // var modelMatrix = new Matrix4();
    // var ANGLE = 60.0;
    // var Tx = 0.5;
    // modelMatrix.setRotate(ANGLE, 0, 0, 1);
    // modelMatrix.translate(Tx, 0, 0);

    // ==========================


    // 将旋转矩阵传递给顶点着色器
    var u_xformMatrix = gl.getUniformLocation(gl.program,'u_xformMatrix');
    if(u_xformMatrix < 0){
        console.log("Failed to get the storage location of u_xformMatrix");
        return;
    }
    gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);

    // ------------------------------------------------------------------


    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array(
        [0.0, 0.5, -0.5, -0.5, 0.5, -0.5]
    );
    var n=3; //点的个数

    //创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log("Failed to create this buffer object");
        return -1;
    }

    //将缓冲区对象保存到目标上
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    //向缓存对象写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0){
        console.log("Failed to get the storage location of a_Position");
        return -1;
    }

    //将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    //连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    return n;
}