// 键盘控制
// -------------------------------------------------------------------------------------------
//var viewer = new Cesium.Viewer('cesiumContainer');
//var scene = viewer.scene;

var canvas = viewer.canvas;
canvas.setAttribute('tabindex', '0'); // needed to put focus on the canvas
canvas.onclick = function () {
    canvas.focus();
};

var _startMousePosition;
var _mousePosition;
var _flags = {
    looking: false,
    moveForward: false,
    moveBackward: false,
    moveUp: false,
    moveDown: false,
    moveLeft: false,
    moveRight: false
};
var ellipsoid = viewer.scene.globe.ellipsoid;


// cesium事件的设置
// -----------------------------------------------------------------------------
//disable the default event handlers
scene.screenSpaceCameraController.enableRotate = false;
scene.screenSpaceCameraController.enableTranslate = false;
scene.screenSpaceCameraController.enableZoom = false;
scene.screenSpaceCameraController.enableTilt = false;
scene.screenSpaceCameraController.enableLook = false;

// 设置新的事件
var handler = new Cesium.ScreenSpaceEventHandler(canvas);
handler.setInputAction(function (movement) {
    _flags.looking = true;
    _mousePosition = _startMousePosition = Cesium.Cartesian3.clone(movement.position);
}, Cesium.ScreenSpaceEventType.LEFT_DOWN);

handler.setInputAction(function (movement) {
    _mousePosition = movement.endPosition;
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

handler.setInputAction(function (position) {
    _flags.looking = false;
}, Cesium.ScreenSpaceEventType.LEFT_UP);
// -----------------------------------------------------------------------------


// JS原生函数执行对键盘的监听
function getFlagForKeyCode(keyCode) {
    switch (keyCode) {
        case 'W'.charCodeAt(0):
            return 'moveForward';
        case 'S'.charCodeAt(0):
            return 'moveBackward';
        case 'Q'.charCodeAt(0):
            return 'moveUp';
        case 'E'.charCodeAt(0):
            return 'moveDown';
        case 'D'.charCodeAt(0):
            return 'moveRight';
        case 'A'.charCodeAt(0):
            return 'moveLeft';
        default:
            return undefined;
    }
}
document.addEventListener('keydown', function (e) {
    var flagName = getFlagForKeyCode(e.keyCode);
    if (typeof flagName !== 'undefined') {
        _flags[flagName] = true;
    }
}, false);
document.addEventListener('keyup', function (e) {
    var flagName = getFlagForKeyCode(e.keyCode);
    if (typeof flagName !== 'undefined') {
        _flags[flagName] = false;
    }
}, false);

// 定时器执行操作
viewer.clock.onTick.addEventListener(function (clock) {
    var camera = viewer.camera;

    if (_flags.looking) {
        var width = canvas.clientWidth;
        var height = canvas.clientHeight;

        // Coordinate (0.0, 0.0) will be where the mouse was clicked.
        var x = (_mousePosition.x - _startMousePosition.x) / width;
        var y = -(_mousePosition.y - _startMousePosition.y) / height;

        var lookFactor = 0.05;
        camera.lookRight(x * lookFactor);
        camera.lookUp(y * lookFactor);
    }

    // Change movement speed based on the distance of the camera to the surface of the ellipsoid.

    var cameraHeight = ellipsoid.cartesianToCartographic(camera.position).height;
    var moveRate = cameraHeight / 100.0;

    if (_flags.moveForward) {
        camera.moveForward(moveRate);
    }
    if (_flags.moveBackward) {
        camera.moveBackward(moveRate);
    }
    if (_flags.moveUp) {
        camera.moveUp(moveRate);
    }
    if (_flags.moveDown) {
        camera.moveDown(moveRate);
    }
    if (_flags.moveLeft) {
        camera.moveLeft(moveRate);
    }
    if (_flags.moveRight) {
        camera.moveRight(moveRate);
    }

});
