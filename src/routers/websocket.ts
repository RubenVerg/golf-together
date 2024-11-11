import { Router } from '@oak/oak';

import chat from '../controllers/websocket/chat.ts';
import authenticated from '../middlewares/authenticated.ts';

const router = new Router();

router.all('/chat/:id', authenticated, chat);

export default router;
