import { ModelNames, ModelsType } from '../db/model/buildAllModels';
import { Router } from "express";
import { buildExpressCallback } from "../helpers/express-callback";
import { buildGetProject, buildListPlaneProjects, buildListProjects } from "../services/projects";
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

  router.post(projectEndpoints.post.create, (req, res) => {
    const { name, canvas_height, canvas_width, background_color } = req.body;
    const newProject = prodModels.Project.build({
      name,
      canvas_height,
      canvas_width,
      background_color
    });
    console.log('[PROJECT]: New project: ', newProject);
    newProject.validate().then(() => {

      console.log('[PROJECT]: Project is valid');
      newProject.save().then(() => {
        res.send({
          message: 'Project created successfully',
          project: newProject
        });
      }).catch((err: Error) => {
        console.log('[PROJECT]: Error creating project: ', err);
        res.send(err);
      });
    }).catch((err: Error) => {
      console.log('[PROJECT]: Error validating project: ', err);
      res.send(err);
    });
  });

  return router;
}


export { getProjectRouter };