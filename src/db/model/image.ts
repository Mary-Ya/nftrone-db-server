import { Model } from "sequelize";
import { ModelGetter } from "./models.types";

const getImagesModel: ModelGetter = (sequelize, DataTypes, options) => {
  class Image extends Model { }

  Image.init({
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
    metadata: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // scale and position of the image on the canvas
    x: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    y: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    layerID: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'image',
    defaultScope: {
      ...options?.defaultScope,
      attributes: {
        exclude: [...(options?.defaultScope?.attributes?.exclude || []), "createdAt", "updatedAt"]
      },
    },
  });

  return Image;
}

export { getImagesModel };