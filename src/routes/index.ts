import { Router } from 'express';
import { getProjectRouter } from './project';
import { ModelsType } from '../db/model/buildAllModels';
import { projectEndpoints } from '../../shared/endpoints/project';

export const buildAllRoutes = (prodModels: ModelsType) => {
  const router = Router();

  const projectRouter = getProjectRouter(prodModels);

  router.use(projectEndpoints.root, projectRouter);
  return router;
}
export default buildAllRoutes;