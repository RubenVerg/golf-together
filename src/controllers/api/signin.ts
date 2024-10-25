import { Middleware } from '@oak/oak';
import { verify } from '@ts-rex/bcrypt';

import client from '../../lib/prisma.ts';
import { AppState } from '../../types.d.ts';
import { stringify as stringifyCookie } from '../../lib/cookie.ts';
import { generateToken } from '../../lib/authentication.ts';

export default (async function signin({ request, response }) {
	const { username, password } = await request.body.json() as { username: string, password: string };
	const user = await client.user.findFirst({ where: { username } });
	if (user === null || !verify(password, user.password)) {
		response.status = 401;
		response.body = { message: 'Invalid username or password' };
		return;
	}
	const token = await generateToken(user);
	response.status = 200;
	response.headers.append('Set-Cookie', stringifyCookie({
		name: 'token',
		value: token,
		samesite: 'Strict',
		httponly: true,
		expires: Date.now() + 60 * 60 * 1000,
	}));
	response.body = { id: user.id, username: user.username, token };
}) as Middleware<AppState>;