import { Middleware } from '@oak/oak';
import { decode as jwtDecode } from '@gz/jwt';

import { keyString } from '../lib/api_key.ts';
import { JwtPayload, AppState } from '../types.d.ts';

export default (async function authenticated({ request, response, state }, next) {
	const authorization = request.headers.get('Authorization');
	if (authorization === null) {
		response.status = 401;
		response.body = { message: 'You need to provide an Authorization header!' };
		return;
	}
	const [t, jwt] = authorization.split(' ');
	if (t !== 'Bearer') {
		response.status = 400;
		response.body = { message: 'Invalid Authorization header!' };
	}
	const payload = await jwtDecode<JwtPayload>(jwt, keyString, { algorithm: 'HS512' });
	if (payload === null) {
		response.status = 401;
		response.body = { message: 'Invalid token!' };
		return;
	}
	state.user = payload.id;
	await next();
}) as Middleware<AppState>;