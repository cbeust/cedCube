
var xDelta = 0.01;
var yDelta = 0.00;
var zDelta = 0.00;

var ANIMATE_INCREMENT = 0.02;

var allObjects = [];
var faceGroup;
var scene = new THREE.Scene();

var FRONT = {
    accept: function(x,y,z) {
        return z == 1;
    },
    axis: new THREE.Vector3(0, 0, 1),
    sign: -1
};

var FRONT_PRIME = {
    accept: function(x,y,z) {
        return z == 1;
    },
    axis: new THREE.Vector3(0, 0, 1),
    sign: 1
};

var RIGHT = {
    accept: function(x,y,z) {
        return x == 1;
    },
    axis: new THREE.Vector3(1, 0, 0),
    sign: -1
};

var RIGHT_PRIME = {
    accept: function(x,y,z) {
        return x == 1;
    },
    axis: new THREE.Vector3(1, 0, 0),
    sign: 1
};

var BACK = {
    accept: function(x,y,z) {
        return z == -1;
    },
    axis: new THREE.Vector3(0, 0, 1),
    sign: 1
};

var BACK_PRIME = {
    accept: function(x,y,z) {
        return z == -1;
    },
    axis: new THREE.Vector3(0, 0, 1),
    sign: -1
};

var LEFT = {
    accept: function(x,y,z) {
        return x == -1;
    },
    axis: new THREE.Vector3(1, 0, 0),
    sign: 1
};

var LEFT_PRIME = {
    accept: function(x,y,z) {
        return x == -1;
    },
    axis: new THREE.Vector3(1, 0, 0),
    sign: -1
};

var UP = {
    accept: function(x,y,z) {
        return y == 1;
    },
    axis: new THREE.Vector3(0, 1, 0),
    sign: -1
};

var UP_PRIME = {
    accept: function(x,y,z) {
        return y == 1;
    },
    axis: new THREE.Vector3(0, 1, 0),
    sign: 1
};

var DOWN = {
    accept: function(x,y,z) {
        return y == -1;
    },
    axis: new THREE.Vector3(0, 1, 0),
    sign: 1
};

var DOWN_PRIME = {
    accept: function(x,y,z) {
        return y == -1;
    },
    axis: new THREE.Vector3(0, 1, 0),
    sign: -1
};

function clearScene() {
    var obj, i;
    for ( i = allObjects.length - 1; i >= 0 ; i -- ) {
        scene.remove(allObjects[i]);
    }
    allObjects = [];
    cubes = [];
}

function addCubeToScene(scene, currentFace) {
    clearScene();
    faceGroup = new THREE.Object3D();
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            for (var k = -1; k <= 1; k++) {
                var color = 0xff0000;
                if (currentFace != null && currentFace.accept(i, j, k)) {
                    color = 0x0000ff;
                }
                var cube = createOneCube(i * 100, j * 100, k * 100, color);
                if (currentFace != null && currentFace.accept(i, j, k)) {
                    faceGroup.add(cube);
                } else {
                    scene.add(cube);
                    allObjects.push(cube);
                }
            }
        }
    }
    if (faceGroup.children.length > 0) {
        scene.add(faceGroup);
        allObjects.push(faceGroup);
    }

    console.log("All objects: " + allObjects.length);
}

function createOneCube(x, y, z, color) {
    var geometry = new THREE.BoxGeometry(50, 50, 50);
    var material = new THREE.MeshBasicMaterial( { color: color, wireframe: true } );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position = new THREE.Vector3(x, y, z);
    return mesh;
}

var currentFace = null;
var rotateTarget = 0;

var ANIMATE_INCREMENT = 0.05;

document.onkeydown = function() {
    var shift = window.event.shiftKey;
    var c = window.event.keyCode;
    switch (c) {
        case 66: // b
            currentFace = shift ? BACK_PRIME : BACK;
            rotateTarget = 3.14/2;
            addCubeToScene(scene, currentFace);
            break;
        case 68: // b
            currentFace = shift ? DOWN_PRIME : DOWN;
            rotateTarget = 3.14/2;
            addCubeToScene(scene, currentFace);
            break;
        case 70: // f
            currentFace = shift ? FRONT_PRIME : FRONT;
            rotateTarget = 3.14/2;
            addCubeToScene(scene, currentFace);
            break;
        case 72: // h
            xDelta -= 0.01;
            break;
        case 75: /// k
            xDelta += 0.01;
            break;
        case 76: /// l
            currentFace = shift ? LEFT_PRIME : LEFT;
            rotateTarget = 3.14/2;
            addCubeToScene(scene, currentFace);
            break;
        case 73: // m
            yDelta -= 0.01;
            break;
        case 77: // i
            yDelta += 0.01;
            break;
        case 82: // r
            currentFace = shift ? RIGHT_PRIME : RIGHT;
            rotateTarget = 3.14/2;
            addCubeToScene(scene, currentFace);
            break;
        case 85: // u
            currentFace = shift ? UP_PRIME : UP;
            rotateTarget = 3.14/2;
            addCubeToScene(scene, currentFace);
            break;
        default:
            console.log("Key: " + c);
    }

};

function runCube() {
    var camera, renderer;
    var colors = [ 0xff0000, 0x00ff00, 0x0000ff];

    init();
    animate();

    function init() {
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 500;

        addCubeToScene(scene, null);

        renderer = new THREE.CanvasRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );

        document.body.appendChild( renderer.domElement );

    }

    function animate() {
        if (faceGroup.children.length > 0) {
            if (rotateTarget > 0) {
                rotateTarget -= ANIMATE_INCREMENT;
                var axis = currentFace.axis;
                //            rad += radIncrement;
                faceGroup.rotateOnAxis(axis, ANIMATE_INCREMENT * currentFace.sign);
//                console.log("Rotation: " + faceGroup.rotation.x
//                    + "," + faceGroup.rotation.y
//                    + "," + faceGroup.rotation.z);

                //            faceGroup.rotation.x += xDelta;
                //            faceGroup.rotation.y += yDelta;
            } else {
                faceGroup = null;
                addCubeToScene(scene, null);
            }
        }
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
    }
}
