import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.config";

interface ImageAttributes {
  privateId?: number;
  id?: string;
  name: string;
  metadata?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  layerID: string;
}

class Image extends Model { }

Image.init({
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
  metadata: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // scale and position of the image on the canvas
  x: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  y: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  width: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  height: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },


  layerID: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'image',
});

export { Image, ImageAttributes }