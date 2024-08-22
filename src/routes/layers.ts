import { ModelNames, ModelsType } from '../db/model/buildAllModels';
import { Router } from "express";
import { buildProjectsDB } from "../data-access/project";
import { layerEndpoints } from '../../shared/endpoints/layer';
import { buildLayersDB } from '../data-access/layer';


const getLayersRouter = (prodModels: ModelsType) => {
  const router = Router();

  const ProjectsDB = buildProjectsDB({
    model: prodModels[ModelNames.Project],
    layersModel: prodModels[ModelNames.Layer]
  });
  const LayersDB = buildLayersDB({
    layersModel: prodModels[ModelNames.Layer],
    imagesModel: prodModels[ModelNames.Image]
  });

  router.get(layerEndpoints.get.byId, async (req, res) => {
    try {
      const { id } = req.params;
      const layer = await LayersDB.findById(id);

      if (!layer) {
        return res.status(404).send({ message: 'Layer not found' });
      }

      res.status(200).send({
        body: {
          message: 'Layer found',
          layer
        }
      });
    } catch (err) {
      console.error('Error getting layer:', err);
      res.status(500).send({
        message: 'Error getting layer',
        error: err
      });
    };
  });

  router.post(layerEndpoints.post.create, async (req, res) => {
    try {
      const { name, order, projectID } = req.body;
      console.log('Request body:', req.body);

      const project = await ProjectsDB.findById(projectID);
      console.log('Project found:', project);

      if (!project) {
        return res.status(404).send({ message: 'Project not found' });
      }

      // TODO: use LayerDB instead of directly creating layer
      const newLayer = await prodModels[ModelNames.Layer].create({
        projectID: projectID,
        name,
        order: order || 0,
      });

      newLayer.validate().then(() => {
        console.log('Layer is valid');
        newLayer.save().then(() => {

          console.log('Layer created:', newLayer.toJSON());
          res.status(201).send({
            message: 'Layer created successfully',
            layer: newLayer
          });
        }).catch((err) => {
          console.error('Error creating layer:', err);
          res.status(500).send({
            message: 'Error creating layer',
            error: err
          });
        }
        )
      }).catch((err) => {
        console.error('Error creating layer:', err);
        res.status(500).send({
          message: 'Error creating layer',
          error: err
        });
      })
    } catch (err) {
      console.error('Error creating layer:', err);
      res.status(500).send({
        message: 'Error creating layer',
        error: err
      });
    };
  });
  return router;
}


export { getLayersRouter };