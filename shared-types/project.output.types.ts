import { ProjectAttributes } from "../src/db/model";
import { SafeModelAttributes } from "./0common.types";

export type ReachProject = SafeModelAttributes<ProjectAttributes>;
export type ReachProjectList = ReachProject[];

export type PlaneProject = Omit<ReachProject, "layers">;
export type PlaneProjectList = PlaneProject[];
export type ProjectList = ReachProject[];

export type ProjectForCreation = Omit<ReachProject, "id" | "layers">;
