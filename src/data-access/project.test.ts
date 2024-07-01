import { Sequelize } from "sequelize";
import { Model } from "sequelize/types";
import { Project, ProjectAttributes } from "../db/model";
import { IProjectsDB, buildProjectsDB } from "./project";
import { ModelStatic, Optional } from 'sequelize/types';
import { createRequest } from "node-mocks-http";

jest.mock('../db/model');
Project.create = jest.fn();
Project.findAll = jest.fn();
Project.findOne = jest.fn();

const mockedProject: ProjectAttributes = {
  name: 'book1',
  canvas_height: 100,
  canvas_width: 100,
  background_color: 'white',
};

type ProjectCreationAttributes = Optional<ProjectAttributes, 'id'>;  // Example: 'id' is auto-generated

describe('data-access:projects', () => {
  let db: Sequelize;
  let projectsDB: IProjectsDB;

  beforeEach(async () => {
    db = new Sequelize('sqlite::memory:');
    projectsDB = buildProjectsDB({ model: Project });
    await db.sync({ force: true });
    Project.findAll = jest.fn().mockResolvedValue([mockedProject]);

    Project.create = jest.fn().mockImplementation(async (data: ProjectCreationAttributes) => {
      return {
        id: 1,
        ...data
      };
    });

    Project.findOne = jest.fn().mockResolvedValue(mockedProject);
  });

  afterEach(async () => {
    await db.drop();
    await db.close();
  });

  describe('findAll', () => {
    it('returns projects when no parameters are given', async () => {
      const projects = await projectsDB.findAll();

      expect(projects).toHaveLength(1);
    });
  });

  describe('findById', () => {
    it('returns project when valid id is given', async () => {
      const project = await projectsDB.findById('1');

      expect(project).toEqual(mockedProject);
    });
  });

  describe('create', () => {
    it('returns created book when valid data is given', async () => {
      const book = await projectsDB.create({
        name: 'book1',
      });

      expect(book).toEqual({
        id: 1,
        name: 'book1'
      });
    });
  });
});