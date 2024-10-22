import { Middleware } from '@oak/oak';
import { decode as jwtDecode } from '@gz/jwt';

import { AppState, JwtPayload } from '../types.d.ts';
import { parse as parseCookies } from '../lib/cookie.ts';
import { keyString } from '../lib/api_key.ts';

export default (async function loadAccount({ request, response, state }, next) {
	let token: string = '';
	const authorization = request.headers.get('Authorization');
	if (authorization === null) {
		const cookieHeader = request.headers.get('Cookie');
		if (cookieHeader === null) return next();
		const c = parseCookies(cookieHeader);
		if (!c.has('token')) return next();
		token = c.get('token')!;
	} else {
		const [t, jwt] = authorization.split(' ');
		if (t !== 'Bearer') return next();
		token = jwt;
	}
	if (token === '') return next();

	let payload: JwtPayload | null;
	try {
		payload = await jwtDecode<JwtPayload>(token, keyString, { algorithm: 'HS512' });
	} catch (_) {
		return next();
	}

	if (payload === null) {
		response.status = 401;
		response.body = { message: 'Invalid token!' };
		return;
	}
	state.user = payload.id;
	return next();
}) as Middleware<AppState>;