import { RouterMiddleware } from '@oak/oak';

import { AppState } from '../types.d.ts';
import client from '../lib/prisma.ts';

export default (async function newApproach({ state, request, response, params }) {
	const form = await request.body.form();
	const hole = await client.hole.findFirst({ where: { id: Number.parseInt(params.id) } });
	if (hole === null) {
		response.status = 404;
		response.body = { message: 'Hole not found' };
		return;
	}
	const name = form.get('name')!;
	if (name.trim() === '') {
		response.status = 400;
		response.body = { message: 'Invalid name' };
		return;
	}
	const approach = await client.approach.create({
		data: {
			name,
			description: form.get('description')!,
			holeId: hole.id,
			initiatorId: state.user!,
		}
	});
	response.redirect(`/hole/${hole.id}/#approach-${approach.id}`);
}) as RouterMiddleware<'/hole/:id/approach/new', { id: string }, AppState>;