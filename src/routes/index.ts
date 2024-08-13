import { Router } from 'express';
import { getProjectRouter } from './project';
import { ModelsType } from '../db/model/buildAllModels';
import { projectEndpoints } from '../../shared/endpoints/project';
import { layerEndpoints } from '../../shared/endpoints/layer';
import { getLayersRouter } from './layers';

export const buildAllRoutes = (prodModels: ModelsType) => {
  const router = Router();

  const projectRouter = getProjectRouter(prodModels);
  router.use(projectEndpoints.root, projectRouter);

  const layerRouter = getLayersRouter(prodModels);
  router.use(layerEndpoints.root, layerRouter);

  return router;
}
export default buildAllRoutes;