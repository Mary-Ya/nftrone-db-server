import express from 'express';
import { DB, DB_NAME } from './db/config/db.config';
import { buildAllRoutes } from './routes';
import { ModelsType } from './db/model/buildAllModels';
import { PORT } from '../shared/endpoints/0common';
import cors from "cors";
import bodyParser from 'body-parser';

export let prodModels: ModelsType = {} as ModelsType;

const app = express();
const prodDb = new DB(DB_NAME);
prodDb.start().then(() => {
  prodModels = prodDb.getModels();

  // Allow CORS
  // this will only be used locally
  app.use(cors());

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json())


  const router = buildAllRoutes(prodModels);
  app.use(router);

  app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
  });
}).catch((err: Error) => {
  console.log(err);
});

export { app };