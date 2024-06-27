import { Router } from 'express';

import projectApi from './project';

const router = Router();

router.use('/project', projectApi);

export default router;