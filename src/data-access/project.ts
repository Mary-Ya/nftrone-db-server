import { Model } from "sequelize";
import { PlaneProjectList, ProjectAttributes, ProjectForCreation, ReachProject, ReachProjectList } from "../../shared/types/project.types";
import { modelToPlainList } from "../data-mappers/model-to-plain-list";
import { LayerModelType, ProjectModelType } from "../db/model/buildAllModels";
import { IOneEntry } from "../helpers/express-callback";

export interface IProjectsDB {
  findAll: () => Promise<ReachProjectList>;
  findAllPlane: () => Promise<PlaneProjectList>;
  findById: (id: string) => Promise<IOneEntry<ReachProject>>;
  create: (data: ProjectForCreation) => Promise<ProjectAttributes>;
}

export const buildProjectsDB = ({
  model, layersModel
}: {
  model: ProjectModelType;
  layersModel: LayerModelType;
}): IProjectsDB => {
  const findAll = async () => {
    const projects = await model.findAll();
    return projects.map((project) => {
      return project.toJSON();
    });
  };

  const findAllPlane = async () => {
    const projects = await model.scope('plane').findAll();
    return modelToPlainList(projects);
  }

  const findById = async (id: string) => {
    const proj = (await model.findOne({
      where: { id }
    }))?.toJSON();

    if (!proj) {
      console.log('[PROJECT]: No project found for this ID:', id);
      return null;
    }

    // TODO: make it work with the options instead of manually fetching layers
    // for some reason, this would only return the first layer
    // however, changing model as I do below seems potentially problematic
    // due to possible mutation
    // const proj = await model.findOne({
    //   where: { id }, include: [{
    //     model: layersModel,
    //     separate: true, // This ensures all layers are fetched
    //     as: 'layers'
    //   }]
    // });

    const layers = await layersModel.findAll({
      where: { projectId: id }
    });
    proj.layers = layers.map((layer) => layer.toJSON());

    return proj;
  }

  const create = async (data: ProjectForCreation) => {
    return (await model.create(data)).toJSON();
  };

  return {
    findAll,
    findAllPlane,
    findById,
    create,
  };
};