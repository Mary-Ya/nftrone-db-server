import { Sequelize } from "sequelize";
import { buildAllModels } from "../model/buildAllModels";

export const associations = (sequelize: Sequelize) => {
  const { Project, Layer, Image } = buildAllModels(sequelize);

  Project.hasMany(Layer, {
    foreignKey: 'projectID',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    sourceKey: 'id',
    as: 'layers',
  });

  Layer.belongsTo(Project, {
    foreignKey: 'projectID',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    targetKey: 'id',
  });

  Layer.hasMany(Image, {
    foreignKey: 'layerID',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    sourceKey: 'id',
    as: 'images',
  });

  Image.belongsTo(Layer, {
    foreignKey: 'layerID',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    targetKey: 'id',
  });

  return { Project, Layer, Image };
}
