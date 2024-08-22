import { Sequelize } from 'sequelize';
import { DB } from '../db/config/db.config';
import { buildAllModels, ModelNames } from '../db/model/buildAllModels';
import { ProjectAttributes, ProjectForCreation } from '../../shared/types/project.types';
import { ILayersDB } from './layer';
import { LayerAttributes, LayerForCreation } from '../../shared/types/layer.types';
import { IProjectsDB } from './project';

describe('Layer Data Access', () => {
  let db: DB;
  let sequelize: Sequelize;
  let models: ReturnType<typeof buildAllModels>;
  let layersDB: ILayersDB;
  let projectsDB: IProjectsDB;

  const projectData: ProjectAttributes = {
    name: 'My Test Project',
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

  const layerData: LayerAttributes = {
    name: 'My Test Project',
    canvas_width: 1000,
    canvas_height: 1000,
    projectID: '1',
    order: 0,
    images: []
  };

  const createLayer = async (data: LayerForCreation) => {
    const project = await projectsDB.create(projectData);
    const layer = await layersDB.create({
      ...data,
      projectID: project.id!
    });
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
    const { layer: createdLayer, project: createdProject } = await createLayer(layerData);

    const cleanInitialData = cleanLayerObject(layerData);
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