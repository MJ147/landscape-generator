import * as THREE from 'three';
import { BufferGeometry, BufferGeometryUtils, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';

const gridSize = 10;
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
const material = new THREE.MeshNormalMaterial({
	vertexColors: true,
});

for (let i = 0; i < boardSize; i++) {
	for (let j = 0; j < boardSize; j++) {
		// set coords
		const x = gridSize * (i - 0.5 * (boardSize - 1));
		const y = Math.random() * 10;
		const z = gridSize * (j - 0.5 * (boardSize - 1));

		const vertices = [];
		const normals = [];
		const colors = [];
		const uv = [];

		vertices.push(new Vector3(x, y, z));
		vertices.push(new Vector3(x, y, z + 10));
		vertices.push(new Vector3(x + 10, y, z));

		vertices.push(new Vector3(x + 10, y, z + 10));
		vertices.push(new Vector3(x + 10, y, z));
		vertices.push(new Vector3(x, y, z + 10));

		normals.push(0, 1, 0);
		normals.push(0, 1, 0);
		normals.push(0, 1, 0);
		normals.push(0, 1, 0);
		normals.push(0, 1, 0);
		normals.push(0, 1, 0);

		const terrainGeometry = new THREE.BufferGeometry();
		terrainGeometry.setFromPoints(vertices);
		terrainGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));

		const terrain = new THREE.Mesh(terrainGeometry, material);
		scene.add(terrain);
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
