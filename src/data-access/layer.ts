import { Model } from "sequelize";
import { LayerAttributes, LayerForCreation } from "../../shared/types/layer.types";
import { ImageModelType, LayerModelType } from "../db/model/buildAllModels";
import { IOneEntry } from "../helpers/express-callback";

export interface ILayersDB {
  // keep Model<> to be able to validate and react to validation at place of call
  create: (data: LayerForCreation) => Promise<Model<LayerAttributes>>;

  findById: (id: string) => Promise<IOneEntry<LayerAttributes>>;
}

export const buildLayersDB = ({
  layersModel,
  imagesModel,
}: {
  layersModel: LayerModelType;
  imagesModel: ImageModelType;
}): ILayersDB => {

  const findById = async (id: string) => {
    const proj = (await layersModel.findOne({
      where: { id }
    }))?.toJSON();

    const images = await imagesModel.findAll({
      where: { layerId: id }
    });

    proj.images = images.map((image) => image.toJSON());

    return proj;
  }

  const create = async (data: LayerForCreation) => {
    return layersModel.create(data);
  }

  return {
    findById,
    create
  };
};