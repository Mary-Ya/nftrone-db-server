import { StatusCodes } from 'http-status-codes';
import { IHttpRequest } from "../../helpers/express-callback";
import { IControllerResponse } from '../controllers.types';


export const buildGetProjects = ({ listProjects }: { listProjects: IListProjects }) => {
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