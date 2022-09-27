import { seededRandom } from 'three/src/math/MathUtils';
import { BoardSettings } from './client';

export interface Board {
	size: number;
	verticesOffset: number;
	vertices: Point[][];
}

export interface Limits {
	min: number;
	max: number;
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

export function getVertexYFromSeed(numberOfVertex: number, seed: string, { max, min }: Limits): number {
	const seedArray = Array.from(seed.toString(), (n) => Number(n));

	const first = seedArray[Math.floor(numberOfVertex / 1000)];
	const second = seedArray[Math.floor((numberOfVertex / 100) % 10)];
	const third = seedArray[Math.floor((numberOfVertex / 10) % 10)];
	const four = seedArray[Math.floor(numberOfVertex % 10)];

	return ((first + second + third + four) % (max - min + 1)) + min;
}

export function generateBoardModel(
	seed: string,
	{ boardSize, verticesOffset, maxHeight, minHeight, maxHeightOffset, terrainVariety, isWavy }: BoardSettings,
): Board {
	let vertices: Point[][] = [];

	for (let i = 0; i <= boardSize; i++) {
		vertices[i] = [];

		for (let j = 0; j <= boardSize; j++) {
			let heightLimits: Limits = { min: minHeight, max: maxHeight };

			if (maxHeightOffset != null && (j !== 0 || i !== 0)) {
				const lastPointHeightX = vertices[i - 1]?.[j]?.[1] ?? vertices[i]?.[j - 1]?.[1];
				const lastPointHeightY = vertices[i]?.[j - 1]?.[1] ?? vertices[i - 1]?.[j]?.[1];
				const lastPointsAvgHeight = (lastPointHeightX + lastPointHeightY) / 2;

				const beforeLastPointHeightX = vertices[i - 2]?.[j]?.[1] ?? vertices[i]?.[j - 2]?.[1];
				const beforeLastPointHeightY = vertices[i]?.[j - 2]?.[1] ?? vertices[i - 2]?.[j]?.[1];
				const beforeLastPointsAvgHeight = (beforeLastPointHeightX + beforeLastPointHeightY) / 2;

				heightLimits.min = lastPointsAvgHeight - maxHeightOffset;
				heightLimits.max = lastPointsAvgHeight + maxHeightOffset;

				// wavy terrain
				if (isWavy) {
					heightLimits =
						getWavyTerrainLimits(lastPointsAvgHeight, beforeLastPointsAvgHeight, i, j, terrainVariety, heightLimits) ??
						heightLimits;
				}

				heightLimits.min = Math.min(maxHeight, Math.floor(heightLimits.min));
				heightLimits.max = Math.max(minHeight, Math.ceil(heightLimits.max));
			}

			const vertexNumber = i * boardSize + j;

			const x = verticesOffset * (i - 0.5 * boardSize);
			const y = getVertexYFromSeed(vertexNumber, seed, heightLimits);
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

// gives a random 0 or 1 with a given probability of 1
function randomWithProbability(probability: number): number {
	return probability >= Math.random() ? 1 : 0;
}

function getWavyTerrainLimits(
	lastPointsAvgHeight: number,
	beforeLastPointsAvgHeight: number,
	i: number,
	j: number,
	terrainVariety: number,
	limits: Limits,
): Limits | null {
	if (i < 2 && j < 2) {
		return limits;
	}
	const isContinuousSlope = randomWithProbability(terrainVariety) === 0;
	const min = lastPointsAvgHeight > beforeLastPointsAvgHeight && isContinuousSlope ? lastPointsAvgHeight : limits.min;
	const max = lastPointsAvgHeight < beforeLastPointsAvgHeight && isContinuousSlope ? lastPointsAvgHeight : limits.max;

	return { min, max };
}
