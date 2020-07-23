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


//创建ShaderMaterial纹理的函数
//https://www.cnblogs.com/eco-just/p/11181210.html
function createMaterial(vshaders_id,fshaders_id) {
    var vertShader = document.getElementById(vshaders_id).innerHTML; //获取顶点着色器的代码
    var fragShader = document.getElementById(fshaders_id).innerHTML;     // 获取片元着色器的代码

    //配置着色器里面的attribute变量的值
    var attributes = {};
    //配置着色器里面的uniform变量的值
    var uniforms = {
        scale: {type: 'f', value: 10},
        resolution: {type: "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight)}
    };
    var meshMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        defaultAttributeValues : attributes,
        vertexShader: vertShader,
        fragmentShader: fragShader,
        transparent: true
    });
    return meshMaterial;
}

function addContent_2_plane(scene){
    var planeGeometry = new THREE.PlaneGeometry(300,150);
    /*var meshMaterial = new THREE.MeshPhongMaterial({
        color: 0xfff000 * Math.random()
    });*/
    var meshMaterial = createMaterial("vertex_shader", "fragment_shader_3");
    var plane = new THREE.Mesh(planeGeometry,meshMaterial);
    plane.position.set(-30,20,-80);
    scene.add(plane);
}


function init(){

    initScene();
    initCamera();
    initRender();
    initLight();
    initControls();

    addContent_1();
    addContent_2_plane(scene);

    window.addEventListener('resize',onWindowResize, false);
}




// 初始化加载
$(function () {

    console.log('three init start ...');
    init();
    animate();
    console.log('three init send ...');
});
