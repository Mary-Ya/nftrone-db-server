import { Sequelize } from "sequelize";
import { buildAllModels } from "../model/buildAllModels";

export const associations = (sequelize: Sequelize) => {
  const { Project, Layer, Image } = buildAllModels(sequelize);

  Project.hasMany(Layer, {
    foreignKey: 'projectID',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  Layer.belongsTo(Project, {
    foreignKey: 'projectID',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    targetKey: 'privateId',
  });

  Layer.hasMany(Image, {
    foreignKey: 'layerID',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  Image.belongsTo(Layer, {
    foreignKey: 'layerID',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    targetKey: 'privateId',
  });

  return { Project, Layer, Image };
}
