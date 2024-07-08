import express from 'express';
import { DB, DB_NAME } from './db/config/db.config';
import { buildAllRoutes } from './routes';
import { ModelsType } from './db/model/buildAllModels';

const PORT = 5474;
export let prodModels: ModelsType = {} as ModelsType;

const prodDb = new DB(DB_NAME);
prodDb.start().then(() => {
  prodModels = prodDb.getModels();


  const app = express();
  app.use(express.json());

  const router = buildAllRoutes(prodModels);
  app.use(router);

  app.post('/project', (req, res) => {
    const { name, canvas_height, canvas_width, background_color } = req.body;

    const newProject = prodModels.Project.build({
      name,
      canvas_height,
      canvas_width,
      background_color
    });
    console.log(newProject);
    newProject.validate().then(() => {

      console.log('Project is valid');
      newProject.save().then(() => {
        res.send('Project created');
      }).catch((err: Error) => {
        res.send(err);
      });
    }).catch((err: Error) => {
      console.log(err);
    });
  });

  app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
  });
}).catch((err: Error) => {
  console.log(err);
});
