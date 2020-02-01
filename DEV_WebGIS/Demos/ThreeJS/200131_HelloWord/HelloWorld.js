/**
 室内地图显示与监控相机场景定位模拟。


 REF:
 1.Three.js 创建第一个三维场景, https://blog.csdn.net/ithanmang/article/details/80782663
 2.WebGl(Three.js) 读取ArcgisServer发布的管线数据服务, https://blog.csdn.net/u013236043/article/details/79697255\
 3.Three.js 开发3D地图实践总结,https://blog.csdn.net/weixin_33932129/article/details/85913269
 4.使用three.js创建楼层布局图,https://blog.csdn.net/u014529917/article/details/82836871
 5.Three.js 笔记 - 使用dat.GUI简化调试流程, https://blog.csdn.net/ithanmang/article/details/80787139

 本地示例
 DEV_WebGIS/LIB/three_js/examples/misc_controls_map.html



 @author Cheetah
 @date 2020-01-31 21:25
 */

import {OrbitControls} from "../../../LIB/three_js/examples/jsm/controls/OrbitControls.js";
import {FXAAShader} from '../../../LIB/three_js/examples/jsm/shaders/FXAAShader.js';
import {RenderPass} from "../../../LIB/three_js/examples/jsm/postprocessing/RenderPass.js";
import {ShaderPass} from "../../../LIB/three_js/examples/jsm/postprocessing/ShaderPass.js";
import {EffectComposer} from "../../../LIB/three_js/examples/jsm/postprocessing/EffectComposer.js";


var scene,camera,webgl_render,controls;
var container;

var stats = initStats();

function initScene(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xeeeeee );
    scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

    container = $('#webgl_output');
}

function initCamera(){
    camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight, 0.1, 10000);
    // configure camera
    camera.position.set(200,150,200);
    camera.lookAt(new THREE.Vector3(0,0,0));
}

function initRender(){
    webgl_render = new THREE.WebGLRenderer();

    // configure render
    webgl_render.antialias = true;
    webgl_render.alpha = true;
    webgl_render.autoClear = false;
    webgl_render.setClearColor(0x050505);

    webgl_render.setPixelRatio( window.devicePixelRatio );
    webgl_render.setSize(window.innerWidth,window.innerHeight);

    // add render page to the div
    container.append(webgl_render.domElement);
}

function initLight(){

    // create ambient light
    var ambient_light = new THREE.AmbientLight(0x404040);
    scene.add(ambient_light);

    // add spot light
    var spot_light = new THREE.SpotLight(0xcccccc);
    spot_light.position.set(-100,300,10);
    scene.add(spot_light);
}

function initControls(){

    controls =  new OrbitControls(camera, webgl_render.domElement);
}

function initStats() {   /**
     * 性能插件
     * @type {{REVISION: number, domElement: HTMLDivElement, ms: (function(): number), setMode: setMode, fps: (function(): number), update: update, end: (function(): number), begin: begin}}
     */
    var stats = new Stats();
    document.body.appendChild(stats.domElement);
    return stats;
}

function update() {
    // noinspection JSValidateTypes
    /**
     * 数据更新
     */
    stats.update();
}

function animate() {
    requestAnimationFrame(animate);

    // start render
    webgl_render.render(scene,camera);

    update();
}



function onWindowResize() {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();

    webgl_render.setSize(container.offsetWidth, container.offsetHeight);
}

function addContent_1()
{
    // add plane
    var plane_geometry = new THREE.PlaneGeometry(200,400);
    var plane_material = new THREE.MeshLambertMaterial({color:0xcccccc}); //  new THREE.MeshLambertMaterial({color:0xcccccc});
    var plane = new THREE.Mesh(plane_geometry,plane_material);
    // rotate 90° under axis x
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(-10,-10,-80);
    scene.add(plane);

    // add cube
    var cube_geometry = new THREE.CubeGeometry(50,50,50);
    var cube_material = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff, flatShading: true } );
    var cube = new THREE.Mesh(cube_geometry,cube_material);
    cube.position.set(30,10,-30);
    cube.castShadow = true;
    scene.add(cube);
}



// 场景中的内容
function addContent_2() {

    var dirX = new THREE.Vector3( 1, 0, 0 );
    var dirY = new THREE.Vector3( 0, 1, 0 );
    var dirZ = new THREE.Vector3( 0, 0, 1 );

    var origin = new THREE.Vector3( 0, 0, 0 );
    var length = 10;

    var arrowHelperX = new THREE.ArrowHelper( dirX, origin, length, 0xff0000 );
    var arrowHelperY = new THREE.ArrowHelper( dirY, origin, length, 0x00ff00 );
    var arrowHelperZ = new THREE.ArrowHelper( dirZ, origin, length, 0x0000ff );
    scene.add( arrowHelperX );
    scene.add( arrowHelperY );
    scene.add( arrowHelperZ );

    /* 原点 */
    var spriteOrigin = makeTextSprite( " vector3(0, 0, 0) ",
        {
            fontsize: 20,
            borderColor: {r:255, g:0, b:0, a:0.4},/* 边框黑色 */
            backgroundColor: {r:255, g:255, b:255, a:0.9}/* 背景颜色 */
        } );
    spriteOrigin.center = new THREE.Vector2(0, 0);
    scene.add( spriteOrigin );
    spriteOrigin.position.set(0, -5, 0);

    var spriteY = makeTextSprite( "Y",
        {
            fontsize: 20,
            borderColor: {r:255, g:0, b:0, a:0.4},/* 边框黑色 */
            backgroundColor: {r:255, g:255, b:255, a:0.9}/* 背景颜色 */
        } );
    spriteY.center = new THREE.Vector2(0, 0);
    scene.add( spriteY );
    spriteY.position.set(0, 6, 0);

    var spriteX = makeTextSprite( "X",
        {
            fontsize: 20,
            borderColor: {r:255, g:0, b:0, a:0.4},/* 边框黑色 */
            backgroundColor: {r:255, g:255, b:255, a:0.9}/* 背景颜色 */
        } );
    spriteX.center = new THREE.Vector2(0, 0);
    scene.add( spriteX );
    spriteX.position.set(10, -5, 0);

    var spriteZ = makeTextSprite( "Z",
        {
            fontsize: 20,
            borderColor: {r:255, g:0, b:0, a:0.4},/* 边框黑色 */
            backgroundColor: {r:255, g:255, b:255, a:0.9}/* 背景颜色 */
        } );
    spriteZ.center = new THREE.Vector2(0, 0);
    scene.add( spriteZ );
    spriteZ.position.set(0, -5, 10);

}

// 创建字体精灵
function makeTextSprite(message, parameters) {

    if ( parameters === undefined ) parameters = {};

    var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";

    /* 字体大小 */
    var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 20;

    /* 边框厚度 */
    var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;

    /* 边框颜色 */
    var borderColor = parameters.hasOwnProperty("borderColor") ? parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };

    /* 背景颜色 */
    var backgroundColor = parameters.hasOwnProperty("backgroundColor") ? parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

    /* 创建画布 */
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.imageSmoothingQuality = "high";

    /* 字体加粗 */
    context.font = "Bold " + fontsize + "px " + fontface;

    /* 获取文字的大小数据，高度取决于文字的大小 */
    var metrics = context.measureText( message );
    var textWidth = metrics.width;

    /* 背景颜色 */
    context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";

    /* 边框的颜色 */
    context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";
    context.lineWidth = borderThickness;

    /* 绘制圆角矩形 */
    roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);

    /* 字体颜色 */
    context.fillStyle = "rgba(0, 0, 0, 1.0)";
    context.fillText( message, borderThickness, fontsize + borderThickness);

    /* 画布内容用于纹理贴图 */
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial({ map: texture } );
    var sprite = new THREE.Sprite( spriteMaterial );

    console.log(sprite.spriteMaterial);

    /* 缩放比例 */
    sprite.scale.set(10,5,0);

    return sprite;
}

// 绘制圆角矩形
function roundRect(ctx, x, y, w, h, r) {

    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

}

function init(){

    initScene();
    initCamera();
    initRender();
    initLight();
    initControls();

    addContent_1();
    addContent_2();

    window.addEventListener('resize',onWindowResize, false);
}




// 初始化加载
$(function () {

    console.log('three init start ...');
    init();
    animate();
    console.log('three init send ...');
});
