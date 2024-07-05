import { Sequelize, DataTypes } from "sequelize";
import { getImagesModel } from "./image";
import { getLayersModel } from "./layer";
import { getProjectsModel } from "./project";

export const enum ModelNames {
  Layer = "Layer",
  Image = "Image",
  Project = "Project",
}

export const buildAllModels = (sequelize: Sequelize) => {
  const models = {
    [ModelNames.Layer]: getLayersModel(sequelize, DataTypes),
    [ModelNames.Image]: getImagesModel(sequelize, DataTypes),
    [ModelNames.Project]: getProjectsModel(sequelize, DataTypes),
  };

  return models;
}

export type ModelsType = ReturnType<typeof buildAllModels>;
export type ProjectModelType = ModelsType[ModelNames.Project];
export type LayerModelType = ModelsType[ModelNames.Layer];
export type ImageModelType = ModelsType[ModelNames.Image];