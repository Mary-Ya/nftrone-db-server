import { StatusCodes } from 'http-status-codes';
import { IHttpRequest } from "../../helpers/express-callback";
import { IControllerResponse } from '../controllers.types';
import { buildProjectsDB } from '../../data-access/project';

export const buildGetProjects = ({ listProjects }: { listProjects: ReturnType<typeof buildProjectsDB.findAll> }) => {
  return async (
    request: Partial<IHttpRequest>,
  ): Promise<IControllerResponse> => {
    const Projects = await listProjects();

    return {
      success: true,
      statusCode: StatusCodes.OK,
      body: Projects,
    };
  };
};