import { Model } from "sequelize";
import { ModelGetter } from "./models.types";

const getImagesModel: ModelGetter = (sequelize, DataTypes) => {
  class Image extends Model { }

  Image.init({
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
    metadata: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // scale and position of the image on the canvas
    x: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    y: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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

  return Image;
}

export { getImagesModel };