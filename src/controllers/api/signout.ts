import { Middleware } from '@oak/oak';

import { AppState } from '../../types.d.ts';
import { stringify as stringifyCookie } from '../../lib/cookie.ts';

export default (function signout({ response, state }) {
	response.status = state.user ? 200 : 400;
	response.headers.append('Set-Cookie', stringifyCookie({ name: 'token', value: '', expires: new Date(0), samesite: 'Strict' }));
	response.body = '';
}) as Middleware<AppState>;
