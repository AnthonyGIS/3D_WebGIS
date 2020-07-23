/**

 @author Cheetah
 @date 2020-02-01 12:09
 */

import * as THREE from '../../LIB/three_js/build/three.module.js';
import Stats from '../../LIB/three_js/examples/jsm/libs/stats.module.js';
import { GUI } from '../../LIB/three_js/examples/jsm/libs/dat.gui.module.js';
import {OrbitControls} from "../../LIB/three_js/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from '../../LIB/three_js/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../../LIB/three_js/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from '../../LIB/three_js/examples/jsm/postprocessing/ShaderPass.js';
import { CopyShader } from '../../LIB/three_js/examples/jsm/shaders/CopyShader.js';
import { FXAAShader } from '../../LIB/three_js/examples/jsm/shaders/FXAAShader.js';

// fat、Dashed、simple line
import { Line2 } from '../../LIB/three_js/examples/jsm/lines/Line2.js';
import { LineMaterial } from '../../LIB/three_js/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from '../../LIB/three_js/examples/jsm/lines/LineGeometry.js';
import { GeometryUtils } from '../../LIB/three_js/examples/jsm/utils/GeometryUtils.js';




var camera, scene, render, clock, container,controls, group;
var stats,gui;
var composer1, composer2, fxaaPass;
var line_ww, line_simple, matLine, matLineBasic, matLineDashed;
var PT_TR, PT_BR, PT_BL, PT_TL, PT_CENTER, FOCUS_LENGTH = 8; //mm


// Three 基础使用的环境可视化
// ----------------------------------------------

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
    // noinspection JSValidateTypes
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

function initGui() {
    /**
     * 调试插件
     */

    gui = new GUI();

    var param = {
        'line type': 0,
        'width (px)': 5,
        'dashed': false,
        'dash scale': 1,
        'dash / gap': 1,
        // --------------
        'focus length':8.0,
        'sensor width': 4.80,
        'sensor height': 2.04
    };

    // line property setting
    initGUI_Line(gui,param);

    // camera property setting
    initGUI_CameraSimulate(gui,param);
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

    camera.aspect = container.offsetWidth / container.offsetHeight;
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


// 坐标轴添加
// -----------------------------------------------

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

    // 添加文字
    // addAxisText(scene);
}

// 坐标轴上的文字
function addAxisText(scene) {

    var sprite_para = {
        fontsize: 20,
        borderColor: {r: 255, g: 0, b: 0, a: 0.4},// 边框黑色
        backgroundColor: {r: 255, g: 255, b: 255, a: 0.9}// 背景颜色
    };
    var spriteOrigin = makeTextSprite(" ORI (0, 0, 0) ", sprite_para);
    spriteOrigin.center = new THREE.Vector2(0, 0);
    scene.add(spriteOrigin);
    spriteOrigin.position.set(0, -5, 0);

    var spriteY = makeTextSprite("Y", sprite_para);
    spriteY.center = new THREE.Vector2(0, 0);
    scene.add(spriteY);
    spriteY.position.set(0, 6, 0);

    var spriteX = makeTextSprite("X", sprite_para);
    spriteX.center = new THREE.Vector2(0, 0);
    scene.add(spriteX);
    spriteX.position.set(10, -5, 0);

    var spriteZ = makeTextSprite("Z", sprite_para);
    spriteZ.center = new THREE.Vector2(0, 0);
    scene.add(spriteZ);
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







// 相机模拟部分
// -----------------------------------------------
var video_plane_mesh;

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
    
    // add camera line
    addCameraViewObject(scene,new THREE.Vector3(-40,20,-10),FOCUS_LENGTH,4.80,2.04,
        10,0,0,0);


    // 添加半透明的面
    addTransparencyPlane(scene);
}

function initGUI_Line(gui,param) {

    var line_fat_setting_folder = gui.addFolder('LINE STYLE SET');

    line_fat_setting_folder.add( param, 'line type', { 'LineGeometry': 0, 'gl.LINE': 1 } ).onChange( function ( val ) {

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

    line_fat_setting_folder.add( param, 'width (px)', 1, 10 ).onChange( function ( val ) {

        matLine.linewidth = val;

    } );

    line_fat_setting_folder.add( param, 'dashed' ).onChange( function ( val ) {

        matLine.dashed = val;

        // dashed is implemented as a defines -- not as a uniform. this could be changed.
        // ... or THREE.LineDashedMaterial could be implemented as a separate material
        // temporary hack - renderer should do this eventually
        if ( val ) matLine.defines.USE_DASH = ""; else delete matLine.defines.USE_DASH;
        matLine.needsUpdate = true;

        line_simple.material = val ? matLineDashed : matLineBasic;

    } );

    line_fat_setting_folder.add( param, 'dash scale', 0.5, 2, 0.1 ).onChange( function ( val ) {

        matLine.dashScale = val;
        matLineDashed.scale = val;

    } );

    line_fat_setting_folder.add( param, 'dash / gap', { '2 : 1': 0, '1 : 1': 1, '1 : 2': 2 } ).onChange( function ( val ) {

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

    line_fat_setting_folder.close();
}


// todo: 添加半透明的面，以便显示相机成像区域。 2020.2.2 0034
// https://blog.csdn.net/kaimw2007/article/details/88418130
// DEV_WebGIS/Demos/ThreeJS/200131_HelloWord/webgl_materials_physical_transparency.html
function addTransparencyPlane(scene) {




}

/**
 * todo: 绘制相机的姿态、位置和放大后的贴纹理的图像
 * @param scene
 * @param camera_location
 * @param focus_length
 * @param sensor_w
 * @param sensor_h
 * @param image_display_scale 为了看清楚照片/视频图像，需要将其立方在较远处，比例是相对于焦距而言。
 * @param phi 俯仰角
 * @param omega 方位角
 * @param kappa 翻滚角
 */
function addCameraViewObject(scene, camera_location, focus_length, sensor_w, sensor_h,
                             image_display_scale = 10, phi = 0,omega = 0,kappa = 0) {



    var angle_h, angle_v, angle_h_half_rad, angle_v_half_rad; //°
    var image_aspect_half_w, image_aspect_half_h,image_aspect_to_core_distance;

    var tmp_r0, tmp_vec3_pt, optic_center_vec3_pt, tmp_model_obj;



    // add core position

    var geometry_optic_center = new THREE.Geometry();       //声明一个空几何体对象
    optic_center_vec3_pt = camera_location;                 //顶点1坐标
    geometry_optic_center.vertices.push(optic_center_vec3_pt);       //顶点坐标添加到geometry对象
    var tmp_material = new THREE.PointsMaterial({   //材质对象
        color:0xff00ff,
        size:1.0                                            //点对象像素尺寸
    });
    tmp_model_obj=new THREE.Points(geometry_optic_center,tmp_material);//点模型对象
    scene.add(tmp_model_obj);//点对象添加到场景中


    // construct model of camera

    angle_v = Math.atan(sensor_h/2/focus_length) * 2 / Math.PI * 180;
    angle_h = Math.atan(sensor_w/2/focus_length) * 2 / Math.PI * 180;
    angle_v_half_rad = angle_v / 2.0 / 180 * Math.PI;
    angle_h_half_rad = angle_h / 2.0 / 180 * Math.PI;
    image_aspect_to_core_distance = image_display_scale * focus_length;
    image_aspect_half_w = sensor_w/2*image_display_scale;
    image_aspect_half_h = sensor_h/2*image_display_scale;
    PT_TR = new THREE.Vector3(image_aspect_half_w + camera_location.x , image_aspect_half_h+ camera_location.y, -image_aspect_to_core_distance+ camera_location.z);
    PT_BR = new THREE.Vector3(image_aspect_half_w+ camera_location.x,-image_aspect_half_h+ camera_location.y,-image_aspect_to_core_distance+ camera_location.z);
    PT_BL = new THREE.Vector3(-image_aspect_half_w+ camera_location.x,-image_aspect_half_h+ camera_location.y,-image_aspect_to_core_distance+ camera_location.z);
    tmp_vec3_pt = new THREE.Vector3(-image_aspect_half_w,image_aspect_half_h,-image_aspect_to_core_distance);
    var T = new THREE.Matrix4();
    // T.set(
    //     1, 0, 0, camera_location.x,
    //     0, 1, 0, camera_location.y,
    //     0, 0, 1, camera_location.z,
    //     0, 0, 0, 1
    // );
    T.makeTranslation(camera_location.x, camera_location.y, camera_location.z);
    PT_TL = tmp_vec3_pt.clone().applyMatrix4(T);

    PT_CENTER = new THREE.Vector3(0 + camera_location.x , 0 + camera_location.y, -image_aspect_to_core_distance+ camera_location.z);



    // add camera line
    addLine(scene,camera_location,PT_TR);
    addLine(scene,camera_location,PT_BR);
    addLine(scene,camera_location,PT_BL);
    addLine(scene,camera_location,PT_TL);

    // todo: change direction （change the pts location）
    // ...

}


function addLine(scene, pt1,pt2, color=0x00ffff) {
    var tmp_geometry_line = new THREE.Geometry();  // 声明一个几何体geometry
    tmp_geometry_line.vertices.push(pt1);
    tmp_geometry_line.vertices.push(pt2);
    var tmp_material  = new THREE.LineBasicMaterial( { color: color } );  // 定义线条的材料，接收字典类型的参数
    var tmp_line = new THREE.Line( tmp_geometry_line, tmp_material);  // 根据材料创建线条
    scene.add(tmp_line);
}


// todo: 添加GeoJSON或SHP到场景地图中。
// 2020.2.2 0031
// REF: https://www.cnblogs.com/gaozhiqiang/p/11456068.html
// https://www.lizenghai.com/archives/47007.html
function addGeoJSON(scene, data) {
    // ...

}

// todo: 计算向量和平面相交的计算事件。
// 2020.2.2 0031
function calVecPlaneIntersectEvent() {
    // ...

}

// todo: 拾取
// 用于拾取传感器相机坐标系下，图像上的某个点。
// https://blog.csdn.net/ruangong1203/article/details/60476621
// https://blog.csdn.net/weixin_30532987/article/details/95765260
// https://github.com/lihuiyang99/liHuiYang.github.io/issues/7
function pickupObjects() {


}

function initVideoShow(scene) {

    var video_width = Math.sqrt((PT_BL.x - PT_BR.x)*(PT_BL.x - PT_BR.x)+(PT_BL.y - PT_BR.y)*(PT_BL.y - PT_BR.y)+(PT_BL.z - PT_BR.z)*(PT_BL.z - PT_BR.z));
    var video_height = Math.sqrt((PT_TR.x - PT_BR.x)*(PT_TR.x - PT_BR.x)+(PT_TR.y - PT_BR.y)*(PT_TR.y - PT_BR.y)+(PT_TR.z - PT_BR.z)*(PT_TR.z - PT_BR.z));
    var video_plane_geometry = new THREE.PlaneGeometry(video_width, video_height);
    var material = new THREE.MeshPhongMaterial();
    material.side = THREE.DoubleSide; // THREE.FrontSide、THREE.DoubleSide;
    video_plane_mesh = new THREE.Mesh(video_plane_geometry, material);
    video_plane_mesh.position.set(PT_CENTER.x,PT_CENTER.y,PT_CENTER.z);
    scene.add(video_plane_mesh);

    var video = document.getElementById('video');
    var texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;

    material.map = texture;
}

function initGUI_CameraSimulate(gui,param){

    var camera_pos_setting_folder = gui.addFolder('CAMERA POS SET (mm、°)');

    camera_pos_setting_folder.add( param, 'focus length',1.0,100.0).onChange(function (val) {
        FOCUS_LENGTH = val;
        video_plane_mesh.position.z = -FOCUS_LENGTH;
    });
    camera_pos_setting_folder.add( param, 'sensor width',0.10,20.00).onChange(function (val) {

    });
    camera_pos_setting_folder.add( param, 'sensor height',0.10,10.00).onChange(function (val) {

    });
    camera_pos_setting_folder.open();
}





// main start
// ----------------------------------------------------


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
    initCameraLines(scene);
    initVideoShow(scene);
    initGui();

    animate();
});