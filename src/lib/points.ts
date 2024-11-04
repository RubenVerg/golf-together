import client from './prisma.ts';

export async function pointsForUser(id: number) {
	const user = await client.user.findFirst({ where: { id }, include: { approaches: { include: { solutions: true } }, improvements: true } });
	if (!user) return 0;
	const improvementPoints = user.improvements.reduce((acc, improvement) => improvement.improvementBits < 0 ? acc + 5 : acc + improvement.improvementBits, 0);
	const approachesPoints = user.approaches.reduce((acc, approach) => acc + approach.solutions.length * 10, 0);
	return improvementPoints + approachesPoints;
}

export async function leaderboard(): Promise<[number, number][]> {
	return (await Promise.all((await client.user.findMany()).map(async u => [u.id, await pointsForUser(u.id)] as [number, number]))).toSorted((a, b) => b[1] - a[1]);
}
