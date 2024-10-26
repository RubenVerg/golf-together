import { RouterMiddleware } from '@oak/oak';

import { AppState } from '../types.d.ts';
import client from '../lib/prisma.ts';

export default (async function improveSolution({ state, request, response, params }) {
	const form = await request.body.form();
	const hole = await client.hole.findFirst({ where: { id: Number.parseInt(params.id) } });
	if (hole === null) {
		response.status = 404;
		response.body = { message: 'Hole not found' };
		return;
	}
	const solution = await client.solution.findFirst({ where: { id: Number.parseInt(params.solutionId) } });
	if (solution === null) {
		response.status = 404;
		response.body = { message: 'Solution not found' };
		return;
	}
	const newBits = Number.parseInt(form.get('size')!) * (form.get('unit') === 'bits' ? 1 : 8);
	const totalNewBits = form.get('subtract') === 'set' ? newBits : solution.bits - newBits;
	if (totalNewBits < 0 || totalNewBits >= solution.bits) {
		response.status = 400;
		response.body = { message: 'Invalid size, or larger than previous solution' };
		return;
	}
	await client.improvement.create({
		data: {
			improvementBits: solution.bits - totalNewBits,
			newCode: form.get('code')!,
			solutionId: solution.id,
			userId: state.user!,
		}
	});
	await client.solution.update({
		where: { id: solution.id },
		data: {
			bits: totalNewBits,
		}
	});
	response.redirect(`/hole/${hole.id}/#solution-${solution.id}`);
}) as RouterMiddleware<'/hole/:id/solution/:solutionId/improve', { id: string, solutionId: string }, AppState>;