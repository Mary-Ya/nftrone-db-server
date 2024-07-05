import express from 'express';
import sequelize from './db/config/db.config';
import { Project } from './db/model';
import { associations } from './db/config/db.associations';
import { projectRouter } from './routes/project';
import router from './routes';

sequelize.authenticate().then(() => {
  associations();
  console.log('Connection has been established successfully.');
})

sequelize.sync({
  force: true
}).then(() => {
  console.log('Database and tables synced!');
});

const PORT = 5474;

const app = express();

app.use(express.json());

// use router 
app.use(router);

app.post('/project', (req, res) => {
  const { name, canvas_height, canvas_width, background_color } = req.body;
  console.log(req.body);
  const newProject = Project.build({
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
    }).catch((err) => {
      res.send(err);
    });
  }).catch((err) => {
    console.log(err);
  });

});

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});
