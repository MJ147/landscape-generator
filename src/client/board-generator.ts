import { seededRandom } from 'three/src/math/MathUtils';
import { BoardSettings } from './client';

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

export function encryptSeed(seed: number): string {
	const cryptedSeed = seededRandom(seed).toString().substring(2, 12);

	return cryptedSeed;
}

export function getVertexYFromSeed(numberOfVertex: number, seed: string, max: number, min: number): number {
	const seedArray = Array.from(seed.toString(), (n) => Number(n));

	const first = seedArray[Math.floor(numberOfVertex / 1000)];
	const second = seedArray[Math.floor((numberOfVertex / 100) % 10)];
	const third = seedArray[Math.floor((numberOfVertex / 10) % 10)];
	const four = seedArray[Math.floor(numberOfVertex % 10)];
	console.log({ max });
	console.log({ min });

	console.log(((first + second + third + four) % (max - min + 1)) + min);

	return ((first + second + third + four) % (max - min + 1)) + min;
}

export function generateBoardModel(
	seed: string,
	{ boardSize, verticesOffset, maxHeight, minHeight, maxHeightOffset }: BoardSettings,
): Board {
	let vertices: Point[][] = [];

	for (let i = 0; i <= boardSize; i++) {
		vertices[i] = [];

		for (let j = 0; j <= boardSize; j++) {
			let maxHeightLocal = maxHeight;
			let minHeightLocal = minHeight;

			if (maxHeightOffset != null && (j !== 0 || i !== 0)) {
				const lastXAdjacentHeight = vertices[i - 1]?.[j]?.[1] ?? vertices[i]?.[j - 1]?.[1];
				const lastYAdjacentHeight = vertices[i]?.[j - 1]?.[1] ?? vertices[i - 1]?.[j]?.[1];

				const adjacentAvgHeight = (lastXAdjacentHeight + lastYAdjacentHeight) / 2;

				console.log(Math.floor(adjacentAvgHeight + maxHeightOffset));

				console.log(Math.ceil(adjacentAvgHeight - maxHeightOffset));

				maxHeightLocal = Math.min(maxHeight, Math.floor(adjacentAvgHeight + maxHeightOffset));
				minHeightLocal = Math.max(minHeight, Math.ceil(adjacentAvgHeight - maxHeightOffset));
			}

			const vertexNumber = i * boardSize + j;

			const x = verticesOffset * (i - 0.5 * boardSize);
			const y = getVertexYFromSeed(vertexNumber, seed, maxHeightLocal, minHeightLocal);
			const z = verticesOffset * (j - 0.5 * boardSize);

			vertices[i][j] = [x, y, z];
		}
	}

	return {
		size: boardSize,
		verticesOffset,
		vertices,
	};
}
