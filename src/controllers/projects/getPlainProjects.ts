import { Controller } from '../controllers.types';
import { PlainProjectListBody, PlaneProjectList } from '../../../shared/types/project.types';
import { IListProjects } from '../../services/projects';
import { StatusCodes } from "http-status-codes";


export const buildGetPlainProjects = ({ listPlainProjects }: { listPlainProjects: IListProjects<PlaneProjectList> }): Controller => {
  return async (
    // request,
  ) => {
    const projects = await listPlainProjects();
    return Promise.resolve({
      success: true,
      statusCode: StatusCodes.OK,
      body: {
        listPlainProjects: { projects }
      } satisfies PlainProjectListBody
    });
  };
};