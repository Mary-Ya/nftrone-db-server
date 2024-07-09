import { DataTypes as SeqDataTypes, Model, Sequelize } from "sequelize";
import { LayerAttributes } from "./layer";

export interface ProjectAttributes {
  id?: string;
  name: string;
  canvas_height?: number;
  canvas_width?: number;
  background_color?: string;
  layers?: LayerAttributes[];
}


export const getProjectsModel = (sequelize: Sequelize, DataTypes: typeof SeqDataTypes) => {
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
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    },
    scopes: {
      plane: {
        attributes: {
          exclude: ["layers", "privateId", "createdAt", "updatedAt"]
        }
      }
    },
  });

  return Project;
};
