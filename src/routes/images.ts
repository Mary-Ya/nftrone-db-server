import { ModelNames, ModelsType } from '../db/model/buildAllModels';
import { Router } from "express";
import { imageEndpoints } from '../../shared/endpoints/image';
import multer from 'multer';
import fs from 'fs';
import mime from 'mime-types';
import { ImagesToPost } from '../../shared/types/image.types';
import { buildLayersDB } from '../data-access/layer';
import { buildImagesDB } from '../data-access/image';

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

    LayersDB.findById(layerID).then((layer) => {
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
  return router;
}


export { getImagesRouter };