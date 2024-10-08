import { ModelNames, ModelsType } from '../db/model/buildAllModels';
import { Router } from "express";
import { buildProjectsDB } from "../data-access/project";
import { layerEndpoints } from '../../shared/endpoints/layer';
import { buildLayersDB } from '../data-access/layer';
import { buildExpressCallback } from '../helpers/express-callback';
import { buildGetLayer } from '../services/layers';
import { composeLayerDataFromDB } from '../controllers/layers/composeLayerDataFromDB';


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

  router.get(layerEndpoints.get.byId, buildExpressCallback(
    composeLayerDataFromDB({
      getLayer: buildGetLayer({
        LayersDB
      })
    })
  ));

  router.post(layerEndpoints.post.create, async (req, res) => {
    try {
      const { name, order, projectID } = req.body;
      console.log('Request body:', req.body);

      const project = await ProjectsDB.findById(projectID);
      console.log('Project found:', project);

      if (!project) {
        return res.status(404).send({ message: 'Project not found' });
      }

      const newLayer = await LayersDB.create({
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
        })
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