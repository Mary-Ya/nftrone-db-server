import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.config";

interface LayerAttributes {
  privateId?: number;
  id?: string;
  name: string;
  x: number;
  y: number;
  canvas_width: number;
  canvas_height: number;
  order: number; // layers order number in the project
  projectID: string;
}

class Layer extends Model { }

Layer.init({
  privateId: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: DataTypes.INTEGER.UNSIGNED,
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


export { Layer, LayerAttributes }