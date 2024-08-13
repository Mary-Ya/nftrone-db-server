import { LayerAttributes } from "./layer.types";
import { SafeModelAttributes } from "./0common.types";

export interface ProjectAttributes {
  id?: string;
  name: string;
  canvas_height?: number;
  canvas_width?: number;
  background_color?: string;
  layers?: LayerAttributes[];
}


// output types ->
export type ReachProject = SafeModelAttributes<ProjectAttributes>;
export type ReachProjectList = ReachProject[];
export type ReachProjectBody = {
  project: ReachProject;
}

export type PlaneProject = Omit<ReachProject, "layers">;
export type PlaneProjectList = PlaneProject[];

export type PlainProjectListBody = {
  listPlainProjects: {
    // projects are wrapped to add metadata later
    projects: PlaneProjectList;
  };
}

export type ProjectListBody = {
  listProjects: {
    // projects are wrapped to add metadata later
    projects: ReachProjectList;
  }
}
export type ProjectForCreation = Omit<ReachProject, "id" | "layers">;
