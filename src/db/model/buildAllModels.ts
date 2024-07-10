import { Sequelize, DataTypes, ModelOptions } from "sequelize";
import { getImagesModel } from "./image";
import { getLayersModel } from "./layer";
import { getProjectsModel } from "./project";
import { ModelGetter } from "./models.types";

export const enum ModelNames {
  Layer = "Layer",
  Image = "Image",
  Project = "Project",
}

const globalModelOptions: ModelOptions = {
  defaultScope: {
    attributes: {
      exclude: ["privateId"]
    }
  }
}

export const applyGlobalModelSettings = (sequelize: Sequelize, modelGetter: ModelGetter) => {
  return modelGetter(sequelize, DataTypes, globalModelOptions);
}

export const buildAllModels = (sequelize: Sequelize) => {
  const models = {
    [ModelNames.Layer]: applyGlobalModelSettings(sequelize, getLayersModel),
    [ModelNames.Image]: applyGlobalModelSettings(sequelize, getImagesModel),
    [ModelNames.Project]: applyGlobalModelSettings(sequelize, getProjectsModel),
  };

  return models;
}

export type ModelsType = ReturnType<typeof buildAllModels>;
export type ProjectModelType = ModelsType[ModelNames.Project];
export type LayerModelType = ModelsType[ModelNames.Layer];
export type ImageModelType = ModelsType[ModelNames.Image];