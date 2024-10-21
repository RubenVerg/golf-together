import { Middleware } from '@oak/oak';
import { decode as jwtDecode } from '@gz/jwt';

import { keyString } from '../lib/api_key.ts';
import { JwtPayload, AppState } from '../types.d.ts';
import { parse as parseCookies } from '../lib/cookie.ts';

export default (async function authenticated({ request, response, state }, next) {
	let token: string = '';
	const authorization = request.headers.get('Authorization');
	if (authorization === null) {
		const cookieHeader = request.headers.get('Cookie');
		if (cookieHeader === null) {
			response.status = 401;
			response.body = { message: 'You need to provide an Authorization or Cookie header!' };
			return;
		}
		const c = parseCookies(cookieHeader);
		if (!c.has('token')) {
			response.status = 401;
			response.body = { message: 'You need to provide a token in the Cookie header!' };
			return;
		}
		token = c.get('token')!;
	} else {
		const [t, jwt] = authorization.split(' ');
		if (t !== 'Bearer') {
			response.status = 400;
			response.body = { message: 'Invalid Authorization header!' };
		}
		token = jwt;
	}
	if (token === '') {
		response.status = 401;
		response.body = { message: 'You need to provide a token!' };
		return;
	}

	const payload = await jwtDecode<JwtPayload>(token, keyString, { algorithm: 'HS512' });
	if (payload === null) {
		response.status = 401;
		response.body = { message: 'Invalid token!' };
		return;
	}
	state.user = payload.id;
	await next();
}) as Middleware<AppState>;