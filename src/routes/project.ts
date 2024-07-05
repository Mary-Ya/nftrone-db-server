import { ModelNames, ModelsType } from './../db/model/buildAllModels';
import { Router } from "express";
import { buildExpressCallback } from "../helpers/express-callback";
import { buildListPlaneProjects } from "../services/projects";
import { buildGetPlainProjects } from "../controllers/projects/getPlainProjects";
import { buildProjectsDB } from "../data-access/project";


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
  // router.get("/project/all", buildExpressCallback(getProjects));
  // router.post("/", buildExpressCallback(createProject));

  return router;
}


export { getProjectRouter };