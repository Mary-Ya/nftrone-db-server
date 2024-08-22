import { LayerAttributes } from "../../shared/types/layer.types";
import { ReachProject } from "../../shared/types/project.types";
import { ImageModelType, LayerModelType } from "../db/model/buildAllModels";
import { IOneProject } from "../services/projects";

export interface ILayersDB {
  findById: (id: string) => Promise<IOneProject<LayerAttributes>>;
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

  return {
    findById,
  };
};