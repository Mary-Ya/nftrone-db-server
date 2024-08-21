import { ModelNames, ModelsType } from '../db/model/buildAllModels';
import { Router } from "express";
import { imageEndpoints } from '../../shared/endpoints/image';
import multer from 'multer';
import fs from 'fs';
import mime from 'mime-types';
import { ImagesToPost } from '../../shared/types/image.types';
import { buildLayersDB } from '../data-access/layer';
import { buildImagesDB } from '../data-access/image';
import { buildProjectsDB } from '../data-access/project';

const sourceImagesRoot = './uploads';

const getDirName = (projId: string, layerID: string) => {
  return getProjectName(projId) + '/' + layerID;
}

const getProjectName = (projId: string) => {
  return sourceImagesRoot + '/' + projId;
}

const storage = multer.diskStorage({
  destination: function (req: any, file, cb) {
    const { projectID, layerID } = req.body;
    const projectPath = getProjectName(projectID);

    // create project dir if not exist
    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath);
    }

    const path = getDirName(projectID, layerID);

    // create layer dir if not exist
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    cb(null, path);
  },
  filename: function (req, file, cb) {
    try {
      const ext = mime.extension(file.mimetype);
      let fullFileName = file.originalname.split('.').slice(0, -1).join('.');
      const { projectID, layerID } = req.body as ImagesToPost;
      const path = getDirName(projectID, layerID);

      // add file if file with this name not exist in dir or add with hash if exist
      const files = fs.readdirSync(path);

      let hasThisImage = false;
      if (files.includes(fullFileName + '.' + ext)) {
        hasThisImage = true;
      }

      // add hash to filename if file with this name exist
      if (hasThisImage) {
        const hash = Math.random().toString(36).substring(7);
        fullFileName = fullFileName + hash
      }

      cb(null, fullFileName + '.' + ext);
    } catch (err) {
      console.error('Error creating layer:', err);
    }
  }
})

// Set up multer for handling multipart/form-data
const upload = multer({ storage });

const getImagesRouter = (prodModels: ModelsType) => {
  const router = Router();

  const ProjectsDB = buildProjectsDB({
    model: prodModels[ModelNames.Project],
    layersModel: prodModels[ModelNames.Layer],
  });

  const LayersDB = buildLayersDB({
    layersModel: prodModels[ModelNames.Layer],
    imagesModel: prodModels[ModelNames.Image]
  });

  const ImagesDB = buildImagesDB({
    imagesModel: prodModels[ModelNames.Image],
    layersModel: prodModels[ModelNames.Layer]
  });

  // TODO: Error handling
  router.post(imageEndpoints.root + imageEndpoints.post.create, upload.any(), async (req, res) => {
    const { projectID, layerID } = req.body as ImagesToPost;
    console.log('Request files:', req.files);
    console.log('Request body:', req.body);

    await LayersDB.findById(layerID).then((layer) => {
      console.log('Layer found:', layer);

      if (!layer) {
        return res.send({ message: 'Layer not found' });
      }

      const images = req.files as Express.Multer.File[];
      const imageSavers = images.map((image) => {
        return ImagesDB.create({
          layerID: layerID,
          name: image.filename,
        });
      });

      return Promise.all(imageSavers).then((images) => {
        console.log('Images created:', images);
        return res.send({
          message: 'Images created successfully',
          images: images
        });
      }).catch((err) => {
        console.error('Error creating layer:', err);
        return res.send({
          message: 'Error creating layer',
        });
      });

    });
  });

  router.get(imageEndpoints.root + imageEndpoints.generate, async (req, res) => {
    const { projectID } = req.params;
    console.log('Request params:', req.params);

    console.log('[DEBUG] Images:');
    const project = await ProjectsDB.findById(projectID);
    console.log('Project found:', project);
    const layers = (project as any).layers;
    if (!layers) {
      return res.status(404).send({ message: 'Layers not found' });
    }

    const layerCount = layers.length;
    let takenIndexes: boolean[] = [];

    // for each layer, get image count. 
    // if image count is more than 0, pick one randomly
    // if image count is 0, skip.
    // if image count is 0 for all layers, return error
    const p = layers.map((layer: any) => {
      let result: any[] = [];
      takenIndexes = [];
      return LayersDB.findById(layer.id).then((layer: any) => {
        const imageCount = layer.images?.length;
        if (imageCount > 0) {
          let randomIndex = Math.floor(Math.random() * imageCount);
          if (takenIndexes[randomIndex]) {
            randomIndex = Math.floor(Math.random() * imageCount);
            result[layer.order] = layer.images[randomIndex];
          } else {
            takenIndexes[randomIndex] = true;
            result[layer.order] = layer.images[randomIndex];
          }
        }
        console.log('Images found:', result);
        return result;
      });
    });

    console.log('[DEBUG] Images:');
    const result = await Promise.all(p).then((result) => {
      if (result.length === 0) {
        return res.status(404).send({ message: 'Images not found' });
      }
      console.log('Images found:', result);
      return result;
    });

    return res.status(200).send({
      body: {
        message: 'Layers found',
        result: (result as any[]).map((r) => {
          return r[0];
        })
      }
    });

  });

  return router;
}


export { getImagesRouter };