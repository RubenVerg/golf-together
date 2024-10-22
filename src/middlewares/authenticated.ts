import { Middleware } from '@oak/oak';

import { AppState } from '../types.d.ts';
import loadAccount from './load_account.ts';

export default (async function authenticated(ctx, next) {
	await loadAccount(ctx, () => Promise.resolve());
	if (!ctx.state.user) {
		ctx.response.status = 401;
		ctx.response.body = 'This request requires authentication.';
		return;
	}
	await next();
}) as Middleware<AppState>;