import { Sequelize } from 'sequelize';
import { DB } from '../db/config/db.config';
import { buildAllModels } from '../db/model/buildAllModels';
import { IProjectsDB } from '../data-access/project';
import { ProjectAttributes } from '../db/model/project';
import { ProjectForCreation } from '../../shared/types/project.output.types';

describe('Project Data Access', () => {
  let db: DB;
  let sequelize: Sequelize;
  let models: ReturnType<typeof buildAllModels>;
  let projectsDB: IProjectsDB;

  const projectData: ProjectAttributes = {
    name: 'My Project',
    canvas_width: 1000,
    canvas_height: 1000,
    background_color: '#ffffff', // Optional for tests that don't need it
    layers: [{ // Optional for tests that don't need it
      name: 'Layer 1',
      x: 0,
      y: 0,
      canvas_width: 0,
      canvas_height: 0,
      order: 0,
      projectID: ''
    }]
  };

  const createProject = async (data: ProjectForCreation) => {
    return await projectsDB.create(data);
  };

  const cleanProjectObject = (project: any) => {
    const { id, createdAt, updatedAt, privateId, layers, ...cleanProject } = project.get ? project.get() : project;
    return cleanProject;
  };

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
    await db.close();
  });

  beforeEach(async () => {
    await models.Project.sync({ force: true });
  });

  it('should create a new project', async () => {
    const createdProject = await createProject(projectData);
    const cleanProject = cleanProjectObject(createdProject);


    // TBD add layers to the project
    const { layers, ...cleanProjectData } = projectData;

    expect(cleanProject).toStrictEqual(cleanProjectData);
  });

  it('should find all projects', async () => {
    await createProject(projectData);
    await createProject(projectData);

    const projects = await projectsDB.findAll();

    expect(projects).toHaveLength(2);
  });

  it('should find all plane projects', async () => {
    const { layers, ...planeProjectData } = projectData;

    await createProject(projectData);
    await createProject(projectData);

    const projects = await projectsDB.findAllPlane();

    expect(projects).toHaveLength(2);

    const cleanProject = cleanProjectObject(projects[0]);
    expect(cleanProject).toEqual(planeProjectData);
  });
});