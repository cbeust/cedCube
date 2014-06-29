var PI_2 = Math.PI / 2;
var ANIMATE_INCREMENT = 0.01;

var X_AXIS = new THREE.Vector3(1, 0, 0);
var X_AXIS_NEG = new THREE.Vector3(-1, 0, 0);
var Y_AXIS = new THREE.Vector3(0, 1, 0);
var Y_AXIS_NEG = new THREE.Vector3(0, -1, 0);
var Z_AXIS = new THREE.Vector3(0, 0, 1);
var Z_AXIS_NEG = new THREE.Vector3(0, 0, -1);

var allObjects = [];
var scene = new THREE.Scene();

var FRONT = {
    name: "F",
    accept: function(x,y,z) {
        return z == 1;
    },
    axis: Z_AXIS_NEG,
    cubits: [ 0, 1, 2, 3, 4, 5, 6, 7, 8],
    newOrder: [6, 3, 0, 7, 4, 1, 8, 5, 2, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
        23, 24, 25, 26]
};

var FRONT_PRIME = {
    name: "F'",
    accept: function(x,y,z) {
        return z == 1;
    },
    axis: Z_AXIS,
    cubits: [ 0, 1, 2, 3, 4, 5, 6, 7, 8],
    newOrder: [2, 5, 8, 1, 4, 7, 0, 3, 6, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
        23, 24, 25, 26]
};

var RIGHT = {
    name: "R",
    accept: function(x,y,z) {
        return x == 1;
    },
    axis: X_AXIS_NEG,
    cubits: [ 2, 5, 8, 11, 14, 17, 20, 23, 26 ],
    newOrder: [0, 1, 8, 3, 4, 17, 6, 7, 26, 9, 10, 5, 12, 13, 14, 15, 16, 23, 18, 19, 2, 21, 22,
        11, 24, 25, 20 ]
};

var RIGHT_PRIME = {
    name: "R'",
    accept: function(x,y,z) {
        return x == 1;
    },
    axis: X_AXIS,
    cubits: [ 2, 5, 8, 11, 14, 17, 20, 23, 26 ],
    newOrder: [0, 1, 20, 3, 4, 11, 6, 7, 2, 9, 10, 23, 12, 13, 14, 15, 16, 5, 18, 19, 26, 21, 22,
        17, 24, 25, 8 ]
};

var BACK = {
    name: "B",
    accept: function(x,y,z) {
        return z == -1;
    },
    axis: Z_AXIS,
    cubits: [ 18, 19, 20, 21, 22, 23, 24, 25, 26 ],
    newOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8,
        9, 10, 11, 12, 13, 14, 15, 16, 17,
        20, 23, 26, 19, 22, 25, 18, 21, 24 ]
};

var BACK_PRIME = {
    name: "B'",
    accept: function(x,y,z) {
        return z == -1;
    },
    axis: Z_AXIS_NEG,
    cubits: [ 18, 19, 20, 21, 22, 23, 24, 25, 26 ],
    newOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8,
        9, 10, 11, 12, 13, 14, 15, 16, 17,
        24, 21, 18, 25, 22, 19, 26, 23, 20 ]
};

var LEFT = {
    name: "L",
    accept: function(x,y,z) {
        return x == -1;
    },
    axis: X_AXIS_NEG,
    cubits: [ 0, 3, 6, 9, 12, 15, 18, 21, 24 ],
    newOrder: [18, 1, 2, 9, 4, 5, 0, 7, 8,
        21, 10, 11, 12, 13, 14, 3, 16, 17,
        24, 19, 20, 15, 22, 23, 6, 25, 26 ]
};

var LEFT_PRIME = {
    name: "L'",
    accept: function(x,y,z) {
        return x == -1;
    },
    axis: X_AXIS,
    cubits: [ 0, 3, 6, 9, 12, 15, 18, 21, 24 ],
    newOrder: [6, 1, 2, 15, 4, 5, 24, 7, 8,
        3, 10, 11, 12, 13, 14, 21, 16, 17,
        0, 19, 20, 9, 22, 23, 18, 25, 26 ]
};

var UP = {
    name: "U",
    accept: function(x,y,z) {
        return y == 1;
    },
    axis: Y_AXIS_NEG,
    cubits: [ 0, 1, 2, 9, 10, 11, 18, 19, 20 ],
    newOrder: [ 2, 11, 20, 3, 4, 5, 6, 7, 8,
        1, 10, 19, 12, 13, 14, 15, 16, 17,
        0, 9, 18, 21, 22, 23, 24, 25, 26 ]
};

var UP_PRIME = {
    name: "U'",
    accept: function(x,y,z) {
        return y == 1;
    },
    axis: Y_AXIS,
    cubits: [ 0, 1, 2, 9, 10, 11, 18, 19, 20 ],
    newOrder: [ 18, 9, 0, 3, 4, 5, 6, 7, 8,
        19, 10, 1, 12, 13, 14, 15, 16, 17,
        20, 11, 2, 21, 22, 23, 24, 25, 26 ]
};

var DOWN = {
    name: "D",
    accept: function(x,y,z) {
        return y == -1;
    },
    axis: Y_AXIS_NEG,
    cubits: [ 6, 7, 8, 15, 16, 17, 24, 25, 26 ],
    newOrder: [0, 1, 2, 3, 4, 5, 24, 15, 6,
        9, 10, 11, 12, 13, 14, 25, 16, 7,
        18, 19, 20, 21, 22, 23, 26, 17, 8 ]
};

var DOWN_PRIME = {
    name: "D'",
    accept: function(x,y,z) {
        return y == -1;
    },
    axis: Y_AXIS,
    cubits: [ 6, 7, 8, 15, 16, 17, 24, 25, 26 ],
    newOrder: [ 0, 1, 2, 3, 4, 5, 8, 17, 26,
        9, 10, 11, 12, 13, 14, 7, 16, 25,
        18, 19, 20, 21, 22, 23, 6, 15, 24 ]
};

function clearScene() {
    var obj, i;
    for ( i = allObjects.length - 1; i >= 0 ; i -- ) {
        scene.remove(allObjects[i]);
    }
    allObjects = [];
    cubes = [];
}

var CUBITS = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26];
//var CUBITS = [
//    2, 11, 20, 3, 4, 5, 6, 7, 8,
//    1, 10, 19, 12, 13, 14, 15, 16, 17,
//    0, 9, 18, 21, 22, 23, 24, 25, 26
//];

function addCubeToScene(scene) {
    clearScene();
    var cubitIndex = 0;
    for (var z = 1; z >= -1; z--) {
        for (var y = 1; y >= -1; y--) {
            for (var x = -1; x <= 1; x++) {
                var cube = createOneCubit(x * 100, y * 100, z * 100, CUBITS[cubitIndex++]);
                scene.add(cube);
                allObjects.push(cube);
            }
        }
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
        indices: [ -1, -1, 20, 27, 36, -1 ],
        expected: "..ygo."
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
        indices: [ -1, -1, 26, 33, -1, 53 ],
        expected: "..yg.r"
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

/**
 * @return the scene objects for the given face.
 */
function getCubesForFace(face) {
    var result = [];
    var cubitIndices = face.cubits;
    for (var i = 0; i < cubitIndices.length; i++) {
        var ci = cubitIndices[i];
        result.push(allObjects[ci]);
    }
    return result;
}

    function animate() {
    if (rotateTarget > 0) {
        // Still rotating
        var currentFace = facesToRotate[0];
        var delta = new Date().getTime() - lastTime;
        var increment = lastTime == 0 ? 0.02 : delta / 300;
        rotateTarget -= increment;

//        faceGroup.rotateOnAxis(currentFace.axis, increment * currentFace.sign);
        var objects = getCubesForFace(currentFace);
        var matrix = new THREE.Matrix4().makeRotationAxis(currentFace.axis, increment);
        for (var i = 0; i < objects.length; i++) {
            objects[i].applyMatrix(matrix);
//            renderer.render(scene, camera);
        }

        lastTime = new Date().getTime();
        requestAnimationFrame(animate);
    } else {
        // Done rotating
        var currentFace = facesToRotate[0];
        var objects = getCubesForFace(currentFace);
        for (var i = 0; i < objects.length; i++) {
            var r = objects[i].rotation;
            console.log("Rotation: " + r.x + "," + r.y + "," + r.z);
        }

        var newObjects = [];
        if (currentFace.newOrder.length != 27) {
            alert("Wrong newOrder");
        }
        for (var i = 0; i < currentFace.newOrder.length; i++) {
            newObjects[i] = allObjects[currentFace.newOrder[i]];
        }
        allObjects = newObjects;

        facesToRotate.shift();
        lastTime = 0;
        if (facesToRotate.length > 0) {
            rotateTarget = PI_2;
        }
    }
    renderer.render(scene, camera);
}

function rotateCube(face) {
    console.log("Rotating " + face.name);
    facesToRotate.push(face);
    rotateTarget = PI_2;
//    addCubeToScene(scene);
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

//testCubitColors();

function runCube() {

    addCubeToScene(scene);
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

function test() {
    var material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
//    {
//        var pivot1 = new THREE.Object3D();
//        var geometry =  new THREE.BoxGeometry( 40, 40, 40);
//        var cube = new THREE.Mesh(geometry, material);
//        cube.position.x = 50;
//        pivot1.add(cube);
//        scene.add(pivot1);
//    }

    var geometry =  new THREE.BoxGeometry( 40, 40, 40);
    cube = new THREE.Mesh(geometry, material);
    cube.position.x = 50;
    scene.add(cube);
    renderer.render(scene, camera);

    var rotWorldMatrix;
// Rotate an object around an arbitrary axis in world space
    function rotateAroundWorldAxis(object, axis, radians) {
        rotWorldMatrix = new THREE.Matrix4();
        rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

        // old code for Three.JS pre r54:
        //  rotWorldMatrix.multiply(object.matrix);
        // new code for Three.JS r55+:
        rotWorldMatrix.multiply(object.matrix);                // pre-multiply

        object.matrix = rotWorldMatrix;

        // old code for Three.js pre r49:
        // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
        // old code for Three.js pre r59:
        // object.rotation.setEulerFromRotationMatrix(object.matrix);
        // code for r59+:
        object.rotation.setFromRotationMatrix(object.matrix);
    }

    // Rotate an object around an arbitrary axis in object space
    var rotObjectMatrix;
    function rotateAroundObjectAxis(object, axis, radians) {
        rotObjectMatrix = new THREE.Matrix4();
        rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);

        // old code for Three.JS pre r54:
        // object.matrix.multiplySelf(rotObjectMatrix);      // post-multiply
        // new code for Three.JS r55+:
        object.matrix.multiply(rotObjectMatrix);

        // old code for Three.js pre r49:
        // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
        // new code for Three.js r50+:
        object.rotation.setEulerFromRotationMatrix(object.matrix);
    }

    count = 0;

    var animate = function() {
        var axis = count % 200 < 100 ? new THREE.Vector3(0,1,0) : new THREE.Vector3(0,0,1);
//        console.log("Count: " + count + " " + axis.x + "," + axis.y + "," + axis.z);
//        axis = new THREE.Vector3(0,1,0);
        count++;
        var matrix = new THREE.Matrix4().makeRotationAxis( axis, 0.01 );
        cube.applyMatrix( matrix );
//        rotateAroundObjectAxis(cube, new THREE.Vector3(0,0,10), 0.01);
//        pivot1.rotation.z += 0.01;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

}

function run() {

    camera.position.x = 50;
    camera.position.y = 50;
    camera.position.z = 500;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    renderer.setSize(window.innerWidth, window.innerHeight);
//    renderer.setClearColorHex(0x333F47, 1);

    document.body.appendChild( renderer.domElement );

    var axes2 = new THREE.AxisHelper( 1000);
    scene.add(axes2);

    var controls = new THREE.OrbitControls(camera, renderer.domElement)

//    test();
    runCube();

    renderer.render(scene, camera);
    controls.update();
}
