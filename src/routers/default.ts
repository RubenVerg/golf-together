import { Router, Middleware } from '@oak/oak';

import apiRouter from './api.ts';
import { HtmlPage, renderHtml } from '../lib/render_html.ts';
import { AppState } from '../types.d.ts';
import loadAccount from '../middlewares/load_account.ts';
import login from '../controllers/login.ts';
import register from '../controllers/register.ts';
import logout from '../controllers/logout.ts';

const router = new Router();

router.use('/api', apiRouter.routes(), apiRouter.allowedMethods());

router.use(loadAccount);

const makeRenderMiddleware = <Args extends unknown[]>(page: HtmlPage<Args>, ...args: Args) => (async ctx => {
	ctx.response.with(await renderHtml(ctx.state, page, ...args));
}) as Middleware<AppState>;

router.get('/', makeRenderMiddleware(await import('../views/index.tsx')));
router.get('/hole/:id', async ({ state, params, response }) => response.with(await renderHtml(state, await import('../views/hole.tsx'), Number.parseInt(params.id))));
router
	.get('/login', makeRenderMiddleware(await import('../views/login.tsx')))
	.post('/login', login)
	.get('/register', makeRenderMiddleware(await import('../views/register.tsx')))
	.post('/register', register)
	.post('/logout', logout);

router.get('/(.*)', ({ response }) => {
	response.status = 404;
	response.body = 'Not found';
})

export default router;
