import { PlaneProjectList, ProjectForCreation, ReachProjectList } from "../../shared/types/project.output.types";
import { modelToPlainList } from "../data-mappers/model-to-plain-list";
import { ProjectModelType } from "../db/model/buildAllModels";

export interface IProjectsDB {
  findAll: () => Promise<ReachProjectList>;
  findAllPlane: () => Promise<PlaneProjectList>;
  findById: (id: string) => Promise<any | null>;
  create: (data: ProjectForCreation) => Promise<any>;
}

export const buildProjectsDB = ({
  model
}: {
  model: ProjectModelType;
}): IProjectsDB => {
  const findAll = async () => {
    const projects = await model.findAll();
    return projects.map((project) => {
      const p = project.toJSON();
      return p;
    });
  };

  const findAllPlane = async () => {
    const projects = await model.scope('plane').findAll();
    return modelToPlainList(projects);
  }

  const findById = async (id: string) => {
    return model.findOne({ where: { id }, plain: true });
  }

  const create = async (data: ProjectForCreation) => {
    // TBD: add layers to the project

    return model.create(data);
  };

  return {
    findAll,
    findAllPlane,
    findById,
    create,
  };
};