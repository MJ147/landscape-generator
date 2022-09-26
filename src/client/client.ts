import { GUI } from 'dat.gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { encryptSeed, generateBoardModel, generateRandomSeed, Point } from './board-generator';

export interface Grid {
	topLeft: Point;
	topRight: Point;
	bottomRight: Point;
	bottomLeft: Point;
}

export interface BoardSettings {
	boardSize: number;
	maxHeight: number;
	minHeight: number;
	verticesOffset: number;
	maxHeightOffset: number;
	terrainVariability: number; // 0-1
}

const seedWrapper = { seed: generateRandomSeed() };

const boardSettings: BoardSettings = {
	boardSize: 50,
	maxHeight: 100,
	minHeight: 0,
	verticesOffset: 5,
	maxHeightOffset: 1,
	terrainVariability: 1,
};

const cameraSettings = {
	rotateSpeed: 2,
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 100;
camera.position.y = 60;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87ceeb, 1);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);
const material = new THREE.MeshNormalMaterial({
	vertexColors: true,
});

function generateBoard(): void {
	scene.clear();
	const cryptedSeed: string = encryptSeed(seedWrapper.seed);

	const boardModel = generateBoardModel(cryptedSeed, boardSettings);

	boardModel.vertices.forEach((verticesLine, i, verticesRow) => {
		verticesLine.forEach((vertex, j) => {
			if (i === 0 || j === 0) {
				return;
			}

			const grid: Grid = {
				topLeft: verticesRow[i - 1][j - 1],
				topRight: verticesLine[j - 1],
				bottomRight: vertex,
				bottomLeft: verticesRow[i - 1][j],
			};

			const vertices: number[] = [];

			vertices.push(...grid.topLeft);
			vertices.push(...grid.bottomLeft);
			vertices.push(...grid.topRight);
			vertices.push(...grid.bottomRight);
			vertices.push(...grid.topRight);
			vertices.push(...grid.bottomLeft);

			const terrainGeometry = new THREE.BufferGeometry();
			terrainGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
			terrainGeometry.computeVertexNormals();

			const terrain = new THREE.Mesh(terrainGeometry, material);
			scene.add(terrain);
		});
	});
}

window.addEventListener('resize', onWindowResize, false);
generateBoard();

function onWindowResize(): void {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	render();
}

function animate(): void {
	requestAnimationFrame(animate);
	scene.rotation.y += cameraSettings.rotateSpeed / 1000;

	render();
}

function render(): void {
	renderer.render(scene, camera);
}

createGui();
animate();

function createGui(): void {
	const gui = new GUI();
	const cameraFolder = gui.addFolder('Camera');
	cameraFolder.add(cameraSettings, 'rotateSpeed', 0, 10, 1);
	cameraFolder.open();

	const boardFolder = gui.addFolder('Board');
	boardFolder.add(boardSettings, 'maxHeight', 0, 10, 1);
	boardFolder.add(seedWrapper, 'seed');
	boardFolder.open();

	const generateBoardWrapper = { generateBoard };
	boardFolder.add(generateBoardWrapper, 'generateBoard');
}
