
import { PlaneProjectList, ReachProject, ReachProjectList } from '../../shared/types/project.types';
import { IProjectsDB } from '../data-access/project';
import { Request as ExpressRequest } from 'express';
import { IHttpRequest } from '../helpers/express-callback';

export type IListProjects<T> = () => Promise<T>;
export type IOneProject<T> = (request: ExpressRequest<IHttpRequest>) => Promise<T>;

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

export const buildGetProject = ({
  ProjectsDB,
}: {
  ProjectsDB: IProjectsDB;
}): IOneProject<ReachProject> => {
  return async (request: IHttpRequest) => {
    return await ProjectsDB.findById(request.params?.id);
  };
};

// export const buildCreateProject = ({
//   ProjectsDB,
// }: {
//   ProjectsDB: IProjectsDB;
// }): IListProjects => {
//   return async (req: Request) => {
//     return ProjectsDB.create();
//   };
// };