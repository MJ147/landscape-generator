import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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

let heights: number[][] = [];

for (let i = 0; i < boardSize; i++) {
	heights[i] = [Math.random() * 10];

	for (let j = 1; j <= boardSize; j++) {
		// set coords
		const x = gridSize * (i - 0.5 * boardSize);
		const y = Math.random() * 10;
		const z = gridSize * (j - 0.5 * boardSize) - 10;

		const vertices = [];

		if (i === 0) {
			vertices.push(x, heights[i][j - 1], z); // top left
			vertices.push(x, y, z + 10); // bottom left
			vertices.push(x + 10, heights[i][j - 1], z); // top right
			vertices.push(x + 10, y, z + 10); // bottom right
			vertices.push(x + 10, heights[i][j - 1], z); // top right
			vertices.push(x, y, z + 10); // bottom left
		} else {
			vertices.push(x, heights[i - 1][j - 1], z); // top left
			vertices.push(x, heights[i - 1][j], z + 10); // bottom left
			vertices.push(x + 10, heights[i][j - 1], z); // top right
			vertices.push(x + 10, y, z + 10); // bottom right
			vertices.push(x + 10, heights[i][j - 1], z); // top right
			vertices.push(x, heights[i - 1][j], z + 10); // bottom left
		}

		const terrainGeometry = new THREE.BufferGeometry();
		terrainGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
		terrainGeometry.computeVertexNormals();

		const terrain = new THREE.Mesh(terrainGeometry, material);
		scene.add(terrain);

		heights[i][j] = y;
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
