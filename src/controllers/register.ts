import { Middleware } from '@oak/oak';
import { hash } from '@ts-rex/bcrypt';

import { AppState } from '../types.d.ts';
import { generateToken } from '../lib/authentication.ts';
import { stringify as stringifyCookie } from '../lib/cookie.ts';
import client from '../lib/prisma.ts';

export default (async function register({ request, response }) {
	const form = await request.body.form();
	const username = form.get('username');
	const password = form.get('password');
	if (username === null || password === null) {
		response.status = 400;
		response.body = { message: 'Missing username or password' };
		return;
	}
	const previousUser = await client.user.findFirst({ where: { username } });
	if (previousUser !== null) {
		response.status = 409;
		response.body = { message: 'Username already exists' };
		return;
	}
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
	const user = await client.user.create({
		data: {
			username,
			password: hash(password),
		},
	});
	const token = await generateToken(user);
	response.redirect('/');
	response.headers.append('Set-Cookie', stringifyCookie({
		name: 'token',
		value: token,
		samesite: 'Strict',
		httponly: true,
		expires: Date.now() + 60 * 60 * 1000,
	}));
}) as Middleware<AppState>;