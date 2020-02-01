/**

 @author Cheetah
 @date 2020-02-01 12:09
 */

import * as THREE from '../../../LIB/three_js/build/three.module.js';
import Stats from '../../../LIB/three_js/examples/jsm/libs/stats.module.js';
import { GUI } from '../../../LIB/three_js/examples/jsm/libs/dat.gui.module.js';
import {OrbitControls} from "../../../LIB/three_js/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from '../../../LIB/three_js/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../../../LIB/three_js/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from '../../../LIB/three_js/examples/jsm/postprocessing/ShaderPass.js';
import { CopyShader } from '../../../LIB/three_js/examples/jsm/shaders/CopyShader.js';
import { FXAAShader } from '../../../LIB/three_js/examples/jsm/shaders/FXAAShader.js';

// fat、Dashed、simple line
import { Line2 } from '../../../LIB/three_js/examples/jsm/lines/Line2.js';
import { LineMaterial } from '../../../LIB/three_js/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from '../../../LIB/three_js/examples/jsm/lines/LineGeometry.js';
import { GeometryUtils } from '../../../LIB/three_js/examples/jsm/utils/GeometryUtils.js';




var camera, scene, render, clock, container,controls, group;
var stats,gui;
var composer1, composer2, fxaaPass;
var line_ww, line_simple, matLine, matLineBasic, matLineDashed;



function initEnv() {
    // env
    container = document.getElementById( 'container' );
    clock = new THREE.Clock();

    // scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );
    scene.fog = new THREE.Fog( 0xcccccc, 100, 1500 );

    // camera
    camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight, 0.1, 10000);
    camera.position.set(200, 150, 200);
    // noinspection JSCheckFunctionSignatures
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // 性能插件
    stats = createStatus();
}

function initLight(scene) {
    
    // 光照
    var hemi_light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    hemi_light.position.set( 0, 1000, 0 );
    scene.add( hemi_light );

    var dirLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
    dirLight.position.set( - 3000, 1000, - 1000 );
    scene.add( dirLight );

    // // create ambient light
    // var ambient_light = new THREE.AmbientLight(0x404040);
    // scene.add(ambient_light);
    //
    // // add spot light
    // var spot_light = new THREE.SpotLight(0xcccccc);
    // spot_light.position.set(-100,300,10);
    // scene.add(spot_light);

}

function initRender() {

    render = new THREE.WebGLRenderer();
    render.autoClear = false;
    render.setPixelRatio( window.devicePixelRatio );
    render.setSize( container.offsetWidth, container.offsetHeight );
    container.appendChild( render.domElement );

}

function initControls(){
    controls =  new OrbitControls(camera, render.domElement);
}

function createStatus() {
    /**
     * 性能插件
     * @type {{REVISION: number, domElement: HTMLDivElement, ms: (function(): number), setMode: setMode, fps: (function(): number), update: update, end: (function(): number), begin: begin}}
     */
    var stats = new Stats();
    container.appendChild(stats.domElement); // document.body.appendChild(stats.domElement);
    return stats;
}

function updateStatus() {
    // noinspection JSValidateTypes
    /**
     * 数据更新
     */
    stats.update();
}

function initEvent(func_window_resize) {
    window.addEventListener( 'resize', func_window_resize, false );
}



// part one demo
// ----------------------------------------------

function initFXAA_COPY(scene,camera,render) {

    var renderPass = new RenderPass( scene, camera );

    // fxaa
    fxaaPass = new ShaderPass( FXAAShader );
    var pixelRatio = render.getPixelRatio();
    fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( container.offsetWidth * pixelRatio );
    fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( container.offsetHeight * pixelRatio );

    composer1 = new EffectComposer( render );
    composer1.addPass( renderPass );
    composer1.addPass( fxaaPass );

    // copy
    var copyPass = new ShaderPass( CopyShader );
    composer2 = new EffectComposer( render );
    composer2.addPass( renderPass );
    composer2.addPass( copyPass );
}

function onWindowResize2() {

    camera.aspect = ( container.offsetWidth * 0.5 ) / container.offsetHeight;
    camera.updateProjectionMatrix();

    render.setSize( container.offsetWidth, container.offsetHeight );
    composer1.setSize( container.offsetWidth, container.offsetHeight );
    composer2.setSize( container.offsetWidth, container.offsetHeight );

    var pixelRatio = render.getPixelRatio();
    fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( container.offsetWidth * pixelRatio );
    fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( container.offsetHeight * pixelRatio );
}

function animate2() {

    requestAnimationFrame( animate2 );

    var halfWidth = container.offsetWidth / 2;
    group.rotation.y += clock.getDelta() * 0.1;

    render.setViewport( 0, 0, halfWidth, container.offsetHeight );
    composer1.render();

    render.setViewport( halfWidth, 0, halfWidth, container.offsetHeight );
    composer2.render();

    // update performance plugin
    updateStatus();
}

function initObjects2(scene) {

    group = new THREE.Group();
    var geometry = new THREE.TetrahedronBufferGeometry( 10 );
    var material = new THREE.MeshStandardMaterial( { color: 0xee0808, flatShading: true } );
    for ( var i = 0; i < 100; i ++ ) {

        var mesh = new THREE.Mesh( geometry, material );

        mesh.position.x = Math.random() * 500 - 250;
        mesh.position.y = Math.random() * 500 - 250;
        mesh.position.z = Math.random() * 500 - 250;

        mesh.scale.setScalar( Math.random() * 2 + 1 );

        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        mesh.rotation.z = Math.random() * Math.PI;

        group.add( mesh );

    }
    scene.add( group );
}



// part two, map and camera simulate
// ----------------------------------------------
function initFXAA_CUBE(scene,camera,render) {

    var renderPass = new RenderPass( scene, camera );

    // fxaa
    fxaaPass = new ShaderPass( FXAAShader );
    var pixelRatio = render.getPixelRatio();
    fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( container.offsetWidth * pixelRatio );
    fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( container.offsetHeight * pixelRatio );

    composer1 = new EffectComposer( render );
    composer1.addPass( renderPass );
    composer1.addPass( fxaaPass );
}

function onWindowResize() {

    camera.aspect = ( container.offsetWidth * 0.5 ) / container.offsetHeight;
    camera.updateProjectionMatrix();

    render.setSize( container.offsetWidth, container.offsetHeight );
    composer1.setSize( container.offsetWidth, container.offsetHeight );

    var pixelRatio = render.getPixelRatio();
    fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( container.offsetWidth * pixelRatio );
    fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( container.offsetHeight * pixelRatio );
}

function animate() {

    requestAnimationFrame( animate );

    render.setViewport( 0, 0, container.offsetWidth, container.offsetHeight );
    matLine.resolution.set( window.innerWidth, window.innerHeight ); // resolution of the viewport
    composer1.render();

    // update performance plugin
    updateStatus();
}

function initObjects(scene)
{
    // add plane
    var plane_geometry = new THREE.PlaneGeometry(200,400);
    var plane_material = new THREE.MeshLambertMaterial({color:0xcccccc}); //  new THREE.MeshLambertMaterial({color:0xcccccc});
    var plane = new THREE.Mesh(plane_geometry,plane_material);
    // rotate 90° under axis x
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(-20,-20,-160);
    scene.add(plane);

    // add cube
    var cube_geometry = new THREE.CubeGeometry(50,50,50);
    // ------------------------------------
    // cube material and face color
    // var cube_material = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff, flatShading: true } ); // 每个面的颜色都相同
    for ( var i = 0; i < cube_geometry.faces.length; i += 2 ) {
        var hex = Math.random() * 0xffffff;
        cube_geometry.faces[ i ].color.setHex( hex );
        cube_geometry.faces[ i + 1 ].color.setHex( hex );
    }
    var cube_material = new THREE.MeshBasicMaterial({vertexColors:THREE.FaceColors});
    // ------------------------------------
    var cube_mesh = new THREE.Mesh(cube_geometry,cube_material);
    cube_mesh.position.set(30,10,-30);
    cube_mesh.castShadow = true;
    scene.add(cube_mesh);
}


// 坐标轴原点
function addAxisLabel(scene) {

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


function initCameraLines(scene)
{

    var positions = [];
    var colors = [];
    var camera_location = new THREE.Vector3(-10,30,-20);

    // Position and THREE.Color Data

    var points = GeometryUtils.hilbert3D( new THREE.Vector3( 0, 0, 0 ), 10.0, 1, 0, 1, 2, 3, 4, 5, 6, 7 );
    var spline = new THREE.CatmullRomCurve3( points );
    var divisions = Math.round( 12 * points.length );
    var color = new THREE.Color();

    for ( var i = 0, l = divisions; i < l; i ++ ) {

        var point = spline.getPoint( i / l );
        positions.push( point.x, point.y, point.z );

        color.setHSL( i / l, 1.0, 0.5 );
        colors.push( color.r, color.g, color.b );

    }


    // Line2 ( LineGeometry, LineMaterial )

    var geometry = new LineGeometry();
    geometry.setPositions( positions );
    geometry.setColors( colors );
    geometry.translate(camera_location.x,camera_location.y,camera_location.z);

    matLine = new LineMaterial( {
        color: 0xffffff,
        linewidth: 5, // in pixels
        vertexColors: THREE.VertexColors,
        //resolution:  // to be set by renderer, eventually
        dashed: false
    } );

    line_ww = new Line2( geometry, matLine );
    line_ww.computeLineDistances();
    line_ww.scale.set( 1, 1, 1 );
    scene.add( line_ww );




    // THREE.Line ( THREE.BufferGeometry, THREE.LineBasicMaterial ) - rendered with gl.LINE_STRIP

    var geo = new THREE.BufferGeometry();
    geo.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
    geo.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
    geo.translate(camera_location.x,camera_location.y,camera_location.z);

    matLineBasic = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors } );
    matLineDashed = new THREE.LineDashedMaterial( { vertexColors: THREE.VertexColors, scale: 2, dashSize: 1, gapSize: 1 } );

    line_simple = new THREE.Line( geo, matLineBasic );
    line_simple.computeLineDistances();
    line_simple.visible = false;
    scene.add( line_simple );
}

function initVideoShow(scene) {

    var planeGeometry = new THREE.PlaneGeometry(20, 10);
    var material = new THREE.MeshPhongMaterial();
    material.side = THREE.FrontSide; // THREE.DoubleSide;
    var mesh = new THREE.Mesh(planeGeometry, material);
    mesh.position.set(-20,10,-10);
    scene.add(mesh);

    var video = document.getElementById('video');
    var texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;

    material.map = texture;
}





// 调试插件
function initGui() {

    gui = new GUI();

    var param = {
        'line type': 0,
        'width (px)': 5,
        'dashed': false,
        'dash scale': 1,
        'dash / gap': 1
    };

    gui.add( param, 'line type', { 'LineGeometry': 0, 'gl.LINE': 1 } ).onChange( function ( val ) {

        switch ( val ) {
            case '0':
                line_ww.visible = true;
                line_simple.visible = false;
                break;
            case '1':
                line_ww.visible = false;
                line_simple.visible = true;
                break;
        }
    } );

    gui.add( param, 'width (px)', 1, 10 ).onChange( function ( val ) {

        matLine.linewidth = val;

    } );

    gui.add( param, 'dashed' ).onChange( function ( val ) {

        matLine.dashed = val;

        // dashed is implemented as a defines -- not as a uniform. this could be changed.
        // ... or THREE.LineDashedMaterial could be implemented as a separate material
        // temporary hack - renderer should do this eventually
        if ( val ) matLine.defines.USE_DASH = ""; else delete matLine.defines.USE_DASH;
        matLine.needsUpdate = true;

        line_simple.material = val ? matLineDashed : matLineBasic;

    } );

    gui.add( param, 'dash scale', 0.5, 2, 0.1 ).onChange( function ( val ) {

        matLine.dashScale = val;
        matLineDashed.scale = val;

    } );

    gui.add( param, 'dash / gap', { '2 : 1': 0, '1 : 1': 1, '1 : 2': 2 } ).onChange( function ( val ) {

        switch ( val ) {

            case '0':
                matLine.dashSize = 2;
                matLine.gapSize = 1;

                matLineDashed.dashSize = 2;
                matLineDashed.gapSize = 1;

                break;

            case '1':
                matLine.dashSize = 1;
                matLine.gapSize = 1;

                matLineDashed.dashSize = 1;
                matLineDashed.gapSize = 1;

                break;

            case '2':
                matLine.dashSize = 1;
                matLine.gapSize = 2;

                matLineDashed.dashSize = 1;
                matLineDashed.gapSize = 2;

                break;

        }

    } );

}


$(function () {

    initEnv();
    initLight(scene);
    initRender();
    initControls();

    // ---------------------------------------------
    //initFXAA_COPY(scene,camera,render);
    //initEvent(onWindowResize2);

    //initObjects2(scene);
    // 开启动画
    //animate2();

    // ---------------------------------------------
    initFXAA_CUBE(scene,camera,render);
    initEvent(onWindowResize);
    initObjects(scene);
    addAxisLabel(scene);
    initVideoShow(scene);
    initCameraLines(scene);
    initGui();

    animate();
});