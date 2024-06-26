import express from 'express';
import sequelize from './db/config/db.config';
import { Project } from './db/model';
import { associations } from './db/config/db.associations';

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

app.post('/project', (req, res) => {
  const { name, canvas_height, canvas_width, background_color } = req.body;
  console.log(name, canvas_height, canvas_width, background_color);
  Project.create(req.body).then((project) => {
    res.send(project);
  });
});

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});
