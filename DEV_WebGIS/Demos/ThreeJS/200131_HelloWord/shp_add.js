/**

 @author Cheetah
 @date 2020-01-31 23:18
 */

var scene, camera, renderer, pointlight, obrcontrol, transfromcotl;
var centerpoint = new THREE.Vector3(13893245.488948211, 0, 8625544); //偏移中心点
var objects = [];// 选择集合
var guiCtr;
var stats;

var PipeColor = 0x0000ff;
var MaholeColor = 0X00acac;
var SelectColor = 0x00ff00;

function InitScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 99999);
    camera.lookAt(new THREE.Vector3(-5000, 0, 0));
    camera.position.x = -2500;
    camera.position.y = 2000;
    camera.position.z = 2000;

    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("three_canvas"),
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;

    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(20, 200, 20);
    light.position.multiplyScalar(1.3);

    scene.add(light);
    scene.add(new THREE.AmbientLight(0x333333));
    pointlight = new THREE.PointLight(0xffffff);
    scene.add(pointlight);
    obrcontrol = new THREE.OrbitControls(camera, renderer.domElement);
    obrcontrol.target = new THREE.Vector3(-2500, 0, 0);

    var asix = new THREE.AxisHelper(500);
    scene.add(asix);
}


function render() {
    obrcontrol.update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    stats.update();
}


function AddSky() {
    var sky = new THREE.Sky();
    sky.scale.setScalar(100000);
    scene.add(sky);
    var uniforms = sky.material.uniforms;
    uniforms.turbidity.value = 10;
    uniforms.rayleigh.value = 2;
    uniforms.luminance.value = 1;
    uniforms.mieCoefficient.value = 0.005;
    uniforms.mieDirectionalG.value = 0.8;


    var parameters = {
        distance: 200,
        inclination: 0.45,
        azimuth: 0.125
    };

    var theta = Math.PI * (parameters.inclination - 0.5);
    var phi = 2 * Math.PI * (parameters.azimuth - 0.5);

    pointlight.position.x = parameters.distance * Math.cos(phi);
    pointlight.position.y = parameters.distance * Math.sin(phi) * Math.sin(theta);
    pointlight.position.z = parameters.distance * Math.sin(phi) * Math.cos(theta);

    sky.material.uniforms.sunPosition.value = pointlight.position.copy(pointlight.position);

}


function AddTranCtr() {
    transfromcotl = new THREE.TransformControls(camera, renderer.domElement);
    transfromcotl.visible = false;
    scene.add(transfromcotl);
    renderer.domElement.addEventListener("click", onDocumentMouseDown, false);
}

function onDocumentMouseDown(e) {
    e.preventDefault();
    var mouse = new THREE.Vector2();
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    //新建一个三维单位向量 假设z方向就是0.5
    //根据照相机，把这个向量转换到视点坐标系
    var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);

    //在视点坐标系中形成射线,射线的起点向量是照相机， 射线的方向向量是照相机到点击的点，这个向量应该归一标准化。
    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

    //射线和模型求交，选中一系列直线
    var intersects = raycaster.intersectObjects(objects);
    if (transfromcotl.object) {
        if (transfromcotl.object.attributes.hasOwnProperty("FLID")) {
            transfromcotl.object.material.color.setHex(0x0000ff);
        } else if (transfromcotl.object.attributes.hasOwnProperty("FNID")) {
            transfromcotl.object.material.color.setHex(0x00acac);
        }
    }

    if (intersects.length > 0) {
        //  SELECTED = intersects[0].object;
        //选中第一个射线相交的物体
        var intersected = intersects[0].object;
        console.log(intersected.attributes);
        // console.log(intersects[0].object)
        // var mat =  new THREE.MeshLambertMaterial({color:0x00ff00});
        intersected.material.color.setHex(SelectColor);
        transfromcotl.attach(intersected);
    } else {
        transfromcotl.detach(transfromcotl.object);
    }

}

function AddPipe() {

    require(["esri/map", "esri/tasks/QueryTask", "esri/tasks/query", "esri/tasks/FindTask",
        "esri/tasks/FindParameters"], function (Map, QueryTask, Query, FindTask, FindParameters) {
        var pipeurl = "http://localhost:6080/arcgis/rest/services/QA/MapServer/14";
        var queryTask = new QueryTask(pipeurl);
        var query = new Query();
        query.returnGeometry = true;
        query.outFields = ["*"];
        query.where = "1=1";
        queryTask.execute(query, function (res) {
            res.features.map(function (v) {
                createPipeMesh(v.geometry.paths[0][0][0] - centerpoint.x, 5, v.geometry.paths[0][0][1] - centerpoint.z,
                    v.geometry.paths[0][1][0] - centerpoint.x, 5, v.geometry.paths[0][1][1] - centerpoint.z, v.attributes)
            })

        })

    })
}

function createPipeMesh(x1, y1, z1, x2, y2, z2, attributes) {
    // var Color = 0x0000ff;
    var radius = 4;
    var x0 = (x1 + x2) / 2;
    var y0 = (y1 + y2) / 2;
    var z0 = (z1 + z2) / 2;
    var p1 = new THREE.Vector3(x1, y1, z1);
    var p2 = new THREE.Vector3(x2, y2, z2);
    var length = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) + (z1 - z2) * (z1 - z2));
    var material = new THREE.MeshLambertMaterial({color: PipeColor});
    var geometry = new THREE.CylinderGeometry(radius, radius, length);


    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x0, y0, z0);
    mesh.lookAt(p2);
    mesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    mesh.attributes = attributes;

    mesh.castShadow = true;
    var obj = new THREE.Object3D();
    obj.position.set(0, 0, 0);
    obj.add(mesh);
    obj.rotation.y = Math.PI;
    obj.rotation.z = Math.PI;

    scene.add(obj);
    objects.push(mesh)
}

function AddMahole() {
    require(["esri/map", "esri/tasks/QueryTask", "esri/tasks/query", "esri/tasks/FindTask",
        "esri/tasks/FindParameters"], function (Map, QueryTask, Query, FindTask, FindParameters) {
        var pipeurl = "http://localhost:6080/arcgis/rest/services/QA/MapServer/3";
        var queryTask = new QueryTask(pipeurl);
        var query = new Query();
        query.returnGeometry = true;
        query.outFields = ["*"];
        query.where = "1=1";
        queryTask.execute(query, function (res) {


            res.features.map(function (v) {

                createMaholeMesh(v.geometry.x - centerpoint.x, 5, v.geometry.y - centerpoint.z, v.attributes)

            })


        })

    })
}

function createMaholeMesh(x, y, z, attributes) {
    // var Color = 0x00acac;
    var radius = 10;
    var length = 15;
    var material = new THREE.MeshLambertMaterial({color: MaholeColor});
    var geometry = new THREE.CylinderGeometry(radius, radius, length);
    var mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);
    mesh.attributes = attributes;
    mesh.castShadow = true;
    var obj = new THREE.Object3D();
    obj.position.set(0, 0, 0);
    obj.add(mesh);
    obj.rotation.y = Math.PI;
    obj.rotation.z = Math.PI;

    scene.add(obj);
    objects.push(mesh);

}

function AddDatGui() {
    guiCtr = new function () {
        this.dampingFactor = 0.25;
    };
    var gui = new dat.GUI();
    gui.add(guiCtr, "dampingFactor", 0, 1);
}


function AddState() {
    stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms
    document.getElementById("Stats-output").appendChild(stats.domElement);
}

InitScene();
AddDatGui();
AddState();
render();
AddTranCtr();
AddSky();
AddPipe();
AddMahole();