import { Middleware } from '@oak/oak';

import { AppState } from '../../types.d.ts';
import client from '../../lib/prisma.ts';

export default (async function myInfo({ response, state }) {
	const id = state.user!;
	const user = await client.user.findUnique({ where: { id } });
	if (!user) {
		response.status = 500;
		response.body = { message: 'You don\'t seem to exist' };
		return;
	}
	response.status = 200;
	response.body = { id: user.id, username: user.username, createdAt: user.createdAt, updatedAt: user.updatedAt };
}) as Middleware<AppState>;