import { ImageForCreation } from "../../shared/types/image.types";
import { ImageModelType, LayerModelType } from "../db/model/buildAllModels";

export interface IModelsDB {
  create: (data: ImageForCreation) => Promise<any>;
}

export const buildImagesDB = ({
  imagesModel, layersModel
}: {
  imagesModel: ImageModelType;
  layersModel: LayerModelType;
}): IModelsDB => {

  const create = async (data: ImageForCreation) => {
    return imagesModel.create(data);
  };

  return {
    create,
  };
};