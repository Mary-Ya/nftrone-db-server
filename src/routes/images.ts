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
        console.log('Image:', image);
        const img: ImageAttributes = {
          layerID: layerID,
          name: image.filename,
        }
        // svgDim.get(image.path, function (_err: string, dimensions: { width: any; height: any; }) {
        //   console.log(dimensions.width, dimensions.height);
        //   img.width = dimensions.width;
        //   img.height = dimensions.height;
        // })
        return ImagesDB.create(img);
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

  const getRandomImage = (takenIndexes: boolean[]) => {
    console.log('Taken indexes:', takenIndexes);
    if (!takenIndexes.find((i) => !i)) {
      return null;
    }

    let randomIndex = Math.floor(Math.random() * takenIndexes.length);
    console.log('Random index:', randomIndex);
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
    console.log('Request params:', req.params);

    const project = await ProjectsDB.findById(projectID);
    console.log('Project found:', project);
    const layers = (project as any).layers as LayerAttributes[];
    if (!layers) {
      return res.status(404).send({ message: 'Layers not found' });
    }
    console.log('Layers found:', layers.length);

    const reachLayersLoader = layers.map((layer: any) => LayersDB.findById(layer.id));

    const reachLayers = await Promise.all(reachLayersLoader)

    //   .then((layers) => {
    //   console.log('Layers loaded:', layers);
    //   return layers.filter((layer) => {
    //     console.log('Layer:', layer);
    //     const layerImages = (layer as any).images as any[];
    //     layerImages && layerImages.length > 0;
    //   });
    // });

    console.log('Reach layers:', reachLayers.length);

    if (reachLayers.length === 0) {
      return res.status(404).send({ message: 'No layers with images found' });
    }

    const numCombos = layers.reduce((acc, layer, index) => {
      if (acc > 10) {
        reachLayers.length = 10;
        return acc;
      }
      return acc * ((reachLayers as any)[index].images as any[]).length
    }, 1);

    console.log('Number of combos:', numCombos);
    const combos = new Set<string>();
    const result: ImageAttributes[][] = [];

    while (combos.size < numCombos) {
      const combo = reachLayers.map((layer) => {
        const images = (layer as any).images as any[];
        const ind = randomIndex(images.length);
        const image = images[ind];
        console.log('Image:', image);
        return images ? ind : -1
      });
      console.log('Combo:', combo);
      if (combo.every(index => index === -1)) {
        console.log('No valid images found in any layer.');
        break;
      }
      const comboKey = combo.join(',');
      combos.add(comboKey);
    }
    console.log('Combos:', combos);

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