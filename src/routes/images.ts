import { ModelNames, ModelsType } from '../db/model/buildAllModels';
import { Router } from "express";
import { imageEndpoints } from '../../shared/endpoints/image';
import multer from 'multer';
import fs from 'fs';
import mime from 'mime-types';
import { ImagesToPost, ImageAttributes } from "../../shared/types/image.types";
import { buildLayersDB } from '../data-access/layer';
import { buildImagesDB } from '../data-access/image';
import { buildProjectsDB } from '../data-access/project';
import { LayerAttributes } from "../../shared/types/layer.types";
import { logger } from '../helpers/logger';

const sourceImagesRoot = './uploads';
const logOnImageRoute = logger.getScopedLogger('IMAGES_ROUTE');

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
      logOnImageRoute('Error creating layer:', err);
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

    await LayersDB.findById(layerID).then((layer) => {
      logOnImageRoute('Layer found: ', layer);

      if (!layer) {
        return res.send({ message: 'Layer not found' });
      }

      const images = req.files as Express.Multer.File[];
      const imageSavers = images.map((image) => {
        logOnImageRoute('Image:', image);
        const img: ImageAttributes = {
          layerID: layerID,
          name: image.filename,
        }

        return ImagesDB.create(img);
      });

      return Promise.all(imageSavers).then((images) => {
        logOnImageRoute('Images created: ', images);
        return res.send({
          message: 'Images created successfully',
          images: images
        });
      }).catch((err) => {
        logOnImageRoute('Error creating images: ', err);
        return res.send({
          message: 'Error creating layer',
        });
      });

    });
  });

  const getRandomImage = (takenIndexes: boolean[]) => {
    if (!takenIndexes.find((i) => !i)) {
      return null;
    }

    let randomIndex = Math.floor(Math.random() * takenIndexes.length);
    if (takenIndexes[randomIndex]) {
      return getRandomImage(takenIndexes);
    }

    return randomIndex;
  }

  function randomIndex(length: number) {
    return Math.floor(Math.random() * length);
  }

  router.get(imageEndpoints.root + imageEndpoints.generate, async (req, res) => {
    const { projectID } = req.params;
    logOnImageRoute('Generating combos for project:', projectID);

    const project = await ProjectsDB.findById(projectID);
    logOnImageRoute('Project:', project);

    const layers = (project as any).layers as LayerAttributes[];
    if (!layers) {
      return res.status(404).send({ message: 'Layers not found' });
    }
    logOnImageRoute('Layers: ', layers);

    const reachLayersLoader = layers.map((layer: any) => LayersDB.findById(layer.id));

    const reachLayersAll = await (await Promise.all(reachLayersLoader))

    // make sure that all layers are with readable values
    // TBD: make sure that it's impossible to have layers without any readable data at all
    const reachLayers = reachLayersAll.filter(Boolean);
    console.log('reachLayers:', reachLayers.length);

    if (reachLayers.length === 0) {
      return res.status(404).send({ message: 'No layers with images found' });
    }

    const numCombos = layers.reduce((acc, layer, index) => {
      // if (acc > 10) {
      //   reachLayers.length = 10;
      //   return acc;
      // }
      return acc * ((reachLayers as any)[index].images as any[]).length
    }, 1);

    logOnImageRoute('Num combos: ', numCombos);

    const combos = new Set<string>();

    // allow only 10 combos for now
    while (combos.size < Math.min(numCombos, 10)) {
      let hasImage = false;
      // console.log(reachLayers)
      console.log('reachLayers:', reachLayers.length);
      const combo = reachLayers.map((layer) => {
        const images = layer.images;
        console.log('images:', images?.length);
        if (!images) {
          return -1;
        }
        hasImage = true;
        const ind = randomIndex(images.length);
        return ind;
      });

      if (!hasImage) {
        break;
      }
      console.log('Combo:', combo.length);
      // transformed into a string to be able to have unique combos in Set without having to compare arrays
      const comboKey = combo.join(',');
      combos.add(comboKey);
      console.log('Combo: ', comboKey, "combos size: ", combos.size + 'out of' + numCombos);
    }
    return res.status(200).send({
      body: {
        message: 'Combos generated',
        result: Array.from(combos).map((combo) => combo.split(',').map((imageIndex, layerIndex) => {
          const images = (reachLayers[reachLayers.length - 1 - layerIndex] as any).images as any[];
          return images[imageIndex as any];
        })),
      }
    });
  });

  return router;
}

export { getImagesRouter };