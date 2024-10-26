import { Middleware } from '@oak/oak';

import client from '../../lib/prisma.ts';
import { AppState } from '../../types.d.ts';

export default (async function createHole({ state, request, response }) {
	const { name, description } = await request.body.json() as { name: string, description: string };
	const hole = await client.hole.create({
		data: {
			name,
			description,
			authorId: state.user!,
		},
	});
	response.status = 201;
	response.body = { id: hole.id, name: hole.name, description: hole.description };
}) as Middleware<AppState>;