import { Middleware } from '@oak/oak';
import { verify } from '@ts-rex/bcrypt';
import { encode as jwtEncode } from '@gz/jwt';

import client from '../../lib/prisma.ts';
import { keyString } from '../../lib/api_key.ts';
import { JwtPayload, AppState } from '../../types.d.ts';
import { stringify as stringifyCookie } from '../../lib/cookie.ts';

export default (async function signin({ request, response }) {
	const { username, password } = await request.body.json() as { username: string, password: string };
	const user = await client.user.findFirst({ where: { username } });
	if (user === null || !verify(password, user.password)) {
		response.status = 401;
		response.body = { message: 'Invalid username or password' };
		return;
	}
	const payload: JwtPayload = { iat: Math.round(Date.now() / 1000), exp: Math.round(Date.now() / 1000 + 60 * 60), id: user.id, username: user.username };
	const token = await jwtEncode(payload, keyString, { algorithm: 'HS512' });
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