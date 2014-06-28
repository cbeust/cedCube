
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
    for (var z = 1; z >= -1; z--) {
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

var rgbMap = {
    'w': 0xffffff,
    'b': 0x0000ff,
    'y': 0xffff00,
    'g': 0x00ff00,
    'o': 0xff8c00,
    'r': 0xff0000,
    '.': 0x888888
}

var colorString = "wwwwwwwwwbbbbbbbbbyyyyyyyyygggggggggooooooooorrrrrrrrr";

var CUBIT_COLOR_INDICES = [
    {
        indices: [ 0, -1, -1, 29, 42, -1 ],
        expected: "w..go."
    },
    {
        indices: [ 1, -1, -1, -1, 43, -1 ],
        expected: "w...o."
    },
    {
        indices: [ 2, 9, -1, -1, 44, -1 ],
        expected: "wb..o."
    },
    {
        indices: [ 3, -1, -1, 32, -1, -1 ],
        expected: "w..g.."
    },
    {
        indices: [ 4, -1, -1, -1, -1, -1 ], // middle of front
        expected: "w....."
    },
    {
        indices: [ 5, 12, -1, -1, -1, -1 ],
        expected: "wb...."
    },
    {
        indices: [ 6, -1, -1, 35, -1, 45 ],
        expected: "w..g.r"
    },
    {
        indices: [ 7, -1, -1, -1, -1, 46 ],
        expected: "w....r"
    },
    {
        indices: [ 8, 15, -1, -1, -1, 47 ],
        expected: "wb...r"
    },
    {
        indices: [ -1, -1, -1, 28, 39, -1 ],
        expected: "...go."
    },
    {
        indices: [ -1, -1, -1, -1, 40, -1 ], // middle
        expected: "....o."
    },
    {
        indices: [ -1, 10, -1, -1, 41, -1 ],
        expected: ".b..o."
    },
    {
        indices: [ -1, -1, -1, 31, -1, -1 ],
        expected: "...g.."
    },
    {
        indices: [ -1, -1, -1, -1, -1, -1 ], // center cube
        expected: "......"
    },
    {
        indices: [ -1, 13, -1, -1, -1, -1 ], // middle of right
        expected: ".b...."
    },
    {
        indices: [ -1, -1, -1, 34, -1, 48 ],
        expected: "...g.r"
    },
    {
        indices: [ -1, -1, -1, -1, -1, 49 ], // middle of down
        expected: ".....r"
    },
    {
        indices: [ -1, 16, -1, -1, -1, 50 ],
        expected: ".b...r"
    },
    {
        indices: [ -1, -1, 20, 27, 36 ],
        expected: "..ygo"
    },
    {
        indices: [ -1, -1, 19, -1, 37, -1 ],
        expected: "..y.o."
    },
    {
        indices: [ -1, 11, 18, -1, 38, -1 ],
        expected: ".by.o."
    },
    {
        indices: [ -1, -1, 23, 30, -1, -1],
        expected: "..yg.."
    },
    {
        indices: [ -1, -1, 22, -1, -1, -1 ], // middle of back
        expected: "..y..."
    },
    {
        indices: [ -1, 14, 21, -1, -1, -1 ],
        expected: ".by..."
    },
    {
        indices: [ -1, -1, 26, 33, -1, -1 ],
        expected: "..yg.."
    },
    {
        indices: [ -1, -1, 25, -1, -1, 52 ],
        expected: "..y..r"
    },
    {
        indices: [ -1, 17, 24, -1, -1, 51 ],
        expected: ".by..r"
    },
]

function getCubitColorsFromArray(indices) {
    var colors = "";
    for (var i = 0; i < indices.length; i++) {
        var ind = indices[i];
        colors += ind != -1 ? colorString[ind] : ".";
    }
    return colors;
//    console.log("Cubit colors: " + colors + " expected: " + expected);
}

function stringToRgb(s) {
    var result = [];
    for (var i = 0; i < s.length; i++) {
        result.push(rgbMap[s.charAt(i)])
    }
    return result;
}

function getMaterialArray(cubitIndex) {
    var array = [];
    var ci = CUBIT_COLOR_INDICES[cubitIndex].indices;
    var cs = getCubitColorsFromArray(ci);
    console.log("Color of cubit " + cubitIndex + " " + cs);
    var rgbColors = stringToRgb(cs);

    // input order: z+,x+,z-,x-,y+,y-
    // order to add materials: x+,x-,y+,y-,z+,z-
    array.push( new THREE.MeshBasicMaterial( { color: rgbColors[1] } ) );
    array.push( new THREE.MeshBasicMaterial( { color: rgbColors[3] } ) );
    array.push( new THREE.MeshBasicMaterial( { color: rgbColors[4] } ) );
    array.push( new THREE.MeshBasicMaterial( { color: rgbColors[5] } ) );
    array.push( new THREE.MeshBasicMaterial( { color: rgbColors[0] } ) );
    array.push( new THREE.MeshBasicMaterial( { color: rgbColors[2] } ) );

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

function testCubitColors() {
    for (var i = 0; i < CUBIT_COLOR_INDICES.length; i++) {
        var oi = CUBIT_COLOR_INDICES[i];
        var colors = getCubitColorsFromArray(oi.indices);
        if (colors != oi.expected) {
            console.log("*** Mismatch index " + i + ": " + colors + " expected: " + oi.expected);
        }
    }

    for (var i = 0; i < 27; i++) {
        getMaterialArray(i);
    }

    console.log(CUBIT_COLOR_INDICES.length + " tests done");
}

testCubitColors();

function runCube() {
    camera.position.x = 150;
    camera.position.y = 200;
    camera.position.z = 500;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild( renderer.domElement );

    addCubeToScene(scene, null);
//    rotateCube(FRONT);
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
