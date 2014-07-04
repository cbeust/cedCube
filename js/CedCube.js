Cube = function(width, height, formula, startString, nodeId) {
    self = this;

    this.width = width;
    this.height = height;
    this.formula = formula;
    this.startString = startString;
    this.nodeId = nodeId;

    this.camera = new THREE.PerspectiveCamera(40, width / height, 1, 10000);
    this.camera.position.set(1000, 600, 1000);
    this.renderer = new THREE.CanvasRenderer();
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x888888, 1);
    document.getElementById(nodeId).appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)

    var W = 200;
    var CUBIT_SIZE = W - 4;
    
    var PI_2 = Math.PI / 2;
    var ANIMATE_INCREMENT = 0.01;
    
    var X_AXIS = new THREE.Vector3(1, 0, 0);
    var X_AXIS_NEG = new THREE.Vector3(-1, 0, 0);
    var Y_AXIS = new THREE.Vector3(0, 1, 0);
    var Y_AXIS_NEG = new THREE.Vector3(0, -1, 0);
    var Z_AXIS = new THREE.Vector3(0, 0, 1);
    var Z_AXIS_NEG = new THREE.Vector3(0, 0, -1);
    
    var rgbMap = {
        'w': 0xffffff,
        'b': 0x0000cc,
        'y': 0xeeee00,
        'g': 0x00aa00,
        'o': 0xff8c00,
        'r': 0xff0000,
        '.': 0x666666
    }
    
    var WORLD = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26];
    
    var ALL_OBJECTS = [];
    
    var controls;
    
    var FRONT = {
        name: "F",
        axis: Z_AXIS_NEG,
        cubits: [ 0, 1, 2, 3, 4, 5, 6, 7, 8],
        newOrder: [6, 3, 0, 7, 4, 1, 8, 5, 2, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
            23, 24, 25, 26]
    };
    
    var FRONT_PRIME = {
        name: "F'",
        axis: Z_AXIS,
        cubits: [ 0, 1, 2, 3, 4, 5, 6, 7, 8],
        newOrder: [2, 5, 8, 1, 4, 7, 0, 3, 6, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
            23, 24, 25, 26]
    };
    
    var RIGHT = {
        name: "R",
        axis: X_AXIS_NEG,
        cubits: [ 2, 5, 8, 11, 14, 17, 20, 23, 26 ],
        newOrder: [0, 1, 8, 3, 4, 17, 6, 7, 26, 9, 10, 5, 12, 13, 14, 15, 16, 23, 18, 19, 2, 21, 22,
            11, 24, 25, 20 ]
    };
    
    var RIGHT_PRIME = {
        name: "R'",
        axis: X_AXIS,
        cubits: [ 2, 5, 8, 11, 14, 17, 20, 23, 26 ],
        newOrder: [0, 1, 20, 3, 4, 11, 6, 7, 2, 9, 10, 23, 12, 13, 14, 15, 16, 5, 18, 19, 26, 21, 22,
            17, 24, 25, 8 ]
    };
    
    var BACK = {
        name: "B",
        axis: Z_AXIS,
        cubits: [ 18, 19, 20, 21, 22, 23, 24, 25, 26 ],
        newOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8,
            9, 10, 11, 12, 13, 14, 15, 16, 17,
            20, 23, 26, 19, 22, 25, 18, 21, 24 ]
    };
    
    var BACK_PRIME = {
        name: "B'",
        axis: Z_AXIS_NEG,
        cubits: [ 18, 19, 20, 21, 22, 23, 24, 25, 26 ],
        newOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8,
            9, 10, 11, 12, 13, 14, 15, 16, 17,
            24, 21, 18, 25, 22, 19, 26, 23, 20 ]
    };
    
    var LEFT = {
        name: "L",
        axis: X_AXIS,
        cubits: [ 0, 3, 6, 9, 12, 15, 18, 21, 24 ],
        newOrder: [18, 1, 2, 9, 4, 5, 0, 7, 8,
            21, 10, 11, 12, 13, 14, 3, 16, 17,
            24, 19, 20, 15, 22, 23, 6, 25, 26 ]
    };
    
    var LEFT_PRIME = {
        name: "L'",
        axis: X_AXIS_NEG,
        cubits: [ 0, 3, 6, 9, 12, 15, 18, 21, 24 ],
        newOrder: [6, 1, 2, 15, 4, 5, 24, 7, 8,
            3, 10, 11, 12, 13, 14, 21, 16, 17,
            0, 19, 20, 9, 22, 23, 18, 25, 26 ]
    };
    
    var UP = {
        name: "U",
        axis: Y_AXIS_NEG,
        cubits: [ 0, 1, 2, 9, 10, 11, 18, 19, 20 ],
        newOrder: [ 2, 11, 20, 3, 4, 5, 6, 7, 8,
            1, 10, 19, 12, 13, 14, 15, 16, 17,
            0, 9, 18, 21, 22, 23, 24, 25, 26 ]
    };
    
    var UP_PRIME = {
        name: "U'",
        axis: Y_AXIS,
        cubits: [ 0, 1, 2, 9, 10, 11, 18, 19, 20 ],
        newOrder: [ 18, 9, 0, 3, 4, 5, 6, 7, 8,
            19, 10, 1, 12, 13, 14, 15, 16, 17,
            20, 11, 2, 21, 22, 23, 24, 25, 26 ]
    };
    
    var DOWN = {
        name: "D",
        axis: Y_AXIS_NEG,
        cubits: [ 6, 7, 8, 15, 16, 17, 24, 25, 26 ],
        newOrder: [ 0, 1, 2, 3, 4, 5, 8, 17, 26,
            9, 10, 11, 12, 13, 14, 7, 16, 25,
            18, 19, 20, 21, 22, 23, 6, 15, 24 ]
    };
    
    var DOWN_PRIME = {
        name: "D'",
        axis: Y_AXIS,
        cubits: [ 6, 7, 8, 15, 16, 17, 24, 25, 26 ],
        newOrder: [0, 1, 2, 3, 4, 5, 24, 15, 6,
            9, 10, 11, 12, 13, 14, 25, 16, 7,
            18, 19, 20, 21, 22, 23, 26, 17, 8 ]
    };
    
    var FACES = [
        FRONT, FRONT_PRIME,
        RIGHT, RIGHT_PRIME,
        BACK, BACK_PRIME,
        LEFT, LEFT_PRIME,
        UP, UP_PRIME,
        DOWN, DOWN_PRIME
    ];
    
    var FACE_MAP = {};
    
    for (var i = 0; i < FACES.length; i++) {
        FACE_MAP[FACES[i].name] = FACES[i];
    }
    
    function clearScene() {
        var obj, i;
        for ( i = ALL_OBJECTS.length - 1; i >= 0 ; i -- ) {
            scene.remove(ALL_OBJECTS[i]);
        }
        ALL_OBJECTS = [];
        cubes = [];
    }
    
    this.addCubeToScene = function(scene) {
        clearScene();
        var cubitIndex = 0;
        for (var z = 1; z >= -1; z--) {
            for (var y = 1; y >= -1; y--) {
                for (var x = -1; x <= 1; x++) {
                    var cube = this.createOneCubit(x * W, y * W, z * W, WORLD[cubitIndex++]);
                    scene.add(cube);
                    ALL_OBJECTS.push(cube);
                }
            }
        }
        this.renderer.render(this.scene, this.camera);
        console.log("All objects: " + ALL_OBJECTS.length);
    }
    
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
        }
    ]
    
    this.getCubitColorsFromArray = function(indices) {
        var colors = "";
        for (var i = 0; i < indices.length; i++) {
            var ind = indices[i];
            colors += ind != -1 && ind < this.startString.length ? this.startString[ind] : ".";
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
    
    this.getMaterialArray = function(cubitIndex) {
        var array = [];
        var ci = CUBIT_COLOR_INDICES[cubitIndex].indices;
        var cs = this.getCubitColorsFromArray(ci);
    //    console.log("Color of cubit " + cubitIndex + " " + cs);
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
    
    this.createOneCubit = function(x, y, z, cubitIndex) {
    //    console.log("Creating cubit " + cubitIndex  + " " + x + "," + y + "," + z);
        var cubeMaterials = this.getMaterialArray(cubitIndex);
        var cubeGeometry = new THREE.BoxGeometry(CUBIT_SIZE, CUBIT_SIZE, CUBIT_SIZE);
        cube = new THREE.Mesh(cubeGeometry, cubeMaterials);
        cube.position = new THREE.Vector3(x, y, z);
        return cube;
    }
    
    var facesToRotate = [];
    var rotateCount = 0;
    var lastTime = 0;
    
    /**
     * @return the scene objects for the given face.
     */
    function getCubesForFace(face) {
        var result = [];
        var cubitIndices = face.cubits;
        for (var i = 0; i < cubitIndices.length; i++) {
            var ci = cubitIndices[i];
            result.push(ALL_OBJECTS[ci]);
        }
        return result;
    }
    
    function sign(x){
        if( +x === x ) { // check if a number was given
            return (x === 0) ? x : (x > 0) ? 1 : -1;
        }
        return NaN;
    }
    
    function clampPi(x) {
        var DELTA = 0.75;
        var result = x;
        var s = sign(x);
        var ax = Math.abs(x);
        if (ax < DELTA) {
            result = 0;
        } else if (Math.abs(ax - PI_2) < DELTA) {
            result = s * PI_2;
        } else if (Math.abs(ax - Math.PI) < DELTA) {
            result = s * Math.PI;
        } else if (Math.abs(ax - 3 * PI_2 / 2) < DELTA) {
            result = s * 3 * PI_2 / 2;
        } else if (Math.abs(ax - Math.PI * 2) < DELTA) {
            result = Math.PI * 2;
        } else {
            alert("Couldn't clamp " + x);
        }
        return result;
    }
    
    function roundMultiple(n, multiple) {
        if (! multiple) {
            multiple = W;
        }
        var result = Math.round(n / multiple) * multiple;
        return result;
    }
    
    function clamp100(x) {
        var DELTA = 5;
        var ax = Math.abs(100 - x % 100);
        var result;
        if (ax < DELTA) {
            var tmp = x > 0 ? x + DELTA : x - DELTA;
            result = tmp - (tmp % 100);
        } else {
            result = x;
        }
        return result;
    }
    
    function testRoundMultiple() {
        assertEquals(roundMultiple(99), 100);
        assertEquals(roundMultiple(-97.98013305664062), 100);
        assertEquals(roundMultiple(-97), 100);
        assertEquals(roundMultiple(94), 94);
        assertEquals(roundMultiple(95), 100);
        assertEquals(roundMultiple(96), 100);
        assertEquals(roundMultiple(97), 100);
        assertEquals(roundMultiple(100), 100);
        assertEquals(roundMultiple(101), 100);
        assertEquals(roundMultiple(-99), -100);
        assertEquals(roundMultiple(-100), -100);
        assertEquals(roundMultiple(-101), -100);
    }

    this.animate = function() {
//        console.log("Animating id " + this.nodeId);
        if (rotateCount > 0) {
            // Still rotating
            var currentFace = facesToRotate[0];
            var delta = new Date().getTime() - lastTime;
            var increment = lastTime == 0 ? 0.04 : delta / 200;
            if (rotateCount - increment < 0) {
                increment = rotateCount;
            }
    //        console.log("Increment: " + increment);
            rotateCount -= increment;
    
    //        faceGroup.rotateOnAxis(currentFace.axis, increment * currentFace.sign);
            var objects = getCubesForFace(currentFace);
            var matrix = new THREE.Matrix4().makeRotationAxis(currentFace.axis, increment);
    //        console.log("Rotation before applyMatrix: " + objects[0].rotation.z)
            for (var i = 0; i < objects.length; i++) {
                objects[i].applyMatrix(matrix);
    //            renderer.render(scene, camera);
            }
            console.log("Rotation after applyMatrix: " + objects[0].rotation.z)
    
            lastTime = new Date().getTime();
        } else if (isRotating) {
            // Done rotating
            var currentFace = facesToRotate[0];
            var objects = getCubesForFace(currentFace);
            for (var i = 0; i < objects.length; i++) {
                var r = objects[i].rotation;
                var p = objects[i].position;
                p.x = roundMultiple(p.x);
                p.y = roundMultiple(p.y);
                p.z = roundMultiple(p.z);
    //            console.log("#" + i + " coords after applyMatrix: " + p.x + "," + p.y + "," + p.z);
    //            console.log("#" + i + " rotation: " + r.x + "," + r.y + "," + r.z);
            }
    
            this.renderer.render(this.scene, this.camera);
            var newObjects = [];
            if (currentFace.newOrder.length != 27) {
                alert("Wrong newOrder");
            }
            var debug = "";
            for (var i = 0; i < currentFace.newOrder.length; i++) {
                debug += currentFace.newOrder[i] + " ";
                newObjects[i] = ALL_OBJECTS[currentFace.newOrder[i]];
            }
    //        console.log("New order: " + debug);
            ALL_OBJECTS = newObjects;
    
            facesToRotate.shift();
            lastTime = 0;
            if (facesToRotate.length > 0) {
                resetRotateCount();
            } else {
                isRotating = false;
            }
        }
    
//        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    var isRotating = false;
    
    /**
     * Turns a text formula (furFUR) into a list of faces.
     */
    function formulaToFaces(formula) {
        var result = [];
        for (var i = 0; i < formula.length; i++) {
            var c = formula.charAt(i);
            var face;
            if (c == c.toLowerCase()) {
                face = FACE_MAP[c.toUpperCase()];
            } else if (c == c.toUpperCase()) {
                face = FACE_MAP[c.toUpperCase() + "'"];
            } else {
                alert("Unknown face: " + c);
            }
            result.push(face);
        }
        return result;
    }
    
    this.playCubeFormula = function() {
        console.log("Playing " + this.formula);
        rotateFaces(formulaToFaces(this.formula));
    }
    
    function resetRotateCount() {
        rotateCount = PI_2;
        var axis = facesToRotate[0].axis;
    }
    
    function rotateFaces(faces) {
        for (var i = 0; i < faces.length; i++) {
            facesToRotate.push(faces[i]);
        }
        if (! isRotating) {
            resetRotateCount();
        }
        isRotating = true;
    }
    
    function rotateFace(face) {
        rotateFaces([ face ]);
    }
    
    document.onkeydown = function() {
        var shift = window.event.shiftKey;
        var c = window.event.keyCode;
        switch (c) {
            case 66: // b
                rotateFace(shift ? BACK_PRIME : BACK);
                break;
            case 68: // b
                rotateFace(shift ? DOWN_PRIME : DOWN);
                break;
            case 70: // f
                rotateFace(shift ? FRONT_PRIME : FRONT);
                break;
            case 76: /// l
                rotateFace(shift ? LEFT_PRIME : LEFT);
                break;
            case 82: // r
                rotateFace(shift ? RIGHT_PRIME : RIGHT);
                break;
            case 85: // u
                rotateFace(shift ? UP_PRIME : UP);
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
    
    function assertEquals(actual, expected, message) {
        if (isNaN(actual) || Math.abs(actual - expected) > 0.1) {
            alert("Assertion failed: expected " + expected + " but got " + actual);
        }
    }
    
    function testclampPi() {
        assertEquals(clampPi(6.4), 6.4);
        assertEquals(clampPi(6.29), Math.PI * 2);
        assertEquals(clampPi(6.28), Math.PI * 2);
        assertEquals(clampPi(6.27), Math.PI * 2);
        assertEquals(clampPi(4.8), 4.8);
        assertEquals(clampPi(4.72), Math.PI * 3 / 2);
        assertEquals(clampPi(4.71), Math.PI * 3 / 2);
        assertEquals(clampPi(4.70), Math.PI * 3 / 2);
        assertEquals(clampPi(3.15), Math.PI);
        assertEquals(clampPi(3.14), Math.PI);
        assertEquals(clampPi(3.13), Math.PI);
        assertEquals(clampPi(1.58), 1.58);
        assertEquals(clampPi(1.57), PI_2);
        assertEquals(clampPi(1.56), PI_2);
        assertEquals(clampPi(0.01), 0);
        assertEquals(clampPi(0.1), 0.1);
    }
    
    // @Tests
    
    //testCubitColors();
    //testclampPi();
    //testRoundMultiple();
    console.log("Run all tests");
    
    this.runCube = function() {
        this.addCubeToScene(this.scene);
    //    rotateFace(FRONT);
    //    rotateFace(FRONT);
    //    rotateFace(RIGHT);
    //    rotateFace(FRONT);
    //    rotateFace(LEFT);
    //    rotateFace(DOWN);
    //    rotateFace(UP);
    //    rotateFace(FRONT);
    //    rotateFace(FRONT);
    }

//    function tmp() {
//        var material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
//    //    {
//    //        var pivot1 = new THREE.Object3D();
//    //        var geometry =  new THREE.BoxGeometry( 40, 40, 40);
//    //        var cube = new THREE.Mesh(geometry, material);
//    //        cube.position.x = 50;
//    //        pivot1.add(cube);
//    //        scene.add(pivot1);
//    //    }
//    
//        var geometry =  new THREE.BoxGeometry( 40, 40, 40);
//        cube = new THREE.Mesh(geometry, material);
//        cube.position.x = 50;
//        scene.add(cube);
//        renderer.render(scene, camera);
//    
//        count = 0;
//    
//        this.animate = function() {
//            var axis = count % 200 < 100 ? new THREE.Vector3(0,1,0) : new THREE.Vector3(0,0,1);
//    //        console.log("Count: " + count + " " + axis.x + "," + axis.y + "," + axis.z);
//    //        axis = new THREE.Vector3(0,1,0);
//            count++;
//            var matrix = new THREE.Matrix4().makeRotationAxis( axis, 0.01 );
//            cube.applyMatrix( matrix );
//    //        rotateAroundObjectAxis(cube, new THREE.Vector3(0,0,10), 0.01);
//    //        pivot1.rotation.z += 0.01;
//    
//            renderer.render(scene, camera);
//            requestAnimationFrame(animate);
//        }
//        requestAnimationFrame(animate);
//    
//    }
    
    this.inspectWorld = function() {
        for (var i = 0; i < ALL_OBJECTS.length; i++) {
            var p = ALL_OBJECTS[i].position;
            var r = ALL_OBJECTS[i].rotation;
            console.log("#" + i + " position: "
                + p.x + "," + p.y + "," + p.z
                + " rotation: "
                + r.x + "," + r.y + "," + r.z);
        }
    }
}

cubeMap = {};

function playFormula(nodeId) {
    cubeMap[nodeId].playCubeFormula();
}

function animate() {
    var keys = Object.keys(cubeMap);
    for (var i = 0; i < keys.length; i++) {
        cubeMap[keys[i]].animate();
    }
    requestAnimationFrame(animate);
}

function modifyDom() {
    var nodes = document.getElementsByClassName('CedCube');
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        console.log("element: " + node);
        var f = node.attributes['formula'].textContent;
        var width = parseInt(node.attributes['width'].textContent);
        var height = parseInt(node.attributes['height'].textContent)
        var id = node.attributes.id.textContent;
        var colorString =
            "gggggggggrrrrrrrrrbbbbbbbbbooooooooowwwwwwwwwyyyyyyyyy";
        //    "rrr......bb.bb.";
        var cube = new Cube(width, height, f, colorString, id);
        cubeMap[id] = cube;

        console.log("Created cube " + id + " " + cube.width + " " + cube.height);

        if (f) {
            var div = document.createElement("div");
            div.setAttribute("class", "CedCubeInterface");
            div.setAttribute("style", "width:" + (width - 2));
            node.appendChild(div);

            {
                // Formula text
                var textDiv = document.createElement("div");
                textDiv.setAttribute("class", "formulaText");
                textDiv.appendChild(document.createTextNode(f));
                div.appendChild(textDiv);
            }

            {
                // Play
                var a = document.createElement("a");
                a.setAttribute("href", "#");
                a.setAttribute("onclick", "playFormula('" + id + "')");
                a.appendChild(document.createTextNode("Play"));
                div.appendChild(a);
            }
        }
        cube.runCube();
//        this.renderer.render(this.scene, this.camera);
//        controls.update();
    }


//    camera.up
//    camera.lookAt(new THREE.Vector3(0, -200, 0));


//    var axes2 = new THREE.AxisHelper( 1000);
//    scene.add(axes2);

}

function run() {
    modifyDom();
    requestAnimationFrame(animate);

//    tmp();
//    runCube();

}

//run();
