import { Router } from 'express';
import { getProjectRouter } from './project';
import { ModelsType } from '../db/model/buildAllModels';

export const buildAllRoutes = (prodModels: ModelsType) => {
  const router = Router();

  const projectRouter = getProjectRouter(prodModels);

  router.use('/project', projectRouter);
  return router;
}
export default buildAllRoutes;