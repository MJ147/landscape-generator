import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const gridSize = 1;
const boardSize = 50;
const heightFactor = 3;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 25;
camera.position.y = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87ceeb, 1);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);
const material = new THREE.MeshNormalMaterial({
	vertexColors: true,
});

let heights: number[][] = [];

for (let i = 0; i <= boardSize; i++) {
	heights[i] = [];
	for (let j = 0; j <= boardSize; j++) {
		if (i === 0 || j === 0) {
			heights[i][j] = Math.random() * gridSize * heightFactor;

			continue;
		}

		// center board
		const x = gridSize * (i - 0.5 * boardSize - 1);
		const y = Math.random() * gridSize * heightFactor;
		const z = gridSize * (j - 0.5 * boardSize - 1);

		const vertices: number[] = [];
		console.log(heights.map((v) => v.map((d) => Math.round(d)).toString()));

		vertices.push(x, heights[i - 1][j - 1], z); // top left
		vertices.push(x, heights[i - 1][j], z + gridSize); // bottom left
		vertices.push(x + gridSize, heights[i][j - 1], z); // top right
		vertices.push(x + gridSize, y, z + gridSize); // bottom right
		vertices.push(x + gridSize, heights[i][j - 1], z); // top right
		vertices.push(x, heights[i - 1][j], z + gridSize); // bottom left

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
	scene.rotation.y += 0.002;

	render();
}

function render() {
	renderer.render(scene, camera);
}

animate();
