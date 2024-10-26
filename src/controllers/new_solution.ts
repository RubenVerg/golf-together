import { RouterMiddleware } from '@oak/oak';

import { AppState } from '../types.d.ts';
import client from '../lib/prisma.ts';

export default (async function newSolution({ state, request, response, params }) {
	const form = await request.body.form();
	const hole = await client.hole.findFirst({ where: { id: Number.parseInt(params.id) } });
	if (hole === null) {
		response.status = 404;
		response.body = { message: 'Hole not found' };
		return;
	}
	const approach = await client.approach.findFirst({ where: { id: Number.parseInt(params.approachId) } });
	if (approach === null) {
		response.status = 404;
		response.body = { message: 'Approach not found' };
		return;
	}
	const bits = Number.parseInt(form.get('size')!) * (form.get('unit') === 'bits' ? 1 : 8);
	if (bits < 0) {
		response.status = 400;
		response.body = { message: 'Invalid size' };
	}
	const language = form.get('language')!;
	if (language.trim() === '') {
		response.status = 400;
		response.body = { message: 'Invalid language' };
		return;
	}
	const solution = await client.solution.create({
		data: {
			language,
			bits,
			approachId: approach.id,
		}
	});
	await client.improvement.create({
		data: {
			improvementBits: -solution.bits,
			newCode: form.get('code')!,
			solutionId: solution.id,
			userId: state.user!,
		}
	});
	response.redirect(`/hole/${hole.id}/#solution-${solution.id}`);
}) as RouterMiddleware<'/hole/:id/approach/:approachId/new', { id: string, approachId: string }, AppState>;