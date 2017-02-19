var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 10000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function createMaterial(c, o) {
    return new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, side: THREE.DoubleSide
        // , color: THREE.FaceColors
    })
}

var white = createMaterial(0xf5f5f5, 0.8);
var blue = createMaterial(0x0026c4, 0.8);
var yellow = createMaterial(0xf9d720, 0.8);
var green = createMaterial(0x77cb3e, 0.8);
var orange = createMaterial(0xf57c08, 0.8);
var red = createMaterial(0xd62828, 0.8);
var transparent = new THREE.ShadowMaterial({ color: 0xffffff, transparent: true, opacity: 0.1, side: THREE.DoubleSide})

function createCube(colors) { // front, right, back, left, top, bottom) {
    var right = colors.right ? colors.right : transparent;
    var left = colors.left ? colors.left : transparent;
    var top = colors.top ? colors.top : transparent;
    var bottom = colors.bottom ? colors.bottom : transparent;
    var front = colors.front ? colors.front : transparent;
    var back = colors.back ? colors.back : transparent;

    var materials = new THREE.MultiMaterial([right, left, top, bottom, front, back]);
    var geometry = new THREE.BoxGeometry(1000, 1000, 1000);
    var cube = new THREE.Mesh(geometry, materials);
    cube.position = new THREE.Vector3(0, 0, 0);

    return cube;
}

/**
 * Example string:  "g..r.w" to produce a green(front), red(left), white(bottom).
 * @param string
 */
function createColorOption(string) {
    var colors = {}

    function charToColor(ch) {
        if (ch == 'w') return white;
        else if (ch == 'b') return blue;
        else if (ch == 'y') return yellow;
        else if (ch == 'g') return green;
        else if (ch == 'o') return orange;
        else if (ch == 'r') return red;
    }

    var c = string.charAt(0);
    if (c != ".") colors.front = charToColor(c);
    c = string.charAt(1);
    if (c != ".") colors.right = charToColor(c);
    c = string.charAt(2);
    if (c != ".") colors.back = charToColor(c);
    c = string.charAt(3);
    if (c != ".") colors.left = charToColor(c);
    c = string.charAt(4);
    if (c != ".") colors.top = charToColor(c);
    c = string.charAt(5);
    if (c != ".") colors.bottom = charToColor(c);

    return colors;
}

// var option = createColorOption("g..r.w");
// if (option.front == null || option.left == null || option.bottom == null
//     || option.back != null || option.right != null || option.top != null) {
//     error("Test failed");
// }

var cube = createCube({ front: white, back: red })
scene.add(cube);


var light = new THREE.AmbientLight(0xffffff, 10);
scene.add(light);

camera.position.x = 1000;
camera.position.y = 1000;
camera.position.z = 1000;

var cubeCenter = new THREE.Vector3(10, 10, 10)

var controls = new THREE.OrbitControls(camera, renderer.domElement)

function render() {
    requestAnimationFrame(render);
    // camera.position.y -= 10;
    // cube.position.x -= 10;
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    camera.lookAt(cubeCenter)
    // cube.rotation.y += 0.01;
    controls.update();
    renderer.render(scene, camera);
};
render();
