import { Router } from '@oak/oak';

import apiRouter from './api.ts';

const router = new Router();

router.get('/', ({ response }) => { response.body = ''; });
router.all('/api', apiRouter.routes(), apiRouter.allowedMethods());

export default router;
