import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const gridSize = 10;
const gridSegments = 3;
const boardSize = 6;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;
camera.position.y = 40;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87ceeb, 1);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);
const planeGeometry = new THREE.PlaneGeometry();
const material = new THREE.MeshNormalMaterial();

for (let i = 0; i < boardSize; i++) {
	for (let j = 0; j < boardSize; j++) {
		const randomHeight = Math.random() * 10;
		const boxGeometry = new THREE.BoxGeometry(gridSize, randomHeight, gridSize, gridSegments, gridSegments);
		const bufferGeometry = new THREE.BufferGeometry();

		const cube = new THREE.Mesh(boxGeometry, material);
		boxGeometry.computeBoundingBox();
		cube.position.y = ((cube.geometry.boundingBox as THREE.Box3).max.y - (cube.geometry.boundingBox as THREE.Box3).min.y) / 2;

		bufferGeometry.merge(boxGeometry);

		// center board
		cube.translateX(gridSize * (i - 0.5 * (boardSize - 1)));
		cube.translateZ(gridSize * (j - 0.5 * (boardSize - 1)));

		scene.add(cube);
	}
}

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	render();
}

function animate() {
	requestAnimationFrame(animate);
	scene.rotation.y += 0.008;

	render();
}

function render() {
	renderer.render(scene, camera);
}

animate();
