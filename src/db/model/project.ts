import { Model } from "sequelize";
import { ModelGetter } from "./models.types";


export const getProjectsModel: ModelGetter = (sequelize, DataTypes, options) => {
  class Project extends Model { }

  Project.init({
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

    // canvas size of the project.
    // your resulting images are going to be rendered in this size
    canvas_height: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    canvas_width: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // // background color of the resulting images
    background_color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'project',
    defaultScope: {
      ...options?.defaultScope,
      attributes: {
        exclude: [...options?.defaultScope?.attributes?.exclude, "createdAt", "updatedAt"],
      },
    },
    scopes: {
      plane: {
        attributes: {
          exclude: [...options?.defaultScope?.attributes?.exclude, "layers", "createdAt", "updatedAt"]
        }
      },
      ...options?.scopes
    },
    ...options
  });

  return Project;
};
