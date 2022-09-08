import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { generateSeed, generateBoardModel, Point } from './board-generator';

export interface Grid {
	topLeft: Point;
	topRight: Point;
	bottomRight: Point;
	bottomLeft: Point;
}

const seed = generateSeed();
const boardModel = generateBoardModel(seed, 50, 5);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;
camera.position.y = 10;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87ceeb, 1);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);
const material = new THREE.MeshNormalMaterial({
	vertexColors: true,
});

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

		console.log(grid);

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

// for (let i = 0; i <= boardSize; i++) {
// 	heights[i] = [];
// 	for (let j = 0; j <= boardSize; j++) {
// 		if (i === 0 || j === 0) {
// 			heights[i][j] = Math.random() * gridSize * heightFactor;

// 			continue;
// 		}

// 		// center board
// 		const x = gridSize * (i - 0.5 * boardSize - 1);
// 		const y = Math.random() * gridSize * heightFactor;
// 		const z = gridSize * (j - 0.5 * boardSize - 1);

// 		const vertices: number[] = [];

// 		vertices.push(x, heights[i - 1][j - 1], z); // top left
// 		vertices.push(x, heights[i - 1][j], z + gridSize); // bottom left
// 		vertices.push(x + gridSize, heights[i][j - 1], z); // top right
// 		vertices.push(x + gridSize, y, z + gridSize); // bottom right
// 		vertices.push(x + gridSize, heights[i][j - 1], z); // top right
// 		vertices.push(x, heights[i - 1][j], z + gridSize); // bottom left

// 		const terrainGeometry = new THREE.BufferGeometry();
// 		terrainGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
// 		terrainGeometry.computeVertexNormals();

// 		const terrain = new THREE.Mesh(terrainGeometry, material);
// 		scene.add(terrain);

// 		heights[i][j] = y;
// 	}
// }

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	render();
}

function animate() {
	requestAnimationFrame(animate);
	// scene.rotation.y += 0.002;

	render();
}

function render() {
	renderer.render(scene, camera);
}

animate();
