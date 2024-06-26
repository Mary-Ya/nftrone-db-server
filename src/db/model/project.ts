import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.config";

interface ProjectAttributes {
  id?: string;
  name: string;
  canvas_height: number;
  canvas_width: number;
  background_color: string;
}

class Project extends Model { }

Project.init({
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

  // canvas size of the project.
  // your resulting images are going to be rendered in this size
  canvasHeight: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  canvasWidth: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  // background color of the resulting images
  background_color: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'project',
});

export { Project, ProjectAttributes }