/**
 * Created by cedricbeust on 2/19/17.
 */
var camera, scene, renderer, geometry, mesh, controls;

var group;

init();
animate();

function createPlane(x, y, z, color) {
    var geometry = new THREE.PlaneGeometry( 100, 100 );
    var material = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide
    });
    var result = new THREE.Mesh( geometry, material );
    result.position.x = x;
    result.position.y = y;
    result.position.z = z;

    return result;
}

function createCube(config) {
    group = new THREE.Object3D();

    var pos = 100;

    if (config.left) {
        var left = createPlane(-pos / 2, 0, pos / 2, config.left);
        left.rotation.y = Math.PI / 2;
        group.add(left);
    }
    if (config.right) {
        var right = createPlane(pos / 2, 0, pos / 2, config.right);
        right.rotation.y = Math.PI / 2;
        group.add(right);
    }
    if (config.back) {
        group.add(createPlane(0, 0, 0, config.back));
    }
    if (config.front) {
        group.add(createPlane(0, 0, pos, config.front));
    }
    if (config.bottom) {
        var front = createPlane(0, -pos / 2, pos / 2, config.bottom);
        front.rotation.x = Math.PI / 2;
        group.add(front);
    }
    if (config.top) {
        var ttop = createPlane(0, pos / 2, pos / 2, config.top);
        ttop.rotation.x = Math.PI / 2;
        group.add(ttop);
    }

    return group;
}

function init() {

    scene = new THREE.Scene();

    // camera
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
    // camera.position.set(100, -800, 400);
    // camera.rotation.x = 45 * ( Math.PI / 180 );
    // camera.position.x = 200;
    camera.position.z = 800;
    // camera.position.set(100, -400, 100);
    scene.add(camera);

    scene.add(new THREE.AxisHelper(100));

    scene.add(createCube({
        bottom: "blue",
        top: "green",
        left: "red",
        right: "orange",
        back: "yellow",
        front: "white"
    }));

    // plane2 = createPlane();
    // plane2.position.x += 200;
    // scene.add(plane2);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
}

function animate() {

    requestAnimationFrame(animate);
    render();

}


function render() {

    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.02;

    // group.rotation.x -= 0.05;
    // group.rotation.y -= 0.05;
    // camera.rotation.x += 0.2;
    controls.update();

    renderer.render(scene, camera);

}