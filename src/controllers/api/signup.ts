import { Middleware } from '@oak/oak';
import { hash } from '@ts-rex/bcrypt';

import client from '../../lib/prisma.ts';
import { AppState } from '../../types.d.ts';

export default (async function signup({ request, response }) {
	const { username, password } = await request.body.json() as { username: string, password: string };
	if ([...username].some(c => !c.match(/[a-zA-Z0-9_]/))) {
		response.status = 400;
		response.body = { message: 'Invalid username' };
		return;
	}
	if (username.length < 6 || username.length > 32) {
		response.status = 400;
		response.body = { message: 'Invalid username length' };
		return;
	}
	const hashedPassword = hash(password);
	if (await client.user.count({ where: { username } }) !== 0) {
		response.status = 409;
		response.body = { message: 'Username already exists' };
		return;
	}
	const user = await client.user.create({
		data: {
			username,
			password: hashedPassword,
		},
	});
	response.status = 201;
	response.body = { id: user.id, username: user.username };
}) as Middleware<AppState>;