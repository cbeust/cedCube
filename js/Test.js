/**
 * Created by cedricbeust on 2/19/17.
 */
var camera, scene, renderer, geometry, mesh, controls;

var left, right, bottom, front, back;

init();
animate();

function createPlane(x, y, z, color) {
    var geometry = new THREE.PlaneGeometry( 100, 100 );
    var material = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide
    });
    var mesh = new THREE.Mesh( geometry, material );

    var plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide
    }));

    var result = mesh;
    result.position.x = x;
    result.position.y = y;
    result.position.z = z;

    return result;
}

function init() {

    scene = new THREE.Scene();

    // camera
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 0, -800, 300 );
    camera.rotation.x = 45 * ( Math.PI / 180 );
    scene.add( camera );

    scene.add(new THREE.AxisHelper(100));

    var pos = 100;
    left = createPlane(-pos/2, 0, pos/2, 'red');
    left.rotation.y = Math.PI / 2;
    scene.add(left);
    right = createPlane(pos/2, 0, pos/2, 'blue');
    right.rotation.y = Math.PI / 2;
    scene.add(right);
    bottom = createPlane(0, 0, 0, 'orange');
    scene.add(bottom);
    var top = createPlane(0, 0, pos, 'green');
    scene.add(top);
    front = createPlane(0, -pos/2, pos/2, 'yellow');
    front.rotation.x = Math.PI / 2;
    scene.add(front);
    back = createPlane(0, pos/2, pos/2, 'white');
    back.rotation.x = Math.PI / 2;
    scene.add(back);

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

    // left.rotation.x -= 0.2;
    camera.rotation.x += 0.2;
    controls.update();

    renderer.render(scene, camera);

}