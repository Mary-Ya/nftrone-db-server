import { Model } from "sequelize";
import { ModelGetter } from "./models.types";

const getLayersModel: ModelGetter = (sequelize, DataTypes) => {

  class Layer extends Model { }

  Layer.init({
    privateId: {
      type: DataTypes.INTEGER,
      defaultValue: DataTypes.INTEGER,
      primaryKey: true,
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

    // position of the layer on the canvas
    x: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    y: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // size of the canvas
    canvasWidth: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    canvasHeight: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // the order number of the layer in the project
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // project id that this layer belongs to
    projectID: {
      type: DataTypes.UUID,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'layer',
  });

  return Layer;
}

export { getLayersModel };