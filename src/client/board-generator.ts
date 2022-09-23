import { seededRandom } from 'three/src/math/MathUtils';
import { BoardSettings } from './client';

export interface Germination {
	seed: number;
	sprout: number;
}

export interface Board {
	size: number;
	verticesOffset: number;
	vertices: Point[][];
}

// x, y, z
export type Point = [number, number, number];

export function generateRandomSeed(): number {
	const seed = Math.floor(Math.random() * 10 ** 10);

	return seed;
}

export function encryptSeed(seed: number): number {
	const cryptedSeed = Math.floor(seededRandom(seed) * 10 ** 10);

	return cryptedSeed;
}

export function getVertexYFromSeed(numberOfVertex: number, seed: number, max: number, min: number): number {
	const seedArray = Array.from(seed.toString(), (n) => Number(n));

	const first = seedArray[Math.floor(numberOfVertex / 1000)];
	const second = seedArray[Math.floor((numberOfVertex / 100) % 10)];
	const third = seedArray[Math.floor((numberOfVertex / 10) % 10)];
	const four = seedArray[Math.floor(numberOfVertex % 10)];

	// console.log(Math.floor(numberOfVertex % 10));

	console.log(first, second, third, four, ((first + second + third + four) % (max - min + 1)) + min);

	return ((first + second + third + four) % (max - min + 1)) + min;
}

export function generateBoardModel(
	seed: number,
	{ boardSize, verticesOffset, maxHeight, minHeight, maxHeightOffset }: BoardSettings,
): Board {
	let vertices: Point[][] = [];

	for (let i = 0; i <= boardSize; i++) {
		vertices[i] = [];

		for (let j = 0; j <= boardSize; j++) {
			const vertexNumber = i * boardSize + j;

			const x = verticesOffset * (i - 0.5 * boardSize);
			const y = getVertexYFromSeed(vertexNumber, seed, maxHeight, 3);
			const z = verticesOffset * (j - 0.5 * boardSize);

			vertices[i][j] = [x, y, z];
		}
	}

	// console.log(vertices.map((r) => `[${r[0][0]}, ${r[0][2]}] (${r[0][1]}])`).toString());
	// console.log(vertices.map((r) => `[${r[1][0]}, ${r[1][2]}] (${r[1][1]}])`).toString());
	// console.log(vertices.map((r) => `[${r[2][0]}, ${r[2][2]}] (${r[2][1]}])`).toString());

	return {
		size: boardSize,
		verticesOffset,
		vertices,
	};
}
