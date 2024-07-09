import { ModelNames, ModelsType } from './../db/model/buildAllModels';
import { Router } from "express";
import { buildExpressCallback } from "../helpers/express-callback";
import { buildListPlaneProjects, buildListProjects } from "../services/projects";
import { buildGetPlainProjects } from "../controllers/projects/getPlainProjects";
import { buildProjectsDB } from "../data-access/project";
import { buildGetProjects } from '../controllers/projects/getAllProjects';


const getProjectRouter = (prodModels: ModelsType) => {

  const router = Router();

  router.get("/plain/all", buildExpressCallback(buildGetPlainProjects(
    {
      listProjects: buildListPlaneProjects({
        ProjectsDB: buildProjectsDB({
          model: prodModels[ModelNames.Project]
        })
      })
    }
  )));
  router.get("/all", buildExpressCallback(buildGetProjects(
    {
      listProjects: buildListProjects({
        ProjectsDB: buildProjectsDB({
          model: prodModels[ModelNames.Project]
        })
      })
    }
  )));
  // router.post("/", buildExpressCallback(createProject));

  return router;
}


export { getProjectRouter };