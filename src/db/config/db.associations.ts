import { Project, Layer, Image } from "../model";

export const associations = () => {
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
}
