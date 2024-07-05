import { Sequelize } from "sequelize";
import { associations } from "./db.associations";

export const DB_NAME = 'nftrone-local.sqlite';
export const BD_ROOT = './db';

export class DB {
  private static instance: any;
  private static models: any;

  constructor(fileName: string) {
    DB.instance = new Sequelize({
      dialect: 'sqlite',
      storage: `${BD_ROOT}/${fileName}`,
    });
  }

  public async start() {
    try {
      await DB.instance.authenticate();
      DB.models = associations(DB.instance);
      console.log('Connection has been established successfully.');

      await DB.instance.sync({
        force: true
      });
      console.log('Database and tables synced!');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }

    return DB.instance;
  }

  public getModel = (modelName: string) => {
    return DB.models[modelName];
  }

  public getModels = () => {
    return DB.models;
  }
}
