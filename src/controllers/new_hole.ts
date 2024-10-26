import { Middleware } from '@oak/oak';

import client from '../lib/prisma.ts';
import { AppState } from '../types.d.ts';

export default (async function newHole({ state, request, response }) {
	const form = await request.body.form();
	const name = form.get('name')!;
	if (name.trim() === '') {
		response.status = 400;
		response.body = { message: 'Invalid name' };
		return;
	}
	const hole = await client.hole.create({
		data: {
			name,
			description: form.get('description')!,
			authorId: state.user!,
		}
	});
	response.redirect(`/hole/${hole.id}`);
}) as Middleware<AppState>;