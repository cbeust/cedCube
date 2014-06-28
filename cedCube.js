
var PI_2 = 3.1415926 / 2;
var ANIMATE_INCREMENT = 0.01;

var faceGroup;
var allObjects = [];
var scene = new THREE.Scene();

var FRONT = {
    name: "F",
    accept: function(x,y,z) {
        return z == 1;
    },
    axis: new THREE.Vector3(0, 0, 1),
    sign: -1
};

var FRONT_PRIME = {
    name: "F'",
    accept: function(x,y,z) {
        return z == 1;
    },
    axis: new THREE.Vector3(0, 0, 1),
    sign: 1
};

var RIGHT = {
    name: "R",
    accept: function(x,y,z) {
        return x == 1;
    },
    axis: new THREE.Vector3(1, 0, 0),
    sign: -1
};

var RIGHT_PRIME = {
    name: "R'",
    accept: function(x,y,z) {
        return x == 1;
    },
    axis: new THREE.Vector3(1, 0, 0),
    sign: 1
};

var BACK = {
    name: "B",
    accept: function(x,y,z) {
        return z == -1;
    },
    axis: new THREE.Vector3(0, 0, 1),
    sign: 1
};

var BACK_PRIME = {
    name: "B'",
    accept: function(x,y,z) {
        return z == -1;
    },
    axis: new THREE.Vector3(0, 0, 1),
    sign: -1
};

var LEFT = {
    name: "L",
    accept: function(x,y,z) {
        return x == -1;
    },
    axis: new THREE.Vector3(1, 0, 0),
    sign: 1
};

var LEFT_PRIME = {
    name: "L'",
    accept: function(x,y,z) {
        return x == -1;
    },
    axis: new THREE.Vector3(1, 0, 0),
    sign: -1
};

var UP = {
    name: "U",
    accept: function(x,y,z) {
        return y == 1;
    },
    axis: new THREE.Vector3(0, 1, 0),
    sign: -1
};

var UP_PRIME = {
    name: "U'",
    accept: function(x,y,z) {
        return y == 1;
    },
    axis: new THREE.Vector3(0, 1, 0),
    sign: 1
};

var DOWN = {
    name: "D",
    accept: function(x,y,z) {
        return y == -1;
    },
    axis: new THREE.Vector3(0, 1, 0),
    sign: 1
};

var DOWN_PRIME = {
    name: "D'",
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

function addCubeToScene(scene) {
    clearScene();
    faceGroup = new THREE.Object3D();
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            for (var k = -1; k <= 1; k++) {
                var color = 0xff0000;
                var currentFace = facesToRotate.length > 0
                    ? facesToRotate[0]
                    : null;
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

var facesToRotate = [];
var rotateTarget = 0;

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
var renderer = new THREE.CanvasRenderer();

function animate() {
    if (rotateTarget > 0) {
        var currentFace = facesToRotate[0];
        console.log("Rotating " + currentFace.name);
        rotateTarget -= ANIMATE_INCREMENT;
        faceGroup.rotateOnAxis(currentFace.axis, ANIMATE_INCREMENT * currentFace.sign);
        requestAnimationFrame(animate);
    } else {
        facesToRotate.shift();
        if (facesToRotate.length > 0) {
            rotateTarget = PI_2;
        }
        faceGroup = null;
        addCubeToScene(scene);
    }
    renderer.render(scene, camera);
}

function rotateCube(face) {
    console.log("Rotating " + face.name);
    facesToRotate.push(face);
    rotateTarget = PI_2;
    addCubeToScene(scene);
    animate();
}

document.onkeydown = function() {
    var shift = window.event.shiftKey;
    var c = window.event.keyCode;
    switch (c) {
        case 66: // b
            rotateCube(shift ? BACK_PRIME : BACK);
            break;
        case 68: // b
            rotateCube(shift ? DOWN_PRIME : DOWN);
            break;
        case 70: // f
            rotateCube(shift ? FRONT_PRIME : FRONT);
            break;
        case 76: /// l
            rotateCube(shift ? LEFT_PRIME : LEFT);
            break;
        case 82: // r
            rotateCube(shift ? RIGHT_PRIME : RIGHT);
            break;
        case 85: // u
            rotateCube(shift ? UP_PRIME : UP);
            break;
        default:
            console.log("Key: " + c);
    }

};

function runCube() {
    camera.position.z = 500;

//    addCubeToScene(scene, null);

    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );

    rotateCube(FRONT);
    rotateCube(UP);
    rotateCube(RIGHT);
    rotateCube(FRONT_PRIME);
    rotateCube(UP_PRIME);
    rotateCube(RIGHT_PRIME);
    rotateCube(FRONT);
    rotateCube(UP);
    rotateCube(RIGHT);
    rotateCube(FRONT_PRIME);
    rotateCube(UP_PRIME);
    rotateCube(RIGHT_PRIME);
}
