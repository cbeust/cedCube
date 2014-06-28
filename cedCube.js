
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
    var cubitIndex = 0;
    for (var z = -1; z <= 1; z++) {
        for (var y = 1; y >= -1; y--) {
            for (var x = -1; x <= 1; x++) {
                var currentFace = facesToRotate.length > 0
                    ? facesToRotate[0]
                    : null;
                var cube = createOneCubit(x * 100, y * 100, z * 100, cubitIndex++);
                if (currentFace != null && currentFace.accept(x, y, z)) {
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

    renderer.render(scene, camera);

    console.log("All objects: " + allObjects.length);
}

var W = 0xffffff;
var B = 0x00ff00;
var Y = 0xffff00;
var G = 0x00ff00;
var O = 0xff8c00;
var R = 0xff0000;
var X = 0x888888;

function getMaterialArray(cubitIndex) {
    var array = [];
    // order to add materials: x+,x-,y+,y-,z+,z-
    array.push( new THREE.MeshBasicMaterial( { color: X } ) );
    array.push( new THREE.MeshBasicMaterial( { color: G } ) );
    array.push( new THREE.MeshBasicMaterial( { color: O } ) );
    array.push( new THREE.MeshBasicMaterial( { color: X } ) );
    array.push( new THREE.MeshBasicMaterial( { color: W } ) );
    array.push( new THREE.MeshBasicMaterial( { color: X } ) );
    return new THREE.MeshFaceMaterial( array );
}

function createOneCubit(x, y, z, cubitIndex) {
//    console.log("Creating cubit " + cubitIndex  + " " + x + "," + y + "," + z);
    var cubeMaterials = getMaterialArray(cubitIndex);
    var cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    cube = new THREE.Mesh(cubeGeometry, cubeMaterials);
    cube.position = new THREE.Vector3(x, y, z);
    return cube;
}

var facesToRotate = [];
var rotateTarget = 0;

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
var renderer = new THREE.CanvasRenderer();

var lastTime = 0;

function animate() {
    if (rotateTarget > 0) {
        var currentFace = facesToRotate[0];
        var delta = new Date().getTime() - lastTime;
        var increment = lastTime == 0 ? 0.02 : delta / 300;
        rotateTarget -= increment;
        faceGroup.rotateOnAxis(currentFace.axis, increment * currentFace.sign);
        lastTime = new Date().getTime();
        requestAnimationFrame(animate);
    } else {
        facesToRotate.shift();
        lastTime = 0;
        if (facesToRotate.length > 0) {
            rotateTarget = PI_2;
        }
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
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild( renderer.domElement );

    addCubeToScene(scene, null);
    rotateCube(FRONT);
//    rotateCube(UP);
//    rotateCube(RIGHT);
//    rotateCube(FRONT_PRIME);
//    rotateCube(UP_PRIME);
//    rotateCube(RIGHT_PRIME);
//    rotateCube(FRONT);
//    rotateCube(UP);
//    rotateCube(RIGHT);
//    rotateCube(FRONT_PRIME);
//    rotateCube(UP_PRIME);
//    rotateCube(RIGHT_PRIME);
}
