import { Router } from '@oak/oak';

import signup from '../controllers/api/signup.ts';
import signin from '../controllers/api/signin.ts';
import myInfo from '../controllers/api/my_info.ts';
import signout from '../controllers/api/signout.ts';
import authenticated from '../middlewares/authenticated.ts';
import createHole from '../controllers/api/create_hole.ts';

const router = new Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', signout);
router.get('/my_info', authenticated, myInfo);
router.post('/hole', authenticated, createHole)

export default router;
