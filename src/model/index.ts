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
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  canvas_height: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  canvas_width: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  background_color: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'project',
});

export { Project, ProjectAttributes }