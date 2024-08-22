import { ModelNames, ModelsType } from '../db/model/buildAllModels';
import { Router } from "express";
import { buildExpressCallback } from "../helpers/express-callback";
import { buildCreateProject, buildGetProject, buildListPlaneProjects, buildListProjects } from "../services/projects";
import { buildGetPlainProjects } from "../controllers/projects/getPlainProjects";
import { buildProjectsDB } from "../data-access/project";
import { buildGetProjects } from '../controllers/projects/getAllProjects';
import { projectEndpoints } from '../../shared/endpoints/project';
import { buildGetOneProject } from '../controllers/projects/getProject';


const getProjectRouter = (prodModels: ModelsType) => {
  const router = Router();

  const ProjectsDB = buildProjectsDB({
    model: prodModels[ModelNames.Project],
    layersModel: prodModels[ModelNames.Layer]
  });

  router.get(projectEndpoints.get.allPlain, buildExpressCallback(buildGetPlainProjects(
    {
      listPlainProjects: buildListPlaneProjects({
        ProjectsDB
      })
    }
  )));
  router.get(projectEndpoints.get.all, buildExpressCallback(buildGetProjects(
    {
      listProjects: buildListProjects({
        ProjectsDB
      })
    }
  )));

  router.get(projectEndpoints.get.byId, buildExpressCallback(buildGetOneProject(
    {
      getProject: buildGetProject({
        ProjectsDB
      })
    }
  )));

  router.post(projectEndpoints.post.create, buildExpressCallback(buildCreateProject({
    ProjectsDB
  })));

  return router;
}


export { getProjectRouter };