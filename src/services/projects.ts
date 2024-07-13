
import { PlaneProjectList, ReachProjectList } from '../../shared/types/project.output.types';
import { IProjectsDB } from '../data-access/project';

export type IListProjects<T> = () => Promise<T>;

export const buildListProjects = ({
  ProjectsDB,
}: {
  ProjectsDB: IProjectsDB;
}): IListProjects<ReachProjectList> => {
  return async () => {
    return await ProjectsDB.findAll();
  };
};

export const buildListPlaneProjects = ({
  ProjectsDB,
}: {
  ProjectsDB: IProjectsDB;
}): IListProjects<PlaneProjectList> => {
  return async () => {
    return await ProjectsDB.findAllPlane();
  };
};

// export const buildGetProject = ({
//   ProjectsDB,
// }: {
//   ProjectsDB: IProjectsDB;
// }): IListProjects => {
//   return async (request: Request) => {
//     const data = await request?.json();
//     return ProjectsDB.findById(data.id);
//   };
// };

// export const buildCreateProject = ({
//   ProjectsDB,
// }: {
//   ProjectsDB: IProjectsDB;
// }): IListProjects => {
//   return async (req: Request) => {
//     return ProjectsDB.create();
//   };
// };