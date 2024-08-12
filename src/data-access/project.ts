import { PlaneProjectList, ProjectForCreation, ReachProject, ReachProjectList } from "../../shared/types/project.types";
import { modelToPlainList } from "../data-mappers/model-to-plain-list";
import { ProjectModelType } from "../db/model/buildAllModels";
import { IOneProject } from "../services/projects";

export interface IProjectsDB {
  findAll: () => Promise<ReachProjectList>;
  findAllPlane: () => Promise<PlaneProjectList>;
  findById: (id: string) => Promise<IOneProject<ReachProject>>;
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
    console.log('findById', id);
    const proj = await model.findOne({ where: { id } })
    return await proj?.toJSON();
  }

  const create = async (data: ProjectForCreation) => {
    return model.create(data);
  };

  return {
    findAll,
    findAllPlane,
    findById,
    create,
  };
};