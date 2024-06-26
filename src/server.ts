import express from 'express';
import sequelize from './config/db.config';
import { Project } from './model';

sequelize.sync().then(() => {
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

