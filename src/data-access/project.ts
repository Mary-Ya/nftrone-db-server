import { Project, ProjectAttributes } from "../db/model";

type ProjectForCreation = Omit<ProjectAttributes, "id">;

export interface IProjectsDB {
  findAll: () => Promise<Project[]>;
  findById: (id: string) => Promise<Project | null>;
  create: (data: ProjectForCreation) => Promise<Project>;
}

export const buildProjectsDB = ({
  model
}: {
  model: typeof Project;
}): IProjectsDB => {
  const findAll = async () => {
    return model.findAll();
  };

  const findById = async (id: string) => {
    return model.findOne({ where: { id } });
  }

  const create = async (data: ProjectForCreation) => {
    return model.create(data);
  };

  return {
    findAll,
    findById,
    create,
  };
};