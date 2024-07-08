import { Sequelize } from 'sequelize';
import { DB } from '../db/config/db.config';
import { buildAllModels } from '../db/model/buildAllModels';
import { IProjectsDB } from '../data-access/project';

describe('Project Data Access', () => {
  let db: DB;
  let sequelize: Sequelize;
  let models: ReturnType<typeof buildAllModels>;
  let projectsDB: IProjectsDB;

  beforeAll(async () => {
    db = new DB('nftrone-test.sqlite');
    await db.start();
    sequelize = await db.getSequelize();
    models = await db.getModels();
    projectsDB = require('../data-access/project').buildProjectsDB({
      model: models.Project
    });
  });

  afterAll(async () => {
    // await db.close();
  });

  beforeEach(async () => {
    await models.Project.sync({ force: true });
  });

  it('should create a new project', async () => {
    const projectData = {
      name: 'My Project',
      canvas_width: 1000,
      canvas_height: 1000,
    };

    const createdProject = await projectsDB.create(projectData);

    // TBD: Remove createdAt, updatedAt, privateId from the object returned from get()
    const { id, createdAt, updatedAt, privateId, ...cleanProject } = createdProject.get();

    expect(cleanProject).toStrictEqual(projectData);
  });


  it('should find all projects', async () => {
    const projectData = {
      name: 'My Project',
      canvas_width: 1000,
      canvas_height: 1000,
    };

    await projectsDB.create(projectData);
    await projectsDB.create(projectData);

    const projects = await projectsDB.findAll();

    expect(projects).toHaveLength(2);
  });

  it('should find all plane projects', async () => {
    const projectData = {
      name: 'My Project',
      canvas_width: 1000,
      canvas_height: 1000,
      layers: [{
        name: 'Layer 1',
        objects: [{
          type: 'rectangle',
          x: 10,
          y: 10,
          width: 100,
          height: 100,
          fill: 'red',
        }]
      }]
    };

    await projectsDB.create(projectData);
    await projectsDB.create(projectData);

    const projects = await projectsDB.findAllPlane();

    expect(projects).toHaveLength(2);
  });
});