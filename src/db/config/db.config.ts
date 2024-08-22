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

  public async start(test = false) {
    try {
      await DB.instance.authenticate();
      DB.models = associations(DB.instance);
      console.log('[DB]: Connection has been established successfully.');

      await DB.instance.sync({
        force: test,
      });
      console.log('[DB]: Database and tables synced!');
    } catch (error) {
      console.error('[DB]: Unable to connect to the database:', error);
    }

    return DB.instance;
  }

  public getModel = (modelName: string) => {
    return DB.models[modelName];
  }

  public getModels = () => {
    return DB.models;
  }

  public async close() {
    return DB.instance.close();
  }

  public async getSequelize() {
    return DB.instance;
  }
}
