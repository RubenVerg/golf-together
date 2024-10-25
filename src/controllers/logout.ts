import { Middleware } from '@oak/oak';

import { AppState } from '../types.d.ts';
import { stringify as stringifyCookie } from '../lib/cookie.ts';

export default (function logout({ response }) {
	response.redirect('/');
	response.headers.append('Set-Cookie', stringifyCookie({ name: 'token', value: '', expires: new Date(0), samesite: 'Strict' }));
}) as Middleware<AppState>;