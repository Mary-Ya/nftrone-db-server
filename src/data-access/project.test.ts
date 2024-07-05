import { Sequelize } from 'sequelize';
import { DB } from '../db/config/db.config';
import { buildAllModels } from '../db/model/buildAllModels';

describe('Project Data Access', () => {
  let sequelize: Sequelize;
  let models: ReturnType<typeof buildAllModels>;

  beforeAll(async () => {
    sequelize = await new DB('test.sqlite').start();
  });

  afterAll(async () => {
    await sequelize.close();
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

    const createdProject = await models.Project.create(projectData);

    expect(createdProject.get('name')).toBe(projectData.name);
  });

  // Add more test cases here

});