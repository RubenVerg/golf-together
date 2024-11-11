import { Router, Middleware, send } from '@oak/oak';

import apiRouter from './api.ts';
import websocketRouter from './websocket.ts';
import { HtmlPage, renderHtml } from '../lib/render_html.ts';
import { AppState } from '../types.d.ts';
import loadAccount from '../middlewares/load_account.ts';
import login from '../controllers/login.ts';
import register from '../controllers/register.ts';
import logout from '../controllers/logout.ts';
import authenticated from '../middlewares/authenticated.ts';
import newHole from '../controllers/new_hole.ts';
import newApproach from '../controllers/new_approach.ts';
import newSolution from '../controllers/new_solution.ts';
import improveSolution from '../controllers/improve_solution.ts';
import newLanguage from '../controllers/new_language.ts';

const router = new Router();

router.use('/api', apiRouter.routes(), apiRouter.allowedMethods());
router.use('/websocket', websocketRouter.routes(), websocketRouter.allowedMethods());

router.use(loadAccount);

const makeRenderMiddleware = <Args extends unknown[]>(page: HtmlPage<Args>, ...args: Args) => (async ctx => {
	ctx.response.with(await renderHtml(ctx.state, page, ...args));
}) as Middleware<AppState>;

router.get('/favicon.ico', async ({ response }) => {
	response.body = await Deno.readFile('./static/favicon.ico');
});

router.get('/', makeRenderMiddleware(await import('../views/index.tsx')));
router
	.post('/language/new', authenticated, newLanguage);
router
	.get('/hole/new', authenticated, makeRenderMiddleware(await import('../views/new_hole.tsx')))
	.post('/hole/new', authenticated, newHole)
	.post('/hole/:id/approach/new', authenticated, newApproach)
	.post('/hole/:id/approach/:approachId/new', authenticated, newSolution)
	.post('/hole/:id/solution/:solutionId/improve', authenticated, improveSolution);
router.get('/hole/:id', async ({ state, params, response }) => response.with(await renderHtml(state, await import('../views/hole.tsx'), Number.parseInt(params.id))));
router.get('/chat/:id', authenticated, async ({ state, params, response }) => response.with(await renderHtml(state, await import('../views/chatroom.tsx'), Number.parseInt(params.id))));
router
	.get('/login', makeRenderMiddleware(await import('../views/login.tsx')))
	.post('/login', login)
	.get('/register', makeRenderMiddleware(await import('../views/register.tsx')))
	.post('/register', register)
	.post('/logout', logout);

router.use('/static', async ctx => {
	if (ctx.request.method !== 'GET') {
		ctx.response.status = 405;
		ctx.response.body = 'Method not allowed';
		return;
	}
	await send(ctx, ctx.request.url.pathname);
});

router.get('/(.*)', ({ request, response }) => {
	console.log('404', request.method, request.url.toString());
	response.status = 404;
	response.body = 'Not found';
})

export default router;
