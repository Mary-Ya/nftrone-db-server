import { Sequelize } from "sequelize";
const DB_NAME = 'nftrone-local.sqlite';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: `./${DB_NAME}`,
});

export default sequelize;
