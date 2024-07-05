import { Router } from "express";
import { buildExpressCallback } from "../helpers/express-callback";
import { buildListPlaneProjects, buildListProjects } from "../services/projects";
import { Project } from "../db/model";
import { buildGetPlainProjects } from "../controllers/projects/getPlainProjects";
import { buildProjectsDB } from "../data-access/project";


const router = Router();

const ProjectsDB = buildProjectsDB({
  model: Project
});

router.get("/plain/all", buildExpressCallback(buildGetPlainProjects(
  {
    listProjects: buildListPlaneProjects({
      ProjectsDB
    })
  }
)));
// router.get("/project/all", buildExpressCallback(getProjects));
// router.post("/", buildExpressCallback(createProject));

export { router as projectRouter };