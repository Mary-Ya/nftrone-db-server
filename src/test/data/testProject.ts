import { ProjectAttributes } from "../../../shared/types/project.types";

export const testProjectData: ProjectAttributes = {
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

const { layers, ...testCleanProjectData } = testProjectData;
export { testCleanProjectData };