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

export type PlaneProject = Omit<ReachProject, "layers">;
export type PlaneProjectList = PlaneProject[];
export type ProjectList = ReachProject[];

export type ProjectForCreation = Omit<ReachProject, "id" | "layers">;
