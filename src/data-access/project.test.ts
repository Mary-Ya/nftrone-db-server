import { Project, ProjectAttributes } from "../db/model";
import { getProjectModel } from "../db/model/project";
import { buildProjectsDB } from "./project";
import { Optional } from 'sequelize/types';

const {
  sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkPropertyExists
} = require('sequelize-test-helpers')

const mockedProject: ProjectAttributes = {
  name: 'proj1',
  canvas_height: 100,
  canvas_width: 100,
  background_color: 'white',
  layers: [],
};

type ProjectCreationAttributes = Optional<ProjectAttributes, 'id'>;  // Example: 'id' is auto-generated

describe('data-access:projects', () => {

  beforeEach(() => {
    // Import the mock library

  });

  describe('findAll', () => {
    it('returns projects when no parameters are given', async () => {

      const ProjectMock = getProjectModel(sequelize, dataTypes)


      const projectsDB = buildProjectsDB({
        model: ProjectMock
      });


      const projects = await projectsDB.findAll();

      expect(projects).toHaveLength(1);
      expect(projects[0]).toEqual({
        ...mockedProject,
        id: 1,
      });
    });
  });

  // describe.skip('findAllPlane', () => {
  //   it('returns plane projects when no parameters are given', async () => {

  //     // Setup the mock database connection
  //     var DBConnectionMock = new SequelizeMock();

  //     // Define our Model
  //     var ProjectMock = DBConnectionMock.define('project', {
  //       ...mockedProject,
  //     }, {
  //       timestamps: false,

  //     });

  //     const projectsDB = buildProjectsDB({
  //       model: ProjectMock
  //     })

  //     // const projects = await projectsDB.findAllPlane();

  //     const projects = await ProjectMock.findAll({
  //       raw: true,
  //       attributes: ["name"]
  //     });

  //     expect(projects).toHaveLength(1);

  //     const { layers, ...project } = mockedProject;
  //     const { id, ...clearProject } = projects[0];
  //     expect(clearProject).toEqual({
  //       ...project,
  //     });
  //   });
  // });

  // describe.skip('findById', () => {
  //   // Setup the mock database connection
  //   var DBConnectionMock = new SequelizeMock();

  //   // Define our Model
  //   var ProjectMock = DBConnectionMock.define('project', {
  //     ...mockedProject,
  //   });

  //   const projectsDB = buildProjectsDB({
  //     model: ProjectMock
  //   });

  //   it('returns project when valid id is given', async () => {
  //     const project = await projectsDB.findById('1');

  //     expect(project).toEqual(mockedProject);
  //   });
  // });

  // describe.skip('create', () => {
  //   it('returns created book when valid data is given', async () => {
  //     var SequelizeMock = require('sequelize-mock');

  //     // Setup the mock database connection
  //     var DBConnectionMock = new SequelizeMock();

  //     // Define our Model
  //     var ProjectMock = DBConnectionMock.define('project', {
  //       ...new Project({
  //         name: 'book1',
  //         canvas_height: 100,
  //         canvas_width: 100,
  //         background_color: 'white',
  //         layers: [],
  //       })
  //     });

  //     const projectsDB = buildProjectsDB({
  //       model: ProjectMock
  //     });

  //     const book = await projectsDB.create({
  //       name: 'book1',
  //     });

  //     expect(book).toEqual({
  //       id: "1",
  //       name: 'book1'
  //     });
  //   });
  // });
});