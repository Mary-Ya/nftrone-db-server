import { Sequelize } from 'sequelize';
import { DB } from '../db/config/db.config';
import { buildAllModels, ModelNames } from '../db/model/buildAllModels';
import { ILayersDB } from './layer';
import { LayerForCreation } from '../../shared/types/layer.types';
import { IProjectsDB } from './project';
import { testProjectData } from '../test/data/testProject';
import { testLayerData } from '../test/data/testLayer';

describe('Layer Data Access', () => {
  let db: DB;
  let sequelize: Sequelize;
  let models: ReturnType<typeof buildAllModels>;
  let layersDB: ILayersDB;
  let projectsDB: IProjectsDB;

  const createLayer = async (data: LayerForCreation) => {
    const project = (await projectsDB.create(testProjectData)).toJSON();
    const layer = (await layersDB.create({
      ...data,
      projectID: project.id!
    })).toJSON();
    return {
      layer, project
    }
  };

  beforeAll(async () => {
    db = new DB('nftrone-test.sqlite');
    await db.start(true);
    sequelize = await db.getSequelize();
    models = await db.getModels();
    layersDB = await require('../data-access/layer').buildLayersDB({
      layersModel: models[ModelNames.Layer],
      imagesModel: models[ModelNames.Image]
    });
    projectsDB = await require('../data-access/project').buildProjectsDB({
      model: models[ModelNames.Project],
      layersModel: models[ModelNames.Layer]
    });
  });

  afterAll(async () => {
    await db.close();
  });

  beforeEach(async () => {
    await models.Project.sync({ force: true });
  });


  const cleanLayerObject = (project: any) => {
    const { id, createdAt, updatedAt, privateId, images, ...cleanProject } = project.get ? project.get() : project;
    return cleanProject;
  };

  it('should create from minimal data and find by ID', async () => {
    const { layer: createdLayer, project: createdProject } = await createLayer(testLayerData);

    const cleanInitialData = cleanLayerObject(testLayerData);
    const cleanCreatedLayer = cleanLayerObject(createdLayer);

    expect({
      ...cleanInitialData,
      x: 0,
      y: 0,
      projectID: createdProject.id
    }).toStrictEqual(
      cleanCreatedLayer
    );
  });
});