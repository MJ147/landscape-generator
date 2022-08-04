import { GUI } from 'dat.gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const boardSettings = {
	fieldSize: 1,
	boardSize: 100,
	heightFactor: 3,
};

let lastHeightFactor = boardSettings.heightFactor;

const cameraAutoRotate = {
	rotateSpeed: 2,
};

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

createLandscape();

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	render();
}

function animate() {
	requestAnimationFrame(animate);
	scene.rotation.y += cameraAutoRotate.rotateSpeed / 1000;

	if (boardSettings.heightFactor !== lastHeightFactor) {
		console.log(1);

		lastHeightFactor = boardSettings.heightFactor;
		createLandscape();
	}

	render();
}

function render() {
	renderer.render(scene, camera);
}

createGui();
animate();

function createGui() {
	const gui = new GUI();
	const cameraFolder = gui.addFolder('Camera');
	cameraFolder.add(cameraAutoRotate, 'rotateSpeed', 0, 10, 1);
	cameraFolder.open();

	const boardFolder = gui.addFolder('Board');
	boardFolder.add(boardSettings, 'heightFactor', 0, 10, 1);
	boardFolder.open();
}

function createLandscape() {
	scene.clear();

	let heights: number[][] = [];

	for (let i = 0; i <= boardSettings.boardSize; i++) {
		heights[i] = [];

		for (let j = 0; j <= boardSettings.boardSize; j++) {
			if (i === 0 || j === 0) {
				heights[i][j] = Math.random() * boardSettings.fieldSize * boardSettings.heightFactor;

				continue;
			}

			// center board
			const x = boardSettings.fieldSize * (i - 0.5 * boardSettings.boardSize - 1);
			const y = Math.random() * boardSettings.fieldSize * boardSettings.heightFactor;
			const z = boardSettings.fieldSize * (j - 0.5 * boardSettings.boardSize - 1);

			const vertices: number[] = [];

			vertices.push(x, heights[i - 1][j - 1], z); // top left
			vertices.push(x, heights[i - 1][j], z + boardSettings.fieldSize); // bottom left
			vertices.push(x + boardSettings.fieldSize, heights[i][j - 1], z); // top right
			vertices.push(x + boardSettings.fieldSize, y, z + boardSettings.fieldSize); // bottom right
			vertices.push(x + boardSettings.fieldSize, heights[i][j - 1], z); // top right
			vertices.push(x, heights[i - 1][j], z + boardSettings.fieldSize); // bottom left

			const terrainGeometry = new THREE.BufferGeometry();
			terrainGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
			terrainGeometry.computeVertexNormals();

			const terrain = new THREE.Mesh(terrainGeometry, material);
			scene.add(terrain);

			heights[i][j] = y;
		}
	}
}
