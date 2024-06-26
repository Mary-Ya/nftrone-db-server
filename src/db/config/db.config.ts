import { Sequelize } from "sequelize";

const DB_NAME = 'nftrone-local.sqlite';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: `./src/db/${DB_NAME}`,
});

export default sequelize;
