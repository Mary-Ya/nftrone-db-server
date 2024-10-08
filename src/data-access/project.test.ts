import { Sequelize } from 'sequelize';
import { DB } from '../db/config/db.config';
import { buildAllModels } from '../db/model/buildAllModels';
import { IProjectsDB } from '../data-access/project';
import { ProjectForCreation } from '../../shared/types/project.types';
import { testProjectData, testCleanProjectData } from '../test/data/testProject';

describe('Project Data Access', () => {
  let db: DB;
  let sequelize: Sequelize;
  let models: ReturnType<typeof buildAllModels>;
  let projectsDB: IProjectsDB;


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
    const createdProject = await createProject(testProjectData);
    const cleanProject = cleanProjectObject(createdProject);

    expect(cleanProject).toStrictEqual(testCleanProjectData);
  });

  it('should find all projects', async () => {
    await createProject(testProjectData);
    await createProject(testProjectData);

    const projects = await projectsDB.findAll();

    expect(projects).toHaveLength(2);
  });

  it('should find all plane projects', async () => {
    const { layers, ...planeProjectData } = testProjectData;

    await createProject(testProjectData);
    await createProject(testProjectData);

    const projects = await projectsDB.findAllPlane();

    expect(projects).toHaveLength(2);

    const cleanProject = cleanProjectObject(projects[0]);
    expect(cleanProject).toEqual(planeProjectData);
  });
});