import { Router, Middleware } from '@oak/oak';

import apiRouter from './api.ts';
import { HtmlPage, renderHtml } from '../lib/render_html.ts';
import { AppState } from '../types.d.ts';
import loadAccount from '../middlewares/load_account.ts';
import login from '../controllers/login.ts';

const router = new Router();

router.use('/api', apiRouter.routes(), apiRouter.allowedMethods());

router.use(loadAccount);

const makeRenderMiddleware = (page: HtmlPage) => (async ctx => {
	ctx.response.with(await renderHtml(ctx.state, page));
}) as Middleware<AppState>;

router.get('/', makeRenderMiddleware(await import('../views/index.tsx')));
router
	.get('/login', makeRenderMiddleware(await import('../views/login.tsx')))
	.post('/login', login);

router.get('/(.*)', ({ response }) => {
	response.status = 404;
	response.body = 'Not found';
})

export default router;
