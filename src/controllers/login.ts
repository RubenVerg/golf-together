import { Middleware } from '@oak/oak';
import { verify } from '@ts-rex/bcrypt';

import { AppState } from '../types.d.ts';
import { generateToken } from '../lib/authentication.ts';
import { stringify as stringifyCookie } from '../lib/cookie.ts';
import client from '../lib/prisma.ts';

export default (async function login({ request, response }) {
	const form = await request.body.form();
	const username = form.get('username');
	const password = form.get('password');
	if (username === null || password === null) {
		response.status = 400;
		response.body = { message: 'Missing username or password' };
		return;
	}
	const user = await client.user.findFirst({ where: { username } });
	if (user === null || !verify(password, user.password)) {
		response.status = 401;
		response.body = { message: 'Invalid username or password' };
		return;
	}
	const token = await generateToken(user);
	response.headers.append('Set-Cookie', stringifyCookie({
		name: 'token',
		value: token,
		samesite: 'Strict',
		httponly: true,
		expires: Date.now() + 60 * 60 * 1000,
	}));
	response.redirect('/');
}) as Middleware<AppState>;