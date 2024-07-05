import { Sequelize } from "sequelize";

export const DB_NAME = 'nftrone-local.sqlite';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: `./db/${DB_NAME}`,
});

export default sequelize;
