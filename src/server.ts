import express from 'express';
import { DB, DB_NAME } from './db/config/db.config';
import { buildAllRoutes } from './routes';
import { ModelsType } from './db/model/buildAllModels';

const PORT = 5474;
export let prodModels: ModelsType = {} as ModelsType;

const app = express();
const prodDb = new DB(DB_NAME);
prodDb.start().then(() => {
  prodModels = prodDb.getModels();


  app.use(express.json());

  const router = buildAllRoutes(prodModels);
  app.use(router);

  app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
  });
}).catch((err: Error) => {
  console.log(err);
});

export { app };