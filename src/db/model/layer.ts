import { Model } from "sequelize";
import { ModelGetter } from "./models.types";

const getLayersModel: ModelGetter = (sequelize, DataTypes, options) => {
  class Layer extends Model { }

  Layer.init({
    privateId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    x: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    y: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    canvas_width: {
      type: DataTypes.INTEGER,
    },
    canvas_height: {
      type: DataTypes.INTEGER,
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    projectID: {
      type: DataTypes.UUID,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'layer',
    defaultScope: {
      ...options?.defaultScope,
      attributes: {
        exclude: [...(options?.defaultScope?.attributes?.exclude || []), "createdAt", "updatedAt"]
      },
    },
    ...options
  });

  return Layer;
};

export { getLayersModel };